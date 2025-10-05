import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServiceProvider } from './entities/serviceprovider.entity';
import { CreateServiceproviderDto } from './dto/create-serviceprovider.dto';
import { UpdateServiceproviderDto } from './dto/update-serviceprovider.dto';
import { PartialType } from '@nestjs/mapped-types';

@Injectable()
export class ServiceproviderService {
  constructor(
    @InjectRepository(ServiceProvider)
    private readonly providerRepo: Repository<ServiceProvider>,
  ) {}

  async create(dto: CreateServiceproviderDto): Promise<ServiceProvider> {
    const provider = this.providerRepo.create(dto);
    return await this.providerRepo.save(provider);
  }

  async findAll(): Promise<ServiceProvider[]> {
    return await this.providerRepo.find();
  }

  async findOne(id: string): Promise<ServiceProvider> {
    const provider = await this.providerRepo.findOne({
      where: { providerId: id },
    });

    if (!provider) throw new NotFoundException(`Provider with ID ${id} not found`);
    return provider;
  }

  async update(id: string, dto: UpdateServiceproviderDto): Promise<ServiceProvider> {
    await this.providerRepo.update(id, dto);
    const updated = await this.providerRepo.findOne({ where: { providerId: id } });
    if (!updated) throw new NotFoundException(`Provider with ID ${id} not found`);
    return updated;
  }

  async remove(id: string): Promise<void> {
    const result = await this.providerRepo.delete(id);
    if (result.affected === 0) throw new NotFoundException(`Provider with ID ${id} not found`);
  }
}
