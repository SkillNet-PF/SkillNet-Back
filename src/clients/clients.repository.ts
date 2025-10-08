import {
  BadGatewayException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import { Repository } from 'typeorm';
import { ClientFilters } from './interfaces/client-filter';

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
        // suscription: true, // Descomentar si se implementa la relación
        // providers: true, // Descomentar si se implementa la relación
        // appointments: true, // Descomentar si se implementa la relación
      },
    });

    if (!client) throw new NotFoundException('Cliente no encontrado');

    const { externalAuthId, paymentMethod, ...clientWithoutSensitiveData } =
      client;

    return clientWithoutSensitiveData;
  }

  async updateClientProfile(id: string, updateClientDto: any) {}

  async deleteClientProfile(id: string) {
    return `borrará el perfil del cliente #${id}`;
  }
}
