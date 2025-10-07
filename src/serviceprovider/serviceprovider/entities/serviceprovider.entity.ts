import { Appointment } from 'src/appointments/entities/appointment.entity';
import { Categories } from 'src/appointments/entities/categories.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
//import { User } from './user.entity';



@Entity('providers')
export class ServiceProvider {

  @PrimaryGeneratedColumn('uuid')
  providerId: string;

  @Column('uuid')
  userId: string;

  @Column('text', { nullable: true })
  bio: string;

  @Column('uuid')
  categoryId: string;

  @Column('simple-array', { nullable: true })
  dias: string[]; // ejemplo: ['lunes', 'martes']

  @Column('simple-array', { nullable: true })
  horarios: string[]; // ejemplo: ['09:00', '14:00']

  @Column('uuid', { nullable: true })
  appoinments: string[];

  @ManyToOne(() => User, user => user.providers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;
  
  @ManyToOne(() => Categories, category => category.ServiceProviders)
  @JoinColumn({ name: 'categoryId' })
  category: Categories;
  
  @ManyToOne(() => Appointment, schedule => schedule.UserProvider, { nullable: true })
  @JoinColumn({ name: 'scheduleId' })
  schedule: Appointment[];
}
