import { TestBed } from '@angular/core/testing';

import { MDMBillerService } from './mdmbiller.service';

describe('MDMBillerService', () => {
  let service: MDMBillerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MDMBillerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
