import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceproviderService } from './serviceprovider.service';
import { ServiceproviderController } from './serviceprovider.controller';
import { ServiceProvider } from './entities/serviceprovider.entity';
import { Categories } from 'src/appointments/entities/categories.entity';
import { AuthModule } from 'src/auth/auth.module';
import { PublicServiceProviderController } from './serviceprovider.public.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ServiceProvider, Categories]), AuthModule],
  controllers: [ServiceproviderController, PublicServiceProviderController],
  providers: [ServiceproviderService],
})
export class ServiceproviderModule {}
