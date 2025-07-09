import { Test } from '@nestjs/testing';
import { ApiServiceLibService } from './api-service-lib.service';

describe('ApiServiceLibService', () => {
  let service: ApiServiceLibService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [ApiServiceLibService],
    }).compile();

    service = module.get(ApiServiceLibService);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
