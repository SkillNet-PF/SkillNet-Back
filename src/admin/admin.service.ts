import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Appointment } from 'src/appointments/entities/appointment.entity';
import { Status } from 'src/appointments/entities/status.enum';
import { User } from 'src/auth/entities/user.entity';
import { Client } from 'src/clients/entities/client.entity';
import { UserRole } from 'src/common/enums/user-role.enum';
import { Repository } from 'typeorm';
import { ActivityLogService } from './activityLog.service';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,

    private readonly activityLogService: ActivityLogService

  ){}
  async getDashboard(user) {
    const admin = await this.userRepository.findOne({where: {userId: user.userId}});

    if (!admin) throw new Error('User not found');
    if(admin.rol !== UserRole.admin) throw new Error('User is not admin');

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

     // Últimas acciones
    const recentActivity = await this.activityLogService.getLatest();

    const totals ={
      clients: totalClients,
      providers: totalProviders,
      income: ingresos,
      appointments: { total: totalAppointments, 
        pending: pendingAppointment, 
        confirmed: confirmedAppointment, 
        completed: completedAppointment, 
        canceled:canceledAppointment
    }}

    const activityLog = recentActivity.map((log) => ({
        userName: `${log.user.name}`,
        action: log.action,
        date: log.createdAt.toLocaleDateString()})
      );
    return ({totals, activityLog});
  }
}
