import { Test, TestingModule } from '@nestjs/testing';
import { ServiceproviderService } from './serviceprovider.service';

describe('ServiceproviderService', () => {
  let service: ServiceproviderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ServiceproviderService],
    }).compile();

    service = module.get<ServiceproviderService>(ServiceproviderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
