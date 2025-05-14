import { TestBed } from '@angular/core/testing';

import { SpotifyWebApiService } from './spotify-web-api.service';

describe('SpotifyWebApiService', () => {
  let service: SpotifyWebApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SpotifyWebApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
