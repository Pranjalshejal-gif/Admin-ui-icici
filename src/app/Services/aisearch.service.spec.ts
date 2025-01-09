import { TestBed } from '@angular/core/testing';

import { AisearchService } from './aisearch.service';

describe('AisearchService', () => {
  let service: AisearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AisearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
