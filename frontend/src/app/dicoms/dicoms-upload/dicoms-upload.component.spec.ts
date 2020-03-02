import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DicomsUploadComponent } from './dicoms-upload.component';

describe('DicomsUploadComponent', () => {
  let component: DicomsUploadComponent;
  let fixture: ComponentFixture<DicomsUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DicomsUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DicomsUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
