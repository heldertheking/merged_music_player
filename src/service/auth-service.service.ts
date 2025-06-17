import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Router} from '@angular/router';

@Injectable({providedIn: 'root'})
export class AuthService {
  private readonly redirectUri = 'http://127.0.0.1:4200/auth_callback';
  private readonly youtubeClientId = '511891274934-a4d78n8vjouhj7bvvr76f1emvt29cbn0.apps.googleusercontent.com';
  private readonly spotifyClientId = '071beddb35e844d4a23abff81bd619a0';
  private readonly spotifyScopes = [
    'user-read-private', 'user-read-email', 'playlist-modify-public',
    'playlist-modify-private', 'playlist-read-private', 'user-library-read',
    'streaming', 'user-modify-playback-state'
  ].join(' ');
  private readonly youtubeScopes = [
    'https://www.googleapis.com/auth/youtube.readonly'
  ].join(' ');

  constructor(private http: HttpClient, private router: Router) {
  }

  // PKCE helpers
  private generateCodeVerifier(): string {
    const array = new Uint8Array(32);
    window.crypto.getRandomValues(array);
    return btoa(String.fromCharCode(...array))
      .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }

  private async generateCodeChallenge(codeVerifier: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);
    const digest = await window.crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode(...new Uint8Array(digest)))
      .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }

  async login(provider: 'spotify' | 'youtube') {
    const codeVerifier = this.generateCodeVerifier();
    const codeChallenge = await this.generateCodeChallenge(codeVerifier);
    sessionStorage.setItem(`${provider}_code_verifier`, codeVerifier);

    let url = '';
    if (provider === 'spotify') {
      url = `https://accounts.spotify.com/authorize?client_id=${this.spotifyClientId}` +
        `&response_type=code&redirect_uri=${encodeURIComponent(this.redirectUri)}` +
        `&scope=${encodeURIComponent(this.spotifyScopes)}` +
        `&code_challenge_method=S256&code_challenge=${codeChallenge}&state=spotify`;
    } else {
      url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${this.youtubeClientId}` +
        `&response_type=code&redirect_uri=${encodeURIComponent(this.redirectUri)}` +
        `&scope=${encodeURIComponent(this.youtubeScopes)}` +
        `&code_challenge_method=S256&code_challenge=${codeChallenge}` +
        `&access_type=offline&prompt=consent&state=youtube`;
    }
    window.location.href = url;
  }

  // Handle redirect after login
  handleAuthCallback(): void {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const state = params.get('state'); // 'spotify' or 'youtube'
    console.log(code, state)
    if (!code || !state) {
      return;
    }
    const codeVerifier = sessionStorage.getItem(`${state}_code_verifier`);
    if (!codeVerifier) {
      return;
    }

    if (state === 'spotify') {
      // Spotify token endpoint
      const body = new HttpParams()
        .set('grant_type', 'authorization_code')
        .set('code', code)
        .set('redirect_uri', this.redirectUri)
        .set('client_id', this.spotifyClientId)
        .set('code_verifier', codeVerifier);

      this.http.post<any>('https://accounts.spotify.com/api/token', body, {
        headers: new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'})
      }).subscribe(tokens => {
        this.setTokens(state, tokens);
        this.router.navigate(['/']);
      });
    } else {
      // YouTube (Google) token endpoint
      const body = new HttpParams()
        .set('grant_type', 'authorization_code')
        .set('code', code)
        .set('redirect_uri', this.redirectUri)
        .set('client_id', this.youtubeClientId)
        .set('code_verifier', codeVerifier);

      this.http.post<any>('https://oauth2.googleapis.com/token', body, {
        headers: new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'})
      }).subscribe(tokens => {
        this.setTokens(state, tokens);
        this.router.navigate(['/']);
      });
    }
  }

  private setTokens(provider: string, tokens: any) {
    const now = Date.now();
    localStorage.setItem(`${provider}_access_token`, tokens.access_token);
    if (tokens.refresh_token) {
      localStorage.setItem(`${provider}_refresh_token`, tokens.refresh_token);
    }
    localStorage.setItem(`${provider}_expires_at`, (now + tokens.expires_in * 1000).toString());
  }

  getAccessToken(provider: 'spotify' | 'youtube'): string | null {
    const expiresAt = Number(localStorage.getItem(`${provider}_expires_at`));
    if (Date.now() > expiresAt) {
      this.refreshToken(provider);
      return null;
    }
    return localStorage.getItem(`${provider}_access_token`);
  }

  refreshToken(provider: 'spotify' | 'youtube') {
    const refreshToken = localStorage.getItem(`${provider}_refresh_token`);
    if (!refreshToken) return;

    let url = '';
    let body = new HttpParams();
    if (provider === 'spotify') {
      url = 'https://accounts.spotify.com/api/token';
      body = body
        .set('grant_type', 'refresh_token')
        .set('refresh_token', refreshToken)
        .set('client_id', this.spotifyClientId);
    } else {
      url = 'https://oauth2.googleapis.com/token';
      body = body
        .set('grant_type', 'refresh_token')
        .set('refresh_token', refreshToken)
        .set('client_id', this.youtubeClientId);
    }

    this.http.post<any>(url, body, {
      headers: new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'})
    }).subscribe(tokens => {
      this.setTokens(provider, tokens);
    });
  }

  keepSessionAlive(provider: 'spotify' | 'youtube') {
    setInterval(() => {
      const expiresAt = Number(localStorage.getItem(`${provider}_expires_at`));
      if (Date.now() > expiresAt - 60 * 1000) {
        this.refreshToken(provider);
      }
    }, 60 * 1000);
  }

  logout(provider: 'spotify' | 'youtube') {
    localStorage.removeItem(`${provider}_access_token`);
    localStorage.removeItem(`${provider}_refresh_token`);
    localStorage.removeItem(`${provider}_expires_at`);
  }
}
