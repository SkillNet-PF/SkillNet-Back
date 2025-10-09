import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class AuthRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(userData: Partial<User>): Promise<User> {
    const user = this.userRepository.create(userData);
    return await this.userRepository.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { email } });
  }

  async findByExternalAuthId(externalAuthId: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { externalAuthId } });
  }

  async upsertByExternalAuthId(
    externalAuthId: string,
    userData: Partial<User>,
  ): Promise<User> {
    const existing = await this.findByExternalAuthId(externalAuthId);
    if (existing) {
      const merged = this.userRepository.merge(existing, userData);
      return await this.userRepository.save(merged);
    }
    const created = this.userRepository.create({ ...userData, externalAuthId });
    return await this.userRepository.save(created);
  }

  async findById(id: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { userId: id } });
  }

  async update(id: string, userData: Partial<User>): Promise<User | null> {
    await this.userRepository.update({ userId: id }, userData);
    return await this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.userRepository.delete({ userId: id });
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }
}
