import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeControlLogComponent } from './time-control-log.component';

describe('TimeControlLogComponent', () => {
  let component: TimeControlLogComponent;
  let fixture: ComponentFixture<TimeControlLogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimeControlLogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeControlLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
