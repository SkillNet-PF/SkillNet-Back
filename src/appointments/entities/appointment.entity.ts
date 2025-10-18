import { Column, Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Client } from 'src/clients/entities/client.entity';
import { Status } from './status.enum';
import { Categories } from '../../categories/entities/categories.entity';
import { ServiceProvider } from 'src/serviceprovider/serviceprovider/entities/serviceprovider.entity';
import { v4 as uuid } from 'uuid';

@Entity({
  name: 'appointments',
})
export class Appointment {
  @PrimaryColumn('uuid')
  AppointmentID: string = uuid();

  @ManyToOne(() => Categories, { eager: true, nullable: false })
  Category: Categories;

  @Column({
    type: 'date',
    nullable: false,
  })
  CreationDate: Date;

  @Column({
    type: 'date',
    nullable: false,
  })
  AppointmentDate: Date;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  hour: string;
  @Column({
    type: 'varchar',
    nullable: false,
  })
  Notes: string;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.PENDING,
  })
  Status: Status;

  @ManyToOne(() => Client)
  UserClient: Client;

  @ManyToOne(() => ServiceProvider, (provider) => provider.schedule)
  @JoinColumn({ name: 'UserProvider_id' })
  UserProvider: ServiceProvider;
}
