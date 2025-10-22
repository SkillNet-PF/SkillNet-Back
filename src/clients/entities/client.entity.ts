import { User } from 'src/auth/entities/user.entity';
// import { suscriptions } from 'src/suscirption/entities/suscription.entity';
import { UserRole } from 'src/common/enums/user-role.enum';
import { subscriptions } from 'src/subscription/entities/subscription.entity';
import { Column, ChildEntity, ManyToOne, JoinColumn } from 'typeorm';
import { Appointment } from 'src/appointments/entities/appointment.entity';

@ChildEntity('client')
export class Client extends User {
  // Hereda de User: userId, imgProfile, name, birthDate, email, externalAuthId, address, phone, rol, isActive

  //Datos de tarjeta se guardarán en un servicio externo como Stripe o similar
  @Column({
    type: 'varchar',
    nullable: true,
    comment: 'Método de pago guardado en servicio externo',
  })
  paymentMethod?: string;

  // Relación con suscripciones (temporalmente comentada para pruebas)
  @ManyToOne(() => subscriptions)
  @JoinColumn({ name: 'suscriptionId' })
  suscription?: subscriptions;

  @Column()
  servicesLeft: number;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @Column()
  paymentStatus: boolean;

  //!Habilitar relación con appointments cuando esté la entidad
  // @ManyToOne(() => Appointment, (appointment) => appointment.clients)
  // @JoinColumn({ name: 'appointment_id' })
  // appointment?: Appointment;
}
