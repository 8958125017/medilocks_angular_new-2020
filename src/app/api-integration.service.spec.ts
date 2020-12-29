import { TestBed, inject } from '@angular/core/testing';

import { ApiIntegrationService } from './api-integration.service';

describe('ApiIntegrationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ApiIntegrationService]
    });
  });

  it('should be created', inject([ApiIntegrationService], (service: ApiIntegrationService) => {
    expect(service).toBeTruthy();
  }));
});
