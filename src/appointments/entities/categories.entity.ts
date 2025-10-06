import { Serviceprovider } from "src/serviceprovider/serviceprovider/entities/serviceprovider.entity";
import { Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import {v4 as uuid} from 'uuid'

@Entity({
    name: 'categories'
})
export class Categories{
    @PrimaryGeneratedColumn()
    CategoryID: string = uuid();

    @Column({
        type:'string',
        length:20,
        nullable: false
    })
    Name:string;

    @OneToMany(() =>Serviceprovider, (provider) =>provider.categoryId)
    @JoinColumn({name:'ServiceProviders'})
    ServiceProviders: Serviceprovider
}