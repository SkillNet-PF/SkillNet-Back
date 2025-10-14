//falta definir las relaciones con provider y subscription, importar las entidades y decoradores de typeorm,y agregar validaciones y decoradores de swagger.

import { User } from 'src/auth/entities/user.entity';
import { suscriptions } from 'src/suscirption/entities/suscription.entity';
import {
  
  Column,
 
  ChildEntity,
  ManyToOne,
  JoinColumn,

} from 'typeorm';


@ChildEntity('client')
export class Client extends User {

  
  //Datos de tarjeta se guardarán en un servicio externo como Stripe o similar
  @Column({
    type: 'varchar',
    nullable: true,
    comment: 'Método de pago guardado en servicio externo',
  })
  paymentMethod?: string;

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
  PaymentStatus: boolean

}


