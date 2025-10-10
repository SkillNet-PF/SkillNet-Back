import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Appointment } from './entities/appointment.entity';
import { Repository } from 'typeorm';
import { User } from 'src/auth/entities/user.entity';
import { UserRole } from 'src/common/enums/user-role.enum';
import { Client } from 'src/clients/entities/client.entity';
import { ServiceProvider } from 'src/serviceprovider/serviceprovider/entities/serviceprovider.entity';
import { Categories } from './entities/categories.entity';



@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
    
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,

    @InjectRepository(ServiceProvider)
    private readonly providerRepository: Repository<ServiceProvider>,

    @InjectRepository(Categories)
    private readonly categoryRepository: Repository<Categories>
    
  ){}

  async createAppointment(createAppointmentDto: CreateAppointmentDto, user) {
    
    const authUser = await this.clientRepository.findOneBy({userId: user.userId})

    if(!authUser) throw new NotFoundException('user not found')

    if (authUser.rol !== UserRole.client) throw new BadRequestException('Must be a client to create an appointment')

    if (authUser.ServicesLeft === 0) throw new BadRequestException('there are no services left to make this appointment')
    
    const {category, appointmentDate, hour, notes, provider} = createAppointmentDto

    if (!category || !appointmentDate || !hour || !notes || !provider) throw new BadRequestException('all required fields must be complete')

    const categoryFound = await this.categoryRepository.findOneBy({Name: category})
    const providerFound = await this.providerRepository.findOne({
      where: {name: provider}, 
      relations:{category: true, schedule:true}
    })

    if (!categoryFound) throw new NotFoundException('Category not found')
    if (!providerFound) throw new NotFoundException('Provider not found')

    if (providerFound.category !== categoryFound) throw new BadRequestException(`the provider does not have the category ${category}`)
   
    const day = appointmentDate.getDay()

    const verifprovider:ServiceProvider = this.providerRepository
    .createQueryBuilder('provider')
    .leftJoinAndSelect('provider.appointments', 'appointment')
    .where('provider.category = :category', { categoryFound })
    .andWhere(':day = ANY (provider.workDays)', { day })
    .andWhere(':hour = ANY (provider.workHours)', { hour })
    .andWhere(qb => {
      const subQuery = qb.subQuery()
        .select('a.id')
        .from('appointments', 'a')
        .where('a."providerId" = provider.id')
        .andWhere('a."AppointmentDate" = :appointmentDate', { appointmentDate })
        .andWhere('a."AppointmentHour" = :hour', { hour })
        .getQuery();
      return `provider.id NOT IN (${subQuery})`;
    })
    //verificar que el proveedor no tenga ordenes emitidas en esa fecha y horario
    
    //CREACION DEL APPOINTMENT
    //crear la fecha de emision, y crear el appointment (asignar el usuario el extraido del token)
    //restar un servicio de los disponibles al usuario

  }

  async findUserAppointments(page:number, limit:number, user): Promise<Appointment[]> {
    //definir si el usuario es proveedor o cliente
    const authUser = await this.userRepository.findOneBy({userId: user.userId})

    if (!authUser) throw new NotFoundException('user not found')
    
    if (authUser.rol != user.rol) throw new BadRequestException('bad request')
      
      //define si busca los appointments de un cliente o de un provider
    let whereClause = {}; 
    if (authUser.rol === UserRole.client){
      whereClause = { UserClientId: user.userId }
    }
    if (authUser.rol === UserRole.provider){
      whereClause = { UserProviderId: user.userId }
    }

    const appointments :Appointment[] = await this.appointmentRepository.find({
      where: whereClause,
      order: {AppointmentDate:'DESC'}
    })
    
    //paginar
    const start = (page - 1) * limit;
    const end = start + limit;
    const appointmentsPage = appointments.slice(start, end);

    return appointmentsPage

  }

  findOne(id: number) {
    return `This action returns a #${id} appointment`;
  }

  update(id: number, updateAppointmentDto: UpdateAppointmentDto) {
    return `This action updates a #${id} appointment`;
  }

  remove(id: number) {
    return `This action removes a #${id} appointment`;
  }
}
