import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import {v4 as uuid} from 'uuid'
import { Status } from "./status.enum";
import { Categories } from "./categories.entity";
import { ServiceProvider } from "src/serviceprovider/serviceprovider/entities/serviceprovider.entity";
@Entity({
    name: 'appointments'
})

export class Appointment {

    @PrimaryGeneratedColumn('uuid')
    AppointmentID: string = uuid();

    @ManyToOne(()=> Categories)
    @JoinColumn({name: 'category_id'})
    Category: Categories;

    @Column({
        type:'date',
        nullable: false
    })
    CreationDate: Date;

    @Column({
        type: 'date',
        nullable: false
    })
    AppointmentDate: Date;

    @Column({
        type: 'varchar',
        nullable:false
    })
    hour:string
    @Column({
        type: 'varchar',
        nullable:false
    })
    Notes: string;

    @Column({
        type: 'enum',
        enum: Status,
        default: Status.PENDING
    })
    Status: Status;

    @ManyToOne(()=> Client, (client)=>client.appointments)
    @JoinColumn({name:'Client_id'})
    UserClient: Client;

    @ManyToOne(()=> ServiceProvider, (provider)=> provider.schedule)
    @JoinColumn({name:'UserProvider_id'})
    UserProvider:ServiceProvider ;
}
