import { TestBed } from '@angular/core/testing';

import { AgentsearchServiceService } from './agentsearch-service.service';

describe('AgentsearchServiceService', () => {
  let service: AgentsearchServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AgentsearchServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
