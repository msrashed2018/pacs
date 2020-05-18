import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionCatgComponent } from './subscription-catg.component';

describe('SubscriptionCatgComponent', () => {
  let component: SubscriptionCatgComponent;
  let fixture: ComponentFixture<SubscriptionCatgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubscriptionCatgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriptionCatgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
