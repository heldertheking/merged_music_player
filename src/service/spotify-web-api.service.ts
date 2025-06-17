import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {SpotifySearchRequest, SpotifySearchResponse} from '../model/SpotifySearch.model';
import {AuthService} from './auth-service.service';

@Injectable({
  providedIn: 'root'
})
export class SpotifyWebApiService {
  private apiUrl = 'https://api.spotify.com/v1/search';

  constructor(private http: HttpClient, private auth: AuthService) {}

  searchSongs(request: SpotifySearchRequest): Observable<SpotifySearchResponse> {
    const token = this.auth.getAccessToken('spotify');
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
}
