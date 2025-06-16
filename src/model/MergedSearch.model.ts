import {YouTubeSearchRequest, YouTubeSearchResponse} from './YouTubeSearch.model';
import {SpotifySearchRequest, SpotifySearchResponse} from './SpotifySearch.model';

export interface MergedSearchRequest {
  q: string;

  region?: string;
  limit?: number;

  ytPart: string;
  ytType?: 'video' | 'channel' | 'playlist';
  ytOrder?: 'date' | 'rating' | 'relevance' | 'title' | 'videoCount' | 'viewCount';
  ytDuration?: 'any' | 'short' | 'medium' | 'long';
  ytPageToken?: string;

  spType?: 'track' | 'album' | 'artist' | 'playlist';
  spOffset?: number;
}

export class MergedSearchRequestBuilder {
  private readonly request: MergedSearchRequest;

  constructor() {
    this.request = {
      q: '',
      ytPart: ''
    };
  }

  setQuery(q: string): this {
    this.request.q = q;
    return this;
  }

  setRegion(region: string): this {
    this.request.region = region;
    return this;
  }

  setLimit(limit: number): this {
    this.request.limit = limit;
    return this;
  }

  setYTPart(part: string): this {
    this.request.ytPart = part;
    return this;
  }

  setYTType(type: 'video' | 'channel' | 'playlist'): this {
    this.request.ytType = type;
    return this;
  }

  setYTOrder(order: 'date' | 'rating' | 'relevance' | 'title' | 'videoCount' | 'viewCount'): this {
    this.request.ytOrder = order;
    return this;
  }

  setYTDuration(duration: 'any' | 'short' | 'medium' | 'long'): this {
    this.request.ytDuration = duration;
    return this;
  }

  setYTPageToken(token: string): this {
    this.request.ytPageToken = token;
    return this;
  }

  setSPType(type: 'track' | 'album' | 'artist' | 'playlist'): this {
    this.request.spType = type;
    return this;
  }

  setSPOffset(offset: number): this {
    this.request.spOffset = offset;
    return this;
  }

  build(): MergedSearchRequest {
    return {...this.request};
  }
}

export interface MergedSearchResponse {
  items: {
    id: string;
    title: string;
    description: string;
    thumbnailUrl: string[];
    channelTitle?: string;
    publishedAt?: string;
    platform: 'youtube' | 'spotify' | 'both';
  }[];
}

export class RequestConversionUtil {
  static toYTSearchRequest(request: MergedSearchRequest): YouTubeSearchRequest {
    return {
      part: request.ytPart,
      q: request.q,
      maxResults: request.limit,
      pageToken: request.ytPageToken,
      type: request.ytType,
      order: request.ytOrder,
      videoDuration: request.ytDuration,
      regionCode: request.region
    };
  }

  static toSpotifySearchRequest(request: MergedSearchRequest): SpotifySearchRequest {
    return {
      q: request.q,
      type: request.spType ? request.spType : 'track',
      limit: request.limit,
      offset: request.spOffset
    }
  }

  static toCombinedSearchResponse(youtubeResponse: YouTubeSearchResponse, spotifyResponse: SpotifySearchResponse): MergedSearchResponse {
    const mergedMap = new Map<string, MergedSearchResponse['items'][number]>();

    youtubeResponse.items.forEach(item => {
      const title = item.snippet.title;
      const channelTitle = item.snippet.channelTitle;
      const key = `${title}-${channelTitle}`;
      mergedMap.set(key, {
        id: item.videoId || '',
        title,
        description: item.snippet.description,
        thumbnailUrl: [
          item.snippet.thumbnails.default.url,
          item.snippet.thumbnails.medium.url,
          item.snippet.thumbnails.high.url,
        ],
        channelTitle,
        publishedAt: item.snippet.publishedAt,
        platform: 'youtube',
      });
    });

    spotifyResponse.tracks.items.forEach(track => {
      const title = track.name;
      const artistNames = track.artists.map(artist => artist.name).join(', ');
      const key = `${title}-${artistNames}`;
      if (mergedMap.has(key)) {
        const existing = mergedMap.get(key);
        if (existing) existing.platform = 'both';
      } else {
        mergedMap.set(key, {
          id: track.id,
          title,
          description: artistNames,
          thumbnailUrl: track.album.images.map(image => image.url),
          platform: 'spotify',
        });
      }
    });

    return {items: Array.from(mergedMap.values())};
  }
}
