import { Appointment } from 'src/appointments/entities/appointment.entity';
import { Categories } from 'src/categories/entities/categories.entity';
import { User } from 'src/auth/entities/user.entity';
import { Column, ManyToOne, JoinColumn, ChildEntity, OneToMany } from 'typeorm';

// ===== CÓDIGO ORIGINAL (COMENTADO PARA ROLLBACK) =====
// @ChildEntity('providers')
// ===== FIN CÓDIGO ORIGINAL =====


@ChildEntity('provider')
export class ServiceProvider extends User {

  @Column('text', { nullable: true })
  bio: string;

  @Column('simple-array', { nullable: true })
  dias: string[]; // ejemplo: ['lunes', 'martes']

  @Column('simple-array', { nullable: true })
  horarios: string[]; // ejemplo: ['09:00', '14:00']

  @ManyToOne(() => Categories, (category) => category.ServiceProviders)
  @JoinColumn({ name: 'categoryId' })
  category: Categories;

  @OneToMany(() => Appointment, (schedule) => schedule.UserProvider, {
    nullable: true,
  })
  @JoinColumn({ name: 'scheduleId' })
  schedule: Appointment[];
}
