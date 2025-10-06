//En el clients service falta importar los DTOs, decoradores de nestjs, inyectar el repositorio en el constructor y usarlo en los métodos del servicio, agregar validaciones y decoradores de swagger, y manejar errores y excepciones, además de implementar la lógica de negocio real.

import { Injectable } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { ClientsRepository } from './clients.repository';

@Injectable()
export class ClientsService {
  constructor(private clientsRepository: ClientsRepository) {}

  async getAllClients(page: number, limit: number) {
    const validPage = Math.max(1, page); //sintaxis: .max(valor1, valor2) - Devuelve el mayor de los dos
    const validLimit = Math.min(Math.max(1, limit), 50); //sintaxis: .min(valor1, valor2) - Devuelve el menor(rango entre 1 y 50)

    const result = await this.clientsRepository.getAllClients(
      validPage,
      validLimit,
    );

    return {
      success: true, // Indica que la operación fue exitosa
      data: result, // Datos de los clientes
      pagination: {
        // Información de paginación
        currentPage: validPage, // Página actual
        usersPerPage: validLimit, // Clientes por página
      },
    };
  }

  getClientProfile(id: string) {
    return `Traerá el perfil del cliente #${id}`;
  }

  updateClientProfile(id: string, updateClientDto: UpdateClientDto) {
    return `actualizará el perfil del cliente #${id}`;
  }

  deleteClientProfile(id: string) {
    return `borrará el perfil del cliente #${id}`;
  }
}
