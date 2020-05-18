import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscribtionCatgsItemsAddModalComponent } from './subscribtion-catgs-items-add-modal.component';

describe('SubscribtionCatgsItemsAddModalComponent', () => {
  let component: SubscribtionCatgsItemsAddModalComponent;
  let fixture: ComponentFixture<SubscribtionCatgsItemsAddModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubscribtionCatgsItemsAddModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscribtionCatgsItemsAddModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
