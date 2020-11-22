import { TestBed } from '@angular/core/testing';

import { LagerService } from './lager.service';

describe('LagerService', () => {
  let service: LagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
