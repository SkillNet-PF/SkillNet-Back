import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Appointment } from 'src/appointments/entities/appointment.entity';
import { Status } from 'src/appointments/entities/status.enum';
import { User } from 'src/auth/entities/user.entity';
import { Client } from 'src/clients/entities/client.entity';
import { UserRole } from 'src/common/enums/user-role.enum';
import { Repository } from 'typeorm';
import { ActivityLogService } from './activityLog.service';
import { ServiceProvider } from 'src/serviceprovider/serviceprovider/entities/serviceprovider.entity';
import { Categories } from 'src/categories/entities/categories.entity';
import { provideMetricsDto } from './DTOs/providerMetrics.dto';
import { subscriptions } from 'src/subscription/entities/subscription.entity';

@Injectable()
export class AdminService {
  getAllClients() {
    throw new Error('Method not implemented.');
  }
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
    @InjectRepository(ServiceProvider)
    private readonly providerRepository: Repository<ServiceProvider>,
    @InjectRepository(Categories)
    private readonly categoryRepository: Repository<Categories>,
    @InjectRepository(subscriptions)
    private readonly subscriptionsRepository: Repository<subscriptions>,


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
  async getAllProviders() {
     // 1️⃣ Contar cantidad de proveedores por categoría
    const categories = await this.categoryRepository.find();
    const proveedores = await this.providerRepository.find({ relations: ['category'] });

    const Categorias: Record<string, number> = {};
    for (const cat of categories) {
      Categorias[cat.Name] = proveedores.filter(p => p.category?.CategoryID === cat.CategoryID).length;
    }
    
    // 2️⃣ Listar proveedores con stats de turnos
    const Proveedores:provideMetricsDto[] = [];
    
    for (const prov of proveedores) {
      const appointments = await this.appointmentRepository.find({
        where: { UserProvider: { userId: prov.userId } },
      });
      
      const completedAppointments = appointments.filter(a => a.Status === Status.COMPLETED).length;
      const canceledAppointments = appointments.filter(a => a.Status === Status.CANCEL).length;
      const pendingAppointments = appointments.filter(a => a.Status === Status.PENDING).length;
      
      Proveedores.push(
        {name: prov.name||'',
          category: prov.category.Name,
        dias: prov.dias || [],
        horas: prov.horarios || [],
        completedAppointments: completedAppointments,
        canceledAppointments: canceledAppointments,
        pendingAppointments: pendingAppointments}
      );
    }
    
    return { Categorias, Proveedores }
  }
  async getIncomes() {
    const clients = await this.clientRepository.find({relations: ['suscription']});
    const suscriptions = await this.subscriptionsRepository.find();
    
    let ingresos = 0;
   
    suscriptions.forEach((subscription) => {
      let totalPorSuscripcion ={name: subscription.Name, price: 0}
      clients.forEach((client) => {
        if (client.suscription?.SuscriptionID === subscription.SuscriptionID) {
          totalPorSuscripcion.price = totalPorSuscripcion.price + subscription.price
        }
      });
      
    })
    
    return ingresos;
  }
}
