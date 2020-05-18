import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionMoreDetailsComponent } from './subscription-more-details.component';

describe('SubscriptionMoreDetailsComponent', () => {
  let component: SubscriptionMoreDetailsComponent;
  let fixture: ComponentFixture<SubscriptionMoreDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubscriptionMoreDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriptionMoreDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
