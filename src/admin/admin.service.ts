import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Appointment } from 'src/appointments/entities/appointment.entity';
import { Status } from 'src/appointments/entities/status.enum';
import { User } from 'src/auth/entities/user.entity';
import { Client } from 'src/clients/entities/client.entity';
import { UserRole } from 'src/common/enums/user-role.enum';
import { Repository } from 'typeorm';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,

  ){}
  async getDashboard() {
    
    // Totales
    const totalClients = await this.userRepository.count({ where: { rol: UserRole.client } });
    const totalProviders = await this.userRepository.count({ where: { rol: UserRole.provider} });
    
    const users = await this.userRepository.find();
    
    let ingresos = 0
    
    users.forEach(user => {
      if (user.rol === 'client') {
        let client = user as Client
        
        if (client.suscription) {
          ingresos = ingresos + client.suscription?.price
        }
      }
      
      
    });
    const totalAppointments = await this.appointmentRepository.count();
    const pendingAppointment = await this.appointmentRepository.count({where: {Status: Status.PENDING}});
    const confirmedAppointment = await this.appointmentRepository.count({where: {Status: Status.CONFIRMED}});
    const completedAppointment = await this.appointmentRepository.count({where: {Status: Status.COMPLETED && Status.COMPLETED_PARTIAL}});
    const canceledAppointment = await this.appointmentRepository.count({where: {Status: Status.CANCEL}});
    return ({
      totalClients,
      totalProviders,
      ingresos,
      totalAppointments,
      pendingAppointment,
      confirmedAppointment,
      completedAppointment,
      canceledAppointment
    })
  }
}
