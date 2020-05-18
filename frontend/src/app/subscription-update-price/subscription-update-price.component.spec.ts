import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionUpdatePriceComponent } from './subscription-update-price.component';

describe('SubscriptionUpdatePriceComponent', () => {
  let component: SubscriptionUpdatePriceComponent;
  let fixture: ComponentFixture<SubscriptionUpdatePriceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubscriptionUpdatePriceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriptionUpdatePriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
