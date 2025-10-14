import { Column, Entity, PrimaryColumn, OneToMany, JoinColumn } from "typeorm";
import { ServiceProvider } from "src/serviceprovider/serviceprovider/entities/serviceprovider.entity";
import {v4 as uuid} from 'uuid'

@Entity({
    name: 'categories'
})
export class Categories{
    @PrimaryColumn('uuid')
    CategoryID: string = uuid()

    @Column({
        type:'varchar',
        length:20,
        nullable: false
    })
    Name:string;

    @OneToMany(()=>ServiceProvider, (serviceProvider)=> serviceProvider.category)
    @JoinColumn({name: 'serviceProviders'})
    ServiceProviders: ServiceProvider[]
    

}