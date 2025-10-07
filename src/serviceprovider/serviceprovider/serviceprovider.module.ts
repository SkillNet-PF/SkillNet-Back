import { Module } from '@nestjs/common';
import { ServiceproviderService } from './serviceprovider.service';
import { ServiceproviderController } from './serviceprovider.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceProvider } from './entities/serviceprovider.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ServiceProvider])],
  controllers: [ServiceproviderController],
  providers: [ServiceproviderService],
})
export class ServiceproviderModule {}
