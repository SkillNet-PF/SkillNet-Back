// src/appointments/appointments.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';

import { Appointment } from './entities/appointment.entity';
import { User } from 'src/auth/entities/user.entity';
import { ServiceProvider } from 'src/serviceprovider/serviceprovider/entities/serviceprovider.entity';
import { Client } from 'src/clients/entities/client.entity';
import { Categories } from 'src/categories/entities/categories.entity';
import { DataMigrationService } from './data-migration.service';

import { MailModule } from 'src/mail/mail.module';
import { AdminModule } from 'src/admin/admin.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Appointment,
      User,
      ServiceProvider,
      Client,
      Categories,
    ]),
    MailModule,
    AdminModule,
  ],
  controllers: [AppointmentsController],
  providers: [AppointmentsService, DataMigrationService],
})
export class AppointmentsModule {}
