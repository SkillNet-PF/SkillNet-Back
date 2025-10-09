import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Appointment } from './entities/appointment.entity';
import { Repository } from 'typeorm';
import { User } from 'src/auth/entities/user.entity';
import { UserRole } from 'src/common/enums/user-role.enum';



@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
    
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    
  ){}

  async createAppointment(createAppointmentDto: CreateAppointmentDto) {
    //extraer el id del usuario del token 
    //buscar el usuario
    //verificar que tenga servicios disponibles

    //verificar que la nota exista
    //verificar que la categoria solicitada exista
    //verificar que la categoria solicitada este contenida dentro de las habilitadas
    //verificar que el proveedor exista
    //verificar que el proveedor tenga la categoria solicitada
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
