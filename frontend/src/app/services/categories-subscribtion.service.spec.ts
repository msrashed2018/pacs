import { TestBed } from '@angular/core/testing';

import { CategoriesSubscribtionService } from './categories-subscribtion.service';

describe('CategoriesSubscribtionService', () => {
  let service: CategoriesSubscribtionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CategoriesSubscribtionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
