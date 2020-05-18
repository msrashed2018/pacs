import { TestBed } from '@angular/core/testing';

import { GateAccessService } from './gate-access.service';

describe('GateAccessService', () => {
  let service: GateAccessService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GateAccessService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
