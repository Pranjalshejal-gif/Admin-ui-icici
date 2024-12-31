import { TestBed } from '@angular/core/testing';

import { ApproveRefundPayoutService } from './approve-refund-payout.service';

describe('ApproveRefundPayoutService', () => {
  let service: ApproveRefundPayoutService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApproveRefundPayoutService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
