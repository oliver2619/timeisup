import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeControlButtonsComponent } from './time-control-buttons.component';

describe('TimeControlButtonsComponent', () => {
  let component: TimeControlButtonsComponent;
  let fixture: ComponentFixture<TimeControlButtonsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimeControlButtonsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeControlButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
