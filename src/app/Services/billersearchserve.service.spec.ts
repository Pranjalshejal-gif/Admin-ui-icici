import { TestBed } from '@angular/core/testing';

import { BillersearchserveService } from './billersearchserve.service';

describe('BillersearchserveService', () => {
  let service: BillersearchserveService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BillersearchserveService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
