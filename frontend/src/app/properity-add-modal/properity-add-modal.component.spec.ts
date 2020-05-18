import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProperityAddModalComponent } from './properity-add-modal.component';

describe('ProperityAddModalComponent', () => {
  let component: ProperityAddModalComponent;
  let fixture: ComponentFixture<ProperityAddModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProperityAddModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProperityAddModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
