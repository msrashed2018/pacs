import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddApplicationEntityComponent } from './add-application-entity.component';

describe('AddApplicationEntityComponent', () => {
  let component: AddApplicationEntityComponent;
  let fixture: ComponentFixture<AddApplicationEntityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddApplicationEntityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddApplicationEntityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
