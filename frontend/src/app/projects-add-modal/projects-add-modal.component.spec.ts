import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectsAddModalComponent } from './projects-add-modal.component';

describe('ProjectsAddModalComponent', () => {
  let component: ProjectsAddModalComponent;
  let fixture: ComponentFixture<ProjectsAddModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectsAddModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectsAddModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
