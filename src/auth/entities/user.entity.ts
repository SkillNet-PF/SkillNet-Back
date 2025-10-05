import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { UserRole } from '../../common/enums/user-role.enum';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  userId!: string;

  @Column({ nullable: true })
  imgProfile?: string;

  @Column()
  name!: string;

  @Column({ nullable: true })
  birthDate?: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  externalAuthId!: string;

  @Column({ nullable: true })
  address?: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.client,
  })
  rol!: UserRole;

  @Column({ type: 'text', nullable: true })
  paymentMethod?: string | null;

  @Column({ nullable: true })
  suscriptionId?: string;

  @Column({ nullable: true })
  providerId?: string;

  @Column({ default: true })
  isActive!: boolean;
}
