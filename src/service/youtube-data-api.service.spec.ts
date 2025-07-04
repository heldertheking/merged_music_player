import { TestBed } from '@angular/core/testing';

import { YoutubeService } from './youtube-data-api.service';

describe('YoutubeDataApiService', () => {
  let service: YoutubeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(YoutubeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
