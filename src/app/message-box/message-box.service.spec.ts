import { TestBed } from '@angular/core/testing';

import { MessageBoxServiceService } from './message-box.service';

describe('MessageBoxServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MessageBoxServiceService = TestBed.get(MessageBoxServiceService);
    expect(service).toBeTruthy();
  });
});
