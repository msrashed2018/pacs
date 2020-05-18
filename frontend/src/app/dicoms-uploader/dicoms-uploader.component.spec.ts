import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DicomsUploaderComponent } from './dicoms-uploader.component';

describe('DicomsUploaderComponent', () => {
  let component: DicomsUploaderComponent;
  let fixture: ComponentFixture<DicomsUploaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DicomsUploaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DicomsUploaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
