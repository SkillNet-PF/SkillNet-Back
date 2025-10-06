import { Test, TestingModule } from '@nestjs/testing';
import { ServiceproviderController } from './serviceprovider.controller';
import { ServiceproviderService } from './serviceprovider.service';

describe('ServiceproviderController', () => {
  let controller: ServiceproviderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServiceproviderController],
      providers: [ServiceproviderService],
    }).compile();

    controller = module.get<ServiceproviderController>(ServiceproviderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
