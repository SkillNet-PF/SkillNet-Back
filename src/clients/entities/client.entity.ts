import { User } from 'src/auth/entities/user.entity';
import { suscriptions } from 'src/suscirption/entities/suscription.entity';
import { UserRole } from 'src/common/enums/user-role.enum';
import { Column, ChildEntity, ManyToOne, JoinColumn } from 'typeorm';

@ChildEntity({ name: 'CLIENTS' })
export class Client extends User {
  // Hereda de User: userId, imgProfile, name, birthDate, email, externalAuthId, address, phone, rol, isActive

  // Campos específicos de Client (comentamos los duplicados por herencia):

  // @Column({
  //   type: 'varchar',
  //   default: 'https://res.cloudinary.com/dzcmadjlq/image/upload/v1696118476/default-profile_qx1r4r.png',
  // })
  // imgProfile: string; // Ya está en User

  // @Column({
  //   type: 'varchar',
  //   length: 100,
  //   unique: true,
  // })
  // name: string; // Ya está en User

  // @Column({
  //   type: 'varchar',
  //   length: 10,
  //   nullable: true,
  //   comment: 'Formato de fecha: YYYY-MM-DD',
  // })
  // birthDate: string; // Ya está en User

  // @Column({
  //   type: 'varchar',
  //   unique: true,
  //   length: 100,
  // })
  // email: string; // Ya está en User

  // @Column('uuid')
  // idExternalPassword: string; // En User es externalAuthId

  // @Column({
  //   type: 'varchar',
  //   length: 200,
  // })
  // address: string; // Ya está en User

  // @Column({
  //   type: 'varchar',
  //   unique: true,
  // })
  // phone: string; // Ya está en User

  // @Column({
  //   type: 'enum',
  //   enum: UserRole,
  //   default: UserRole.client,
  // })
  // role: string; // En User es rol

  // Campos específicos de Client (hereda userId, imgProfile, name, birthDate, email, externalAuthId, address, phone, rol, isActive de User)

  //Datos de tarjeta se guardarán en un servicio externo como Stripe o similar
  @Column({
    type: 'varchar',
    nullable: true,
    comment: 'Método de pago guardado en servicio externo',
  })
  paymentMethod?: string;

  // Relación con suscripciones
  @ManyToOne(() => suscriptions)
  @JoinColumn({ name: 'suscriptionId' })
  suscription?: suscriptions;

  @Column()
  ServicesLeft: number;

  @Column()
  StartDate: Date;

  @Column()
  EndDate: Date;

  @Column()
  PaymentStatus: boolean;

  // Relaciones futuras (comentadas)
  // @ManyToOne(() => Provider, (provider) => provider.clients)
  // @JoinColumn({ name: 'provider_id' })
  // provider?: Provider;

  // @ManyToOne(() => Appointment, (appointment) => appointment.clients)
  // @JoinColumn({ name: 'appointment_id' })
  // appointment?: Appointment;
}
