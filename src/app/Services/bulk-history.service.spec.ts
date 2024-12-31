import { TestBed } from '@angular/core/testing';

import { BulkHistoryService } from './bulk-history.service';

describe('BulkHistoryService', () => {
  let service: BulkHistoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BulkHistoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
