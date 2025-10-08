//falta implementar la lógica real de los métodos, importar el modelo Client y el repositorio de TypeORM, y manejar errores y excepciones, además de agregar validaciones y decoradores de swagger, y usar DTOs en los métodos que los requieran, además de inyectar el repositorio en el constructor, y agregar decoradores de nestjs.

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ClientsRepository {
  constructor(
    @InjectRepository(Client) private clientsRepository: Repository<Client>,
  ) {}

  //traer todos los perfiles de clientes (solo para admin) y paginar
  async getAllClients(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const [clients, totalClients] = await this.clientsRepository.findAndCount({
      take: limit,
      skip: skip,
    });
    return {
      clients: clients.map(
        ({ idExternalPassword, ...clientWithoutPassword }) =>
          clientWithoutPassword,
      ),
      totalClients,
      totalPages: Math.ceil(totalClients / limit),
    };
  }

  async getClientProfile(id: string) {
    return `traerá el perfil del cliente #${id}`;
  }

  async updateClientProfile(id: string, updateClientDto: any) {
    return `actualizará el perfil del cliente #${id}`;
  }

  async deleteClientProfile(id: string) {
    return `borrará el perfil del cliente #${id}`;
  }
}
