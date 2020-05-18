import { TestBed } from '@angular/core/testing';

import { SubscribtionsCatgServiceService } from './subscribtions-catg-service.service';

describe('SubscribtionsCatgServiceService', () => {
  let service: SubscribtionsCatgServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubscribtionsCatgServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
