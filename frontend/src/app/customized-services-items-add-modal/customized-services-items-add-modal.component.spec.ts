import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomizedServicesItemsAddModalComponent } from './customized-services-items-add-modal.component';

describe('CustomizedServicesItemsAddModalComponent', () => {
  let component: CustomizedServicesItemsAddModalComponent;
  let fixture: ComponentFixture<CustomizedServicesItemsAddModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomizedServicesItemsAddModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomizedServicesItemsAddModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
