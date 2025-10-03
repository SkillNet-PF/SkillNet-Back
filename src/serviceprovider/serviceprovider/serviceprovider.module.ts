import { Module } from '@nestjs/common';
import { ServiceproviderService } from './serviceprovider.service';
import { ServiceproviderController } from './serviceprovider.controller';

@Module({
  controllers: [ServiceproviderController],
  providers: [ServiceproviderService],
})
export class ServiceproviderModule {}
