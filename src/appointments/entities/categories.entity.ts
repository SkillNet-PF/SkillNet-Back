import { Column, Entity, PrimaryColumn, BeforeInsert } from "typeorm";
import { randomUUID } from 'crypto'

@Entity({
    name: 'categories'
})
export class Categories{
    @PrimaryColumn('uuid')
    CategoryID!: string;

    @BeforeInsert()
    setIdIfMissing(): void {
        if (!this.CategoryID) {
            this.CategoryID = randomUUID();
        }
    }

    @Column({
        type:'varchar',
        length:20,
        nullable: false
    })
    Name:string;
}