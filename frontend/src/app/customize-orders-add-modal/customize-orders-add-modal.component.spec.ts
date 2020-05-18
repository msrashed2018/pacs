import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomizeOrdersAddModalComponent } from './customize-orders-add-modal.component';

describe('CustomizeOrdersAddModalComponent', () => {
  let component: CustomizeOrdersAddModalComponent;
  let fixture: ComponentFixture<CustomizeOrdersAddModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CustomizeOrdersAddModalComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomizeOrdersAddModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
