import {Injectable} from '@angular/core';
import {catchError, forkJoin, map, Observable, of} from 'rxjs';
import {YoutubeService} from './youtube-data-api.service';
import {SpotifyWebApiService} from './spotify-web-api.service';
import {MergedSearchRequest, MergedSearchResponse, RequestConversionUtil} from '../model/MergedSearch.model';
import {YouTubeSearchResponse} from '../model/YouTubeSearch.model';
import {SpotifySearchResponse} from '../model/SpotifySearch.model';

@Injectable({
  providedIn: 'root'
})
export class MergerService {

  constructor(private youtubeService: YoutubeService, private spotifyService: SpotifyWebApiService) {
  }

  search(request: MergedSearchRequest) {
    let nextPageToken: string = '';
    let prevPageToken: string = '';
    let offset: number = 0;

    console.log("Request: ", request);

    const ytSearch$: Observable<YouTubeSearchResponse> = this.youtubeService.searchVideos(
      RequestConversionUtil.toYTSearchRequest(request)
    ).pipe(
      catchError(error => {
        console.error('Youtube API error:', error);
        return of({items: []} as YouTubeSearchResponse); // Return an empty response on error
      })
    );

    const spotifySearch$: Observable<SpotifySearchResponse> = this.spotifyService.searchSongs(
      RequestConversionUtil.toSpotifySearchRequest(request)
    ).pipe(
      catchError(error => {
        console.error('Spotify API error:', error);
        return of({tracks: {items: []}} as SpotifySearchResponse); // Return an empty response on error
      })
    );

    return forkJoin([ytSearch$, spotifySearch$]).pipe(
      map(([youtubeResponse, spotifyResponse]) => {
        const mergedResponse: MergedSearchResponse = RequestConversionUtil.toCombinedSearchResponse(
          youtubeResponse,
          spotifyResponse
        );

        // Update pagination tokens and offset
        nextPageToken = youtubeResponse.nextPageToken || '';
        prevPageToken = youtubeResponse.prevPageToken || '';
        offset = request.spOffset || 0;

        return {
          ...mergedResponse,
          nextPageToken,
          prevPageToken,
          offset
        };
      })
    );
  }
}
