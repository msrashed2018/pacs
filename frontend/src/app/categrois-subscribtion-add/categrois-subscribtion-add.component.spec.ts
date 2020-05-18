import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CategroisSubscribtionAddComponent } from './categrois-subscribtion-add.component';

describe('CategroisSubscribtionAddComponent', () => {
  let component: CategroisSubscribtionAddComponent;
  let fixture: ComponentFixture<CategroisSubscribtionAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CategroisSubscribtionAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategroisSubscribtionAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
