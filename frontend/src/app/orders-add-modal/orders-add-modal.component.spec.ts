import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersAddModalComponent } from './orders-add-modal.component';

describe('OrdersAddModalComponent', () => {
  let component: OrdersAddModalComponent;
  let fixture: ComponentFixture<OrdersAddModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrdersAddModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdersAddModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
