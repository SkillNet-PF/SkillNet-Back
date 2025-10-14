import { Module } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from './entities/appointment.entity';
import { User } from 'src/auth/entities/user.entity';
import { ServiceProvider } from 'src/serviceprovider/serviceprovider/entities/serviceprovider.entity';
import { Client } from 'pg';
import { Categories } from '../categories/entities/categories.entity';
import { DataMigrationService } from './data-migration.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Appointment,
      User,
      ServiceProvider,
      Client,
      Categories,
    ]),
  ],
  controllers: [AppointmentsController],
  providers: [AppointmentsService, DataMigrationService],
})
export class AppointmentsModule {}
