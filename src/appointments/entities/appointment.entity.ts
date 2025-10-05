import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import {v4 as uuid} from 'uuid'
import { Status } from "./status.enum";
@Entity({
    name: 'appointments'
})

export class Appointment {

    @PrimaryGeneratedColumn('uuid')
    AppointmentID: string = uuid();

    @ManyToOne(()=> Categories, (category) => category.appointments)
    @JoinColumn({name: 'category_id'})
    CategoryID: Category;

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
    Notes: string;

    @Column({
        type: 'enum',
        enum: Status,
        default: Status.PENDING
    })
    Status: Status;

    @ManyToOne(()=> Client, (client)=>client.appointments)
    UserClient: Client;

    @ManyToOne(()=> Provider, (provider)=> provider.)
    UserProvider:Provider ;
}
