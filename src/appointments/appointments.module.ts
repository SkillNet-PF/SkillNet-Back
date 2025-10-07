import { Module } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import {TypeOrmModule} from '@nestjs/typeorm';
import { Appointment } from './entities/appointment.entity';
import { User } from 'src/auth/entities/user.entity';
import { Serviceprovider } from 'src/serviceprovider/serviceprovider/entities/serviceprovider.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Appointment, User, Serviceprovider])],
  controllers: [AppointmentsController],
  providers: [AppointmentsService],
})
export class AppointmentsModule {}
