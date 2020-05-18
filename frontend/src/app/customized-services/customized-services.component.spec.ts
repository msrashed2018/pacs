import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomizedServicesComponent } from './customized-services.component';

describe('CustomizedServicesComponent', () => {
  let component: CustomizedServicesComponent;
  let fixture: ComponentFixture<CustomizedServicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomizedServicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomizedServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
