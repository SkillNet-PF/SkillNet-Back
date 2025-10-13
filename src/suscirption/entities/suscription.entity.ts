import { Column, Entity, PrimaryColumn } from "typeorm";
import {v4 as uuid} from 'uuid'


@Entity('suscriptions')
export class suscriptions{
    @PrimaryColumn('uuid')
    SuscriptionID: string = uuid();

    @Column()
    Name: string;

    @Column()
    Descption:string;

    @Column()
    monthlyServices:number;

    @Column()
    price:number
}