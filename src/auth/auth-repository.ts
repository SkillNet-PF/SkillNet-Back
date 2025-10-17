import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Client } from 'src/clients/entities/client.entity';
import { ServiceProvider } from 'src/serviceprovider/serviceprovider/entities/serviceprovider.entity';
import { UserRole } from 'src/common/enums/user-role.enum';
import { RegisterClientDto } from './dto/register-client.dto';

@Injectable()
export class AuthRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
    @InjectRepository(ServiceProvider)
    private readonly providerRepository: Repository<ServiceProvider>,
  ) {}

  async createClient(
    clientData: Partial<User> & Partial<RegisterClientDto>,
  ): Promise<User> {
    // Calcular servicios según el plan seleccionado
    const getServicesByPlan = (subscription: string | undefined): number => {
      switch (subscription) {
        case 'basic':
          return 5;
        case 'standard':
          return 10;
        case 'premium':
          return 15;
        default:
          return 5; // Plan básico por defecto
      }
    };

    const enhancedClientData = {
      ...clientData,
      rol: UserRole.client, // Forzar rol de cliente
      servicesLeft: getServicesByPlan(clientData.subscription as string),
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 días
      paymentStatus: false,
    };

    const client = this.clientRepository.create(enhancedClientData);
    return await this.clientRepository.save(client);
  }

  async createProvider(providerData: Partial<User>): Promise<User> {
    const enhancedProviderData = {
      ...providerData,
      rol: UserRole.provider, // Forzar rol de proveedor
    };

    const provider = this.providerRepository.create(enhancedProviderData);
    return await this.providerRepository.save(provider);
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
      // Para updates, usar el repositorio correcto según el rol existente
      switch (existing.rol) {
        case UserRole.client:
          const mergedClient = this.clientRepository.merge(
            existing as Client,
            userData,
          );
          return await this.clientRepository.save(mergedClient);
        case UserRole.provider:
          const mergedProvider = this.providerRepository.merge(
            existing as ServiceProvider,
            userData,
          );
          return await this.providerRepository.save(mergedProvider);
        default:
          const merged = this.userRepository.merge(existing, userData);
          return await this.userRepository.save(merged);
      }
    }
    // Si no existe, crear nuevo usando métodos específicos según rol
    const dataWithAuth = { ...userData, externalAuthId };

    // Para Auth0, por defecto crear como cliente (puede ajustarse según lógica de negocio)
    return await this.createClient(dataWithAuth);
  }

  async findById(id: string): Promise<User | null> {
    // Primero intentar encontrar como usuario base
    const user = await this.userRepository.findOne({ where: { userId: id } });

    if (!user) {
      return null;
    }

    // Si es un proveedor, obtener datos completos de la tabla ServiceProvider
    if (user.rol === UserRole.provider) {
      const provider = await this.providerRepository.findOne({
        where: { userId: id },
        relations: ['category'], // Incluir la categoría si existe
      });

      if (provider) {
        // Retornar los datos combinados del proveedor
        return provider;
      }
    }

    // Si es un cliente, obtener datos completos de la tabla Client
    if (user.rol === UserRole.client) {
      const client = await this.clientRepository.findOne({
        where: { userId: id },
      });

      if (client) {
        return client;
      }
    }

    // Si no se encuentra en las tablas específicas, retornar el usuario base
    return user;
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
