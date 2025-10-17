import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceproviderService } from './serviceprovider.service';
import { ServiceproviderController } from './serviceprovider.controller';
import { ServiceProvider } from './entities/serviceprovider.entity';
import { Categories } from 'src/categories/entities/categories.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ServiceProvider, Categories]),
    AuthModule,
  ],
  controllers: [ServiceproviderController],
  providers: [ServiceproviderService],
})
export class ServiceproviderModule {}
