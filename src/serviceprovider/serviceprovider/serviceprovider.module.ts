import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceproviderService } from './serviceprovider.service';
import { ServiceproviderController } from './serviceprovider.controller';
import { ServiceProvider } from './entities/serviceprovider.entity';
import { Categories } from 'src/categories/entities/categories.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ServiceProvider, Categories])],
  controllers: [ServiceproviderController],
  providers: [ServiceproviderService],
})
export class ServiceproviderModule {}
