import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarAccessCardComponent } from './car-access-card.component';

describe('CarAccessCardComponent', () => {
  let component: CarAccessCardComponent;
  let fixture: ComponentFixture<CarAccessCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarAccessCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarAccessCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
