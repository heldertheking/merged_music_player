export interface YouTubeSearchRequest {
  part: string;
  q: string;
  maxResults?: number;
  pageToken?: string;
  order?: 'date' | 'rating' | 'relevance' | 'title' | 'videoCount' | 'viewCount';
  type?: 'video' | 'channel' | 'playlist';
  videoDuration?: 'any' | 'short' | 'medium' | 'long';
  regionCode?: string;
}

export class YouTubeSearchRequestBuilder {
  private request: Partial<YouTubeSearchRequest> = {};

  setQuery(q: string): YouTubeSearchRequestBuilder {
    this.request.q = q;
    return this;
  }

  setMaxResults(maxResults: number): YouTubeSearchRequestBuilder {
    this.request.maxResults = maxResults;
    return this;
  }

  setPageToken(pageToken: string): YouTubeSearchRequestBuilder {
    this.request.pageToken = pageToken;
    return this;
  }

  setType(type: 'video' | 'channel' | 'playlist'): YouTubeSearchRequestBuilder {
    this.request.type = type;
    return this;
  }

  build(): YouTubeSearchRequest {
    if (!this.request.q) {
      throw new Error('Required fields "part" and "q" must be set.');
    }
    return this.request as YouTubeSearchRequest;
  }
}

export interface YouTubeSearchResponse {
  nextPageToken?: string;
  prevPageToken?: string;
  items: {
    snippet: {
      publishedAt: string;
      channelId: string;
      title: string;
      description: string;
      thumbnails: {
        default: { url: string; width: number; height: number; };
        medium: { url: string; width: number; height: number; };
        high: { url: string; width: number; height: number; };
      };
      channelTitle: string;
      liveBroadcastContent: string;
    };
    id: {videoId: string;}
  }[];
}
