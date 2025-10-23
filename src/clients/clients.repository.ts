import {
  BadGatewayException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import { Repository } from 'typeorm';
import { ClientFilters } from './interfaces/client-filter';
import { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class ClientsRepository {
  constructor(
    @InjectRepository(Client) private clientsRepository: Repository<Client>,
  ) {}

  async getAllClients(page: number, limit: number, filters?: ClientFilters) {
    const skip = (page - 1) * limit;
    const [clients, totalClients] = await this.clientsRepository.findAndCount({
      take: limit,
      skip: skip,
      where: { ...filters },
    });

    return {
      clients: clients.map(
        ({ externalAuthId, paymentMethod, ...clientWithoutSensitiveData }) =>
          clientWithoutSensitiveData,
      ),
      totalClients,
      totalPages: Math.ceil(totalClients / limit),
    };
  }

  async getClientProfile(id: string) {
    const client = await this.clientsRepository.findOne({
      where: { userId: id },
      relations: {
        suscription: true, // Descomentar si se implementa la relación
        // providers: true, // Descomentar si se implementa la relación
        // appointments: true, // Descomentar si se implementa la relación
      },
    });

    if (!client) throw new NotFoundException('Cliente no encontrado');

    const { externalAuthId, paymentMethod, ...clientWithoutSensitiveData } =
      client;

    return clientWithoutSensitiveData;
  }

  async updateClientProfile(id: string, updateClientDto: UpdateClientDto) {
    const client = await this.clientsRepository.findOne({
      where: { userId: id },
    });

    if (!client) throw new NotFoundException('Cliente no encontrado');

    const updatedClient = await this.clientsRepository.save({
      ...client,
      ...updateClientDto,
    });

    const { externalAuthId, paymentMethod, ...clientWithoutSensitiveInfo } =
      updatedClient;

    return clientWithoutSensitiveInfo;
  }

  async deleteClientProfile(id: string) {
    // Verificar que el cliente existe
    const client = await this.clientsRepository.findOne({
      where: { userId: id },
    });

    if (!client) throw new NotFoundException('Cliente no encontrado');

    // Soft delete: marcar como inactivo en lugar de eliminar completamente
    const deletedClient = await this.clientsRepository.save({
      ...client,
      isActive: false,
    });

    return {
      message: 'Cuenta eliminada exitosamente',
      status: 'success',
      clientId: deletedClient.userId,
    };
  }
}
