import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationEntitiesComponent } from './application-entities.component';

describe('ApplicationEntitiesComponent', () => {
  let component: ApplicationEntitiesComponent;
  let fixture: ComponentFixture<ApplicationEntitiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplicationEntitiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationEntitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
