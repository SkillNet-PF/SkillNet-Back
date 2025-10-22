import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActivityLog } from './entity/activityLog.entity';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class ActivityLogService {
  constructor(
    @InjectRepository(ActivityLog)
    private readonly activityLogRepository: Repository<ActivityLog>,
  ) {}

  async create(user: User, action: string) {
    const log = this.activityLogRepository.create({ user, action });
    return this.activityLogRepository.save(log);
  }

  async getLatest() {
    const logs = await this.activityLogRepository.find({
      relations:['user'], 
      order: { createdAt: 'DESC' }});

    return logs;
  }
}
