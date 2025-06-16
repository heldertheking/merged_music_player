import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {SpotifySearchRequest, SpotifySearchResponse} from '../model/SpotifySearch.model';
import {
  SpotifyLoginRequest,
  SpotifyLoginResponse,
  SpotifyRefreshRequest,
  SpotifyRefreshResponse
} from '../model/SpotifyOAuth.model';
import {TokenManagerService} from './token-manager.service';

@Injectable({
  providedIn: 'root'
})
export class SpotifyWebApiService {
  private apiUrl = 'https://api.spotify.com/v1/search';
  private tokenUrl = 'https://accounts.spotify.com/api/token';

  constructor(private http: HttpClient, private tokenManager: TokenManagerService) {}

  async saveToken(token: string): Promise<void> {
    await this.tokenManager.saveToken('spotify', token);
  }

  async getToken(): Promise<string | null> {
    return await this.tokenManager.getToken('spotify');
  }

  async deleteToken(): Promise<void> {
    await this.tokenManager.deleteToken('spotify');
  }

  searchSongs(request: SpotifySearchRequest): Observable<SpotifySearchResponse> {
    const token = this.tokenManager.getToken('spotify');
    if (!token) {
      console.error("No token found for Spotify");
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const params = {
      q: request.q,
      type: request.type,
      market: request.market || 'US',
      limit: Math.min(request.limit || 24, 24),
      offset: request.offset || 0,
    };

    return this.http.get<SpotifySearchResponse>(this.apiUrl, { headers, params });
  }

  login(request: SpotifyLoginRequest): Observable<SpotifyLoginResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    const body = new URLSearchParams({
      client_id: request.client_id,
      response_type: request.response_type,
      redirect_uri: request.redirect_uri,
      scope: request.scope,
      state: request.state || '',
    }).toString();

    return this.http.post<SpotifyLoginResponse>(this.tokenUrl, body, { headers });
  }

  refreshAccessToken(refreshRequest: SpotifyRefreshRequest): Observable<SpotifyRefreshResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    const body = new URLSearchParams({
      client_id: refreshRequest.client_id,
      grant_type: refreshRequest.grant_type,
      refresh_token: refreshRequest.refresh_token,
    }).toString();

    return this.http.post<SpotifyRefreshResponse>(this.tokenUrl, body, { headers });
  }
}
