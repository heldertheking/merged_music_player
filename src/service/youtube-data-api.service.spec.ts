import { TestBed } from '@angular/core/testing';

import { YoutubeDataApiService } from './youtube-data-api.service';

describe('YoutubeDataApiService', () => {
  let service: YoutubeDataApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(YoutubeDataApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
