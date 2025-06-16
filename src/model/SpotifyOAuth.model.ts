export interface SpotifyLoginRequest {
  client_id: string;
  response_type: string;
  redirect_uri: string;
  scope: string;
  state?: string;
}

export interface SpotifyLoginResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  scope: string;
}

export interface SpotifyRefreshRequest {
  client_id: string;
  grant_type: string;
  refresh_token: string;
}

export interface SpotifyRefreshResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
}
