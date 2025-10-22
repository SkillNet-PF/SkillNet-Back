import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
import { User } from 'src/auth/entities/user.entity';

@Entity('activityLog')
export class ActivityLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.activityLogs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user' })
  user: User;

  @Column()
  action: string;

  @CreateDateColumn()
  createdAt: Date;
}
