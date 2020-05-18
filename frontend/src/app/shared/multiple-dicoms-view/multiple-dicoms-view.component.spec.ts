import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultipleDicomsViewComponent } from './multiple-dicoms-view.component';

describe('MultipleDicomsViewComponent', () => {
  let component: MultipleDicomsViewComponent;
  let fixture: ComponentFixture<MultipleDicomsViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultipleDicomsViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultipleDicomsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
