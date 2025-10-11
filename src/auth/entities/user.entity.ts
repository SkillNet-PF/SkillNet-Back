import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  TableInheritance,
} from 'typeorm';
import { UserRole } from '../../common/enums/user-role.enum';
import { v4 as uuid } from 'uuid';

// ===== CONFIGURACIÓN ORIGINAL (COMENTADA PARA ROLLBACK) =====
// @TableInheritance({ column: { type: 'enum', name: 'rol' } })
// ===== FIN CONFIGURACIÓN ORIGINAL =====

// ===== NUEVA CONFIGURACIÓN CON DISCRIMINADOR EXPLÍCITO =====
@Entity('users')
@TableInheritance({
  column: { type: 'enum', name: 'rol', enum: UserRole },
  pattern: 'STI', // Single Table Inheritance
})
// ===== FIN NUEVA CONFIGURACIÓN =====
export abstract class User {
  @PrimaryGeneratedColumn('uuid')
  userId: string = uuid();

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

  @Column({ default: true })
  isActive!: boolean;
}
