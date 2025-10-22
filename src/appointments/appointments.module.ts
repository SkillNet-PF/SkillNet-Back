// src/appointments/appointments.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';

import { Appointment } from './entities/appointment.entity';
import { User } from 'src/auth/entities/user.entity';
import { ServiceProvider } from 'src/serviceprovider/serviceprovider/entities/serviceprovider.entity';
import { Client } from 'src/clients/entities/client.entity'; // ✅ ENTIDAD correcta (NO de 'pg')
import { Categories } from 'src/categories/entities/categories.entity';

import { MailModule } from 'src/mail/mail.module'; // ✅ importa módulo de mail
import { AdminModule } from 'src/admin/admin.module'; // asegúrate que exporte ActivityLogService si lo usas

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Appointment,
      User,
      ServiceProvider,
      Client, // ✅ ahora es la entidad
      Categories,
    ]),
    MailModule, // ✅ va aquí, fuera de forFeature
    AdminModule,
  ],
  controllers: [AppointmentsController],
  providers: [AppointmentsService],
  // exports: [AppointmentsService], // opcional si lo usan desde otro módulo
})
export class AppointmentsModule {}
