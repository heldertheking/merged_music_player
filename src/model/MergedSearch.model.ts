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

  static toCombinedSearchResponse(
    youtubeResponse: YouTubeSearchResponse,
    spotifyResponse: SpotifySearchResponse
  ): MergedSearchResponse {
    // Normalize and clean artist/channel names for matching
    function cleanArtistName(name: string): string {
      return name
        .replace(/vevo$/i, '')           // Remove 'VEVO' at end
        .replace(/official$/i, '')       // Remove 'Official' at end
        .replace(/[\s\/\-\.]/g, '')      // Remove spaces, slashes, dashes, dots
        .replace(/&/g, 'and')            // Replace '&' with 'and'
        .toLowerCase();
    }

    // Normalize and clean YouTube titles for matching
    function cleanTitle(title: string): string {
      let cleaned = title.trim();

      // Remove artist prefix: "Artist - Title"
      cleaned = cleaned.replace(/^[\w\s&\/\.\'\!]+-\s*/i, '');

      // Remove parenthetical info: "(Official Video)", "(Live)", etc.
      cleaned = cleaned.replace(/\([^\)]*\)/g, '');

      // Remove extra whitespace and lowercase
      cleaned = cleaned.replace(/\s+/g, ' ').trim().toLowerCase();

      return cleaned;
    }

    const mergedMap = new Map<string, MergedSearchResponse['items'][number]>();
    const order: string[] = [];

    // Process Spotify first to prefer its artwork
    spotifyResponse.tracks.items.forEach(track => {
      const title = track.name.trim().toLowerCase();
      const artistNames = track.artists.map(a => cleanArtistName(a.name)).join(',');
      const key = `${title}-${artistNames}`;
      if (!mergedMap.has(key)) {
        mergedMap.set(key, {
          id: track.id,
          title: track.name,
          description: track.artists.map(a => a.name).join(', '),
          thumbnailUrl: track.album.images.map(img => img.url),
          channelTitle: track.artists.map(a => a.name).join(', '),
          publishedAt: undefined,
          platform: 'spotify',
        });
        order.push(key);
      }
    });

    // Process YouTube and attempt to match with Spotify using cleaned names and titles
    youtubeResponse.items.forEach(item => {
      const title = cleanTitle(item.snippet.title);
      const channelTitle = cleanArtistName(item.snippet.channelTitle);
      const key = `${title}-${channelTitle}`;
      if (!mergedMap.has(key)) {
        mergedMap.set(key, {
          id: item.videoId || '',
          title: item.snippet.title,
          description: item.snippet.description,
          thumbnailUrl: [
            item.snippet.thumbnails.default.url,
            item.snippet.thumbnails.medium.url,
            item.snippet.thumbnails.high.url,
          ],
          channelTitle: item.snippet.channelTitle,
          publishedAt: item.snippet.publishedAt,
          platform: 'youtube',
        });
        order.push(key);
      } else {
        // If exists (from Spotify), update platform to 'both' and add YouTube metadata if needed
        const existing = mergedMap.get(key)!;
        existing.platform = 'both';
        existing.id = existing.id || (item.videoId || '');
        existing.publishedAt = existing.publishedAt || item.snippet.publishedAt;
        existing.description = existing.description || item.snippet.description;
        existing.channelTitle = existing.channelTitle || item.snippet.channelTitle;
        // Keep Spotify artwork (already set)
      }
    });

    // Mix results: alternate as much as possible between both, spotify-only, youtube-only
    const spotifyKeys = order.filter(key => mergedMap.get(key)!.platform === 'spotify');
    const youtubeKeys = order.filter(key => mergedMap.get(key)!.platform === 'youtube');
    const bothKeys = order.filter(key => mergedMap.get(key)!.platform === 'both');

    const mixed: MergedSearchResponse['items'][number][] = [];
    let s = 0, y = 0, b = 0;
    while (s < spotifyKeys.length || y < youtubeKeys.length || b < bothKeys.length) {
      if (b < bothKeys.length) mixed.push(mergedMap.get(bothKeys[b++])!);
      if (s < spotifyKeys.length) mixed.push(mergedMap.get(spotifyKeys[s++])!);
      if (y < youtubeKeys.length) mixed.push(mergedMap.get(youtubeKeys[y++])!);
    }

    return { items: mixed };
  }


}
