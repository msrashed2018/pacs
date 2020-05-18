import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarAccessCardAddSerialComponent } from './car-access-card-add-serial.component';

describe('CarAccessCardAddSerialComponent', () => {
  let component: CarAccessCardAddSerialComponent;
  let fixture: ComponentFixture<CarAccessCardAddSerialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarAccessCardAddSerialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarAccessCardAddSerialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
