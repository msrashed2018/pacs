import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomizeOrdersComponent } from './customize-orders.component';

describe('CustomizeOrdersComponent', () => {
  let component: CustomizeOrdersComponent;
  let fixture: ComponentFixture<CustomizeOrdersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CustomizeOrdersComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomizeOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
