import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {YouTubeSearchRequest, YouTubeSearchResponse} from '../model/YouTubeSearch.model';
import {AuthService} from './auth-service.service';

@Injectable({
  providedIn: 'root',
})
export class YoutubeService {
  private apiKey: string = 'AIzaSyBEm86x68t-FNMEzeqy9JgbASuy6maIC_M';
  private readonly API_URL = 'https://www.googleapis.com/youtube/v3/search';

  constructor(private http: HttpClient, private auth: AuthService) {
  }

  searchVideos(request: YouTubeSearchRequest): Observable<YouTubeSearchResponse> {
    const token = this.auth.getAccessToken('youtube');
    let headers = null;
    if (token) {
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
    }


    const httpParams = new HttpParams()
      .set('part', 'snippet')
      .set('q', request.q + 'Youtube Music Songs')
      .set('maxResults', request.maxResults ? Math.min(request.maxResults, 24).toString() : '8')
      .set('pageToken', request.pageToken || '')
      .set('order', request.order || 'relevance')
      .set('type', request.type || 'video')
      .set('videoDuration', 'medium')
      .set('key', this.apiKey);

    console.log("Request: ", httpParams);

    return this.http.get<YouTubeSearchResponse>(this.API_URL, {headers: headers ? headers : undefined, params: httpParams});
  }
}
