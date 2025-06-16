export interface PlaylistCreateRequest {
  part: string;
  snippet: {
    title: string;
    description?: string;
  };
  status: {
    privacyStatus: 'private' | 'public' | 'unlisted';
  };
}

export interface PlaylistUpdateRequest {
  part: string;
  id: string;
  snippet: {
    title?: string;
    description?: string;
  };
  status?: {
    privacyStatus?: 'private' | 'public' | 'unlisted';
  };
}

export interface PlaylistDeleteRequest {
  id: string;
}

export interface PlaylistItemAddRequest {
  part: string;
  snippet: {
    playlistId: string;
    resourceId: {
      kind: string;
      videoId: string;
    };
  };
}

export interface PlaylistItemDeleteRequest {
  id: string;
}

export interface PlaylistResponse {
  kind: string;
  etag: string;
  id: string;
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
  };
}
