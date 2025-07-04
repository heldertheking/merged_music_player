import { TestBed } from '@angular/core/testing';

import { QueueManagerService } from './queue-manager.service';

describe('QueueManagerService', () => {
  let service: QueueManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QueueManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
