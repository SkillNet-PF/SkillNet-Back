import { UserRole } from 'src/common/enums/user-role.enum';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity({ name: 'CLIENTS' })
export class Client {
  @PrimaryGeneratedColumn('uuid')
  clientId: string;

  //La imagen se guardará en cloudinary o similar
  @Column({
    type: 'varchar',
    default:
      'https://res.cloudinary.com/dzcmadjlq/image/upload/v1696118476/default-profile_qx1r4r.png',
  })
  imgProfile: string;

  @Column({
    type: 'varchar',
    length: 100,
    unique: true,
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 10, // YYYY-MM-DD is 10 characters
    nullable: true,
    comment: 'Formato de fecha: YYYY-MM-DD',
  })
  birthDate: string;

  @Column({
    type: 'varchar',
    unique: true,
    length: 100,
  })
  email: string;

  //La contraseña se gurdará en Auth0 o similar y se referenciará aquí con un id
  @Column('uuid')
  idExternalPassword: string;

  //La dirección se usará para determinar la cercanía a los proveedores o que el proveedor se desplace a la dirección del cliente
  @Column({
    type: 'varchar',
    length: 200,
  })
  address: string;

  @Column({
    type: 'varchar',
    unique: true,
  })
  phone: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.client,
  })
  role: string;

  //Datos de tarjeta se guardarán en un servicio externo como Stripe o similar
  @Column({
    type: 'varchar',
    nullable: true,
    comment: 'Método de pago guardado en servicio externo',
  })
  paymentMethod?: string;

  @Column({
    type: 'boolean',
    default: true,
  })
  isActive: boolean;

  // @ManyToOne(() => Subscription, (subscription) => subscription.clients)
  // @JoinColumn({ name: 'suscription_id' })
  // subscription?: Subscription;

  // @ManyToOne(() => Provider, (provider) => provider.clients)
  // @JoinColumn({ name: 'provider_id' })
  // provider?: Provider;

  // @ManyToOne(() => Appointment, (appointment) => appointment.clients)
  // @JoinColumn({ name: 'appointment_id' })
  // appointment?: Appointment;
}
