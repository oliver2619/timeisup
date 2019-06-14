import { TestBed } from '@angular/core/testing';

import { TimeControlService } from './time-control.service';

describe('TimeControlService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TimeControlService = TestBed.get(TimeControlService);
    expect(service).toBeTruthy();
  });
});
