import { Module } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from './entities/appointment.entity';
import { User } from 'src/auth/entities/user.entity';
import { ServiceProvider } from 'src/serviceprovider/serviceprovider/entities/serviceprovider.entity';
import { Client } from 'pg';
import { Categories } from '../categories/entities/categories.entity';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Appointment,
      User,
      ServiceProvider,
      Client,
      Categories,
      MailModule
    ]),
  ],
  controllers: [AppointmentsController],
  providers: [AppointmentsService],
})
export class AppointmentsModule {}
