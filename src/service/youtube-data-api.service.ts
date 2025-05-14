import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class YoutubeService {
  private apiKey: string = 'AIzaSyBEm86x68t-FNMEzeqy9JgbASuy6maIC_M';
  private apiUrl: string = 'https://www.googleapis.com/youtube/v3'; // Base URL for YouTube API

  constructor(private http: HttpClient) {
    if (!this.apiKey) {
      console.warn('YouTube API key is missing. Please configure it in the YoutubeService.');
    }
  }

  /**
   * Performs a general request to the YouTube API.
   * @param endpoint The specific API endpoint (e.g., 'search', 'videos').
   * @param params An object containing the parameters for the request.
   * @returns An Observable containing the API response.
   */
  private request<T>(endpoint: string, params: { [param: string]: string | number | boolean | undefined }): Observable<T> {
    if (!this.apiKey) {
      return throwError(() => new Error('API key is not configured.'));
    }

    const httpParams = new HttpParams({ fromObject: this.cleanParams(params) }).set('key', this.apiKey);
    const url = `${this.apiUrl}/${endpoint}`;

    return this.http.get<T>(url, { params: httpParams }).pipe(
      catchError((error: any) => {
        console.error(`YouTube API Error (${endpoint}):`, error);
        return throwError(() => new Error(`An error occurred while accessing the YouTube API endpoint: ${endpoint}`));
      })
    );
  }

  /**
   * Searches specifically for songs on YouTube using the provided query.
   * @param query The search query (e.g., "song name artist").
   * @param maxResults The maximum number of results to return (default: 10, max: 50).
   * @param pageToken (Optional) Token for pagination.
   * @returns An Observable that emits an array of song items or an error.
   */
  searchSongs(query: string, maxResults: number = 24, pageToken?: string): Observable<SearchResponse> {
    if (!query) {
      return of({ items: [] }); // Return empty result for empty query
    }

    return this.request<SearchResponse>('search', {
      part: 'snippet',
      q: query + 'YouTube Music song',
      type: 'video',
      videoCategoryId: 10, // Music category
      maxResults: Math.min(maxResults, 50),
      fields: 'items(id/videoId,snippet(title,description,thumbnails/default,channelTitle)),nextPageToken',
      pageToken,
      videoDefinition: 'high', // Prefer high-quality videos
      videoDuration: 'medium', // Filter for medium-length videos (e.g., songs)
    });
  }

  /**
   * Cleans the parameters object by removing undefined values.
   * This prevents unnecessary parameters from being sent in the HTTP request.
   * @private
   * @param params The parameters object.
   * @returns A new object with defined values.
   */
  private cleanParams(params: { [param: string]: string | number | boolean | undefined }): { [param: string]: string | number | boolean } {
    const cleanedParams: { [param: string]: string | number | boolean } = {};
    for (const key in params) {
      if (params[key] !== undefined) {
        cleanedParams[key] = params[key]!;
      }
    }
    return cleanedParams;
  }
}

// Interface for the search result item
export interface SearchResultItem {
  id: {
    videoId: string;
  };
  snippet: {
    title: string;
    description: string;
    thumbnails: {
      default: {
        url: string;
      };
    };
    channelTitle: string;
  };
}

// Interface for the search response
export interface SearchResponse {
  items: SearchResultItem[];
  nextPageToken?: string;
}
