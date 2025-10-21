import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { ActivityLogService } from './activityLog.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from 'src/appointments/entities/appointment.entity';
import { Client } from 'pg';
import { User } from 'src/auth/entities/user.entity';
import { ServiceProvider } from 'src/serviceprovider/serviceprovider/entities/serviceprovider.entity';
import { ActivityLog } from './entity/activityLog.entity';

@Module({
  imports: [
      TypeOrmModule.forFeature([
        Appointment,
        User,
        ServiceProvider,
        Client,
        ActivityLog
      ]),
    ],
  controllers: [AdminController],
  providers: [AdminService, ActivityLogService],
  exports: [ActivityLogService],
})
export class AdminModule {}
