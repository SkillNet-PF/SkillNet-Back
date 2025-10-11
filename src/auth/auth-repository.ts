import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Client } from 'src/clients/entities/client.entity';
import { ServiceProvider } from 'src/serviceprovider/serviceprovider/entities/serviceprovider.entity';
import { UserRole } from 'src/common/enums/user-role.enum';

@Injectable()
export class AuthRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(userData: Partial<User>): Promise<User> {
    const role = userData.rol ?? UserRole.client;
    if (role === UserRole.provider) {
      const providerRepo = this.userRepository.manager.getRepository(ServiceProvider);
      const provider = providerRepo.create(userData as Partial<ServiceProvider>);
      return await providerRepo.save(provider);
    }
    const clientRepo = this.userRepository.manager.getRepository(Client);
    const client = clientRepo.create(userData as Partial<Client>);
    return await clientRepo.save(client);
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
