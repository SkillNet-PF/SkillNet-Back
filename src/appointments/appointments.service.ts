import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Appointment } from './entities/appointment.entity';
import { Repository } from 'typeorm';
import { User } from 'src/auth/entities/user.entity';
import { UserRole } from 'src/common/enums/user-role.enum';
import { Client } from 'src/clients/entities/client.entity';
import { ServiceProvider } from 'src/serviceprovider/serviceprovider/entities/serviceprovider.entity';
import { Categories } from '../categories/entities/categories.entity';



@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    // @InjectRepository(Client)
    // private readonly clientRepository: Repository<Client>,

    // @InjectRepository(ServiceProvider)
    // private readonly providerRepository: Repository<ServiceProvider>,

    @InjectRepository(Categories)
    private readonly categoryRepository: Repository<Categories>
    
  ){}

  async createAppointment(createAppointmentDto: CreateAppointmentDto, user) {
    const authUser = await this.userRepository.findOne({
      where: { userId: user.userId,
        rol: UserRole.client
       },
    });

    const client = authUser as Client
    if (!client) throw new NotFoundException('user not found');

    if (client.rol !== UserRole.client)
      throw new BadRequestException(
        'Must be a client to create an appointment',
      );

    if (client.servicesLeft === 0) throw new BadRequestException('there are no services left to make this appointment')
    
    const {category, appointmentDate, hour, notes, provider} = createAppointmentDto

    if (!category || !appointmentDate || !hour || !notes || !provider) throw new BadRequestException('all required fields must be complete')
      
      //verifico que la fecha de emision sea posterior a la actual
      const appointmentDateType = new Date(appointmentDate);
    const today = new Date();

    if (appointmentDateType<= today) throw new BadRequestException('the appointment date must be later than the current date')


    // const categoryFound = await this.categoryRepository.findOneBy({Name: category})
    const providerFound = await this.userRepository.findOne({
      where: {name: provider, rol: UserRole.provider}, 
    })

    const proveedor = providerFound as ServiceProvider 



    // if (!categoryFound) throw new NotFoundException('Category not found')
    if (!proveedor) throw new NotFoundException('Provider not found')

    // if (providerFound.category !== categoryFound) throw new BadRequestException(`the provider does not have the category ${category}`)
   
    //convierto la fecha en un dia de la semana
    const appointmentDay = appointmentDateType.toLocaleDateString(
      'es-ES', 
      { weekday: 'long' });
    
    if (!proveedor.dias.includes(appointmentDay)) {
    throw new BadRequestException(`El proveedor no trabaja los días ${appointmentDay}`);
    }

    if (!proveedor.horarios.includes(hour)) {
      throw new BadRequestException(`El proveedor no trabaja en el horario ${hour}`)
    }
      //verificar que el proveedor no tenga ordenes emitidas en esa fecha y horario
    const providerId = proveedor.userId
    
    const existingAppointment = await this.appointmentRepository
    .createQueryBuilder('appointment')
    .leftJoin('appointment.UserProvider', 'provider')
    .where('provider.userId = :providerId', { providerId })
    .andWhere('appointment.AppointmentDate = :appointmentDate')
    .andWhere('appointment.hour = :hour', { hour })
    .setParameter('appointmentDate', appointmentDateType)
    .getOne();
    
    if (existingAppointment) throw new BadRequestException(`The provider is unavailable on ${appointmentDate} at ${hour}`)
    
    
    //CREACION DEL APPOINTMENT
    const appointment = new Appointment();

    // appointment.Category = categoryFound;
    appointment.CreationDate = today;
    appointment.AppointmentDate = appointmentDateType;
    appointment.hour = hour;
    appointment.Notes = notes;
    appointment.UserClient = client;
    appointment.UserProvider = proveedor;

    await this.appointmentRepository.save(appointment);

    //restamos un servicio del usuario

    client.servicesLeft = client.servicesLeft - 1

    await this.userRepository.update({userId: client.userId}, client)
    
    return 'appointment succesfully saved'
    

  }

  async findUserAppointments(
    page: number,
    limit: number,
    filters,
    user,
  ): Promise<Appointment[]> {
    //definir si el usuario es proveedor o cliente
    const authUser = await this.userRepository.findOneBy({
      userId: user.userId,
    });

    if (!authUser) throw new NotFoundException('user not found');

    if (authUser.rol != user.rol) throw new BadRequestException('bad request');

    
    const query = this.appointmentRepository
      .createQueryBuilder('appointment')
      .leftJoinAndSelect('appointment.provider', 'provider')
      .leftJoinAndSelect('appointment.UserClient', 'client')
      .leftJoinAndSelect('appointment.category', 'category')
      
      
     if (authUser.rol === UserRole.client) {
      query.where('client.userId = :userId', { userId: user.userId });
    } else if (authUser.rol === UserRole.provider) {
      query.where('provider.userId = :userId', { userId: user.userId });
    }
     if (filters.status) {
        query.andWhere('appointment.status = :status', { status: filters.status });
      }

      if (filters.category) {
        query.andWhere('category.Name = :category', { category: filters.category });
     }

      if (filters.providerId) {
        
       query.andWhere('provider.name = :provider', { provider:  filters.provider });
     }
    
      query.orderBy('appointment.AppointmentDate', 'DESC');

  const appointments: Appointment[]= await query.getMany()

    //paginar
    const start = (page - 1) * limit;
    const end = start + limit;
    const appointmentsPage = appointments.slice(start, end);

    return appointmentsPage;
  }

  async findOne(id:string, user) {
    //busco el usuario
    const authUser = await this.userRepository.findOneBy({
      userId: user.userId,
    });

    if (!authUser) throw new NotFoundException('user not found');

    if (authUser.rol != user.rol) throw new BadRequestException('bad request');


    const appointment = await this.appointmentRepository.findOne({
      where: { AppointmentID: id },
      relations: ['UserClient', 'UserProvider', 'Category'],
    });
    if (!appointment) throw new NotFoundException('appointment not found');

    //verifico que el usuario sea el que creo el appointment o el proveedor
    if(appointment.UserClient.userId !== user.userId && appointment.UserProvider.userId !== user.userId) throw new BadRequestException('bad request')
    return appointment
  }

  update(id: number, updateAppointmentDto: UpdateAppointmentDto) {
    return `This action updates a #${id} appointment`;
  }

  remove(id: number) {
    return `This action removes a #${id} appointment`;
  }
}
