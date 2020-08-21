import { TestBed } from '@angular/core/testing';

import { VpgService } from './vpg.service';

describe('VpgService', () => {
  let service: VpgService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VpgService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
