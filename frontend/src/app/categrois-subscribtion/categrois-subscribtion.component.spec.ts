import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CategroisSubscribtionComponent } from './categrois-subscribtion.component';

describe('CategroisSubscribtionComponent', () => {
  let component: CategroisSubscribtionComponent;
  let fixture: ComponentFixture<CategroisSubscribtionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CategroisSubscribtionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategroisSubscribtionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
