import { User } from 'src/auth/entities/user.entity';
// import { suscriptions } from 'src/suscirption/entities/suscription.entity';
import { UserRole } from 'src/common/enums/user-role.enum';
import { Column, ChildEntity, ManyToOne, JoinColumn } from 'typeorm';

@ChildEntity({ name: 'CLIENTS' })
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
  // @ManyToOne(() => suscriptions)
  // @JoinColumn({ name: 'suscriptionId' })
  // suscription?: suscriptions;

  @Column()
  servicesLeft: number;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @Column()
  paymentStatus: boolean;

  // Relación con citas (temporalmente comentada para pruebas)

  // @ManyToOne(() => Appointment, (appointment) => appointment.clients)
  // @JoinColumn({ name: 'appointment_id' })
  // appointment?: Appointment;
}
