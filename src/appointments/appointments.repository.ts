import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Appointment } from './entities/appointment.entity';
import { Status } from './entities/status.enum';

@Injectable()
export class AppointmentsRepository {
  constructor(
    @InjectRepository(Appointment)
    private readonly repo: Repository<Appointment>,
  ) {}

  async findConflict(
    providerId: string,
    appointmentDate: Date,
    hour: string,
  ): Promise<Appointment | null> {
    return this.repo.findOne({
      where: {
        UserProvider: { userId: providerId },
        AppointmentDate: appointmentDate,
        hour,
        Status: In([Status.PENDING, Status.CONFIRMED]),
      },
      relations: ['UserProvider'],
    });
  }

  async save(appointment: Appointment): Promise<Appointment> {
    return this.repo.save(appointment);
  }

  async getBookedHours(providerId: string, appointmentDate: Date): Promise<string[]> {
    const rows = await this.repo.find({
      where: {
        UserProvider: { userId: providerId },
        AppointmentDate: appointmentDate,
        Status: In([Status.PENDING, Status.CONFIRMED]),
      },
      select: ['hour'],
      relations: ['UserProvider'],
    });
    return rows.map((r) => r.hour);
  }
}


