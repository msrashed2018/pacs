import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OffersModalComponent } from './offers-modal.component';

describe('OffersModalComponent', () => {
  let component: OffersModalComponent;
  let fixture: ComponentFixture<OffersModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OffersModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OffersModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
