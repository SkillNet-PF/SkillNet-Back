import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Client } from '../clients/entities/client.entity';
import { ServiceProvider } from 'src/serviceprovider/serviceprovider/entities/serviceprovider.entity';
import { UserRole } from 'src/common/enums/user-role.enum';

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

  async create(userData: Partial<User>): Promise<User> {
    // ===== CÓDIGO ORIGINAL (COMENTADO PARA ROLLBACK) =====
    // const user = this.userRepository.create(userData);
    // return await this.userRepository.save(user);
    // ===== FIN CÓDIGO ORIGINAL =====

    // ===== NUEVA IMPLEMENTACIÓN CON HERENCIA =====
    const { rol } = userData;

    switch (rol) {
      case UserRole.client:
        const clientData = {
          ...userData,
          // isActive se establece automáticamente por @Column({ default: true })
          //los servicios iniciales dependerán del plan que se elija en el frontend (basic =5, standard=10, premium=15)
          // servicesLeft: userData.plan === 'basic' ? 5 : userData.plan === 'standard' ? 10: 15,
          servicesLeft: 5,
          startDate: new Date(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Fecha de fin de la suscripción (30 días después)
          paymentStatus: false,
        };

        const client = this.clientRepository.create(clientData);
        return await this.clientRepository.save(client);

      case UserRole.provider:
        const providerData = {
          ...userData,
          // isActive se establece automáticamente por @Column({ default: true })
          bio: '',
          dias: [], // Corregido: era "días"
          horarios: [], // Corregido: era "horario"
          // categories: [], // Comentado: se maneja por relación
        };

        const provider = this.providerRepository.create(providerData);
        return await this.providerRepository.save(provider);

      //El usuario admin no se crea desde el registro, solo puede ser asignado por otro admin o por el sistema
      case UserRole.admin:
        throw new BadRequestException(
          'No se puede crear un usuario admin desde el registro',
        );

      default:
        throw new BadRequestException(`Rol: ${rol} no válido`);
    }
    // ===== FIN NUEVA IMPLEMENTACIÓN =====
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
    // ===== CÓDIGO ORIGINAL (COMENTADO PARA ROLLBACK) =====
    // const existing = await this.findByExternalAuthId(externalAuthId);
    // if (existing) {
    //   const merged = this.userRepository.merge(existing, userData);
    //   return await this.userRepository.save(merged);
    // }
    // const created = this.userRepository.create({ ...userData, externalAuthId });
    // return await this.userRepository.save(created);
    // ===== FIN CÓDIGO ORIGINAL =====

    // ===== NUEVA IMPLEMENTACIÓN CON HERENCIA =====
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
    // Si no existe, crear nuevo usando el método create que ya maneja los roles
    return await this.create({ ...userData, externalAuthId });
    // ===== FIN NUEVA IMPLEMENTACIÓN =====
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
