import { TestBed } from '@angular/core/testing';

import { ControlUserService } from './control-user.service';

describe('ControlUserService', () => {
  let service: ControlUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ControlUserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
