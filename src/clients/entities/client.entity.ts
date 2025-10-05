//falta definir las relaciones con provider y subscription, importar las entidades y decoradores de typeorm,y agregar validaciones y decoradores de swagger.

// import {
//   Entity,
//   Column,
//   PrimaryGeneratedColumn,
//   ManyToOne,
//   JoinColumn,
// } from 'typeorm';

// @Entity({ name: 'CLIENTS' })
export class Client {
  //   @PrimaryGeneratedColumn('uuid')
  userId: string;

  //La imagen se guardará en cloudinary o similar
  //   @Column()
  imgProfile: string;

  //   @Column()
  name: string;

  //   @Column()
  birthDate: string;

  //   @Column()
  email: string;

  //La contraseña se gurdará en Auth0 o similar y se referenciará aquí con un id
  //   @Column('uuid')
  idExternalPassword: string;

  //La dirección se usará para determinar la cercanía a los proveedores o que el proveedor se desplace a la dirección del cliente
  //   @Column()
  address: string;

  //   @Column()
  phone: string;

  //   @Column({ default: 'client' })
  role: string;

  //Datos de tarjeta se guardarán en un servicio externo como Stripe o similar
  //   @Column({ nullable: true })
  paymentMethod?: string;

  //   @Column({ default: true })
  isActive: boolean;

  // @ManyToOne(() => Subscription, (subscription) => subscription.clients)
  // @JoinColumn({ name: 'suscription_id' })
  // subscription?: Subscription;

  // @ManyToOne(() => Provider, (provider) => provider.clients)
  // @JoinColumn({ name: 'provider_id' })
  // provider?: Provider;
}
