import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
//import { User } from './user.entity';
//import { Category } from './category.entity';
//import { Schedule } from './schedule.entity';

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

  /*   @ManyToOne(() => User, user => user.providers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;
  
    @ManyToOne(() => Category, category => category.providers)
  @JoinColumn({ name: 'categoryId' })
  category: Category;
  
  @ManyToOne(() => Schedule, schedule => schedule.providers, { nullable: true })
  @JoinColumn({ name: 'scheduleId' })
  schedule: Schedule; */
}
