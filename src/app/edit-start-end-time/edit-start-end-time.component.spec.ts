import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditStartEndTimeComponent } from './edit-start-end-time.component';

describe('EditStartEndTimeComponent', () => {
  let component: EditStartEndTimeComponent;
  let fixture: ComponentFixture<EditStartEndTimeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditStartEndTimeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditStartEndTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
