export interface SpotifySearchRequest {
  q: string;
  type: string;
  market?: string;
  limit?: number;
  offset?: number;
}

export class SpotifySearchRequestBuilder {
  private request: SpotifySearchRequest = {
    q: '',
    type: ''
  };

  setQuery(query: string): SpotifySearchRequestBuilder {
    this.request.q = query;
    return this;
  }

  setType(type: string): SpotifySearchRequestBuilder {
    this.request.type = type;
    return this;
  }

  setMarket(market: string): SpotifySearchRequestBuilder {
    this.request.market = market;
    return this;
  }

  setLimit(limit: number): SpotifySearchRequestBuilder {
    this.request.limit = limit;
    return this;
  }

  setOffset(offset: number): SpotifySearchRequestBuilder {
    this.request.offset = offset;
    return this;
  }

  build(): SpotifySearchRequest {
    return this.request;
  }
}

export interface SpotifySearchResponse {
  tracks: {
    items: {
      name: string;
      id: string;
      href: string;
      artists: {
        name: string;
        id: string;
        href: string;
      }[];
      album: {
        name: string;
        id: string;
        href: string;
        images: {
          height: number;
          url: string;
          width: number;
        }[];
      };
      preview_url: string;
    }[];
  };
}
