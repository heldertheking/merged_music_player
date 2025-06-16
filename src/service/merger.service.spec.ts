import { TestBed } from '@angular/core/testing';

import { MergerService } from './merger.service';

describe('MergerService', () => {
  let service: MergerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MergerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
