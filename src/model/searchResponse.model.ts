export interface SearchResponse {
  titel: string;
  artwork: string[];
  artist: string;
  platform: 'YouTube' | 'Spotify' | 'Both';
}
