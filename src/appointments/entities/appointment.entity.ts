import { Column, Entity, PrimaryColumn, BeforeInsert } from "typeorm";
import { randomUUID } from 'crypto'
import { Client } from "src/clients/entities/client.entity";
import { Status } from "./status.enum";
import { Categories } from "./categories.entity";
// import { Serviceprovider } from "src/serviceprovider/serviceprovider/entities/serviceprovider.entity";
@Entity({
    name: 'appointments'
})

export class Appointment {

    @PrimaryColumn('uuid')
    AppointmentID!: string;

    @BeforeInsert()
    setIdIfMissing(): void {
        if (!this.AppointmentID) {
            this.AppointmentID = randomUUID();
        }
    }

    @Column({ type: 'uuid', name: 'category_id', nullable: false })
    CategoryId: string;

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

    @Column({ type: 'uuid', name: 'Client_id', nullable: false })
    UserClientId: string;

    @Column({ type: 'uuid', name: 'UserProvider_id', nullable: false })
    UserProviderId: string;
}
