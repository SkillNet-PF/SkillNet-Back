import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from 'src/auth/entities/user.entity';

@Entity('activity_logs')
export class ActivityLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.activityLogs, { onDelete: 'CASCADE' })
  user: User;

  @Column()
  action: string;

  @CreateDateColumn()
  createdAt: Date;
}
