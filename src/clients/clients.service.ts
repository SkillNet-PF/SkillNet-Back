//En el clients service falta importar los DTOs, decoradores de nestjs, inyectar el repositorio en el constructor y usarlo en los métodos del servicio, agregar validaciones y decoradores de swagger, y manejar errores y excepciones, además de implementar la lógica de negocio real.

import { Injectable } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class ClientsService {
  create(createClientDto: CreateClientDto) {
    return 'This action adds a new client';
  }

  getAllClients() {
    return `Traerá todos los perfiles de clientes`;
  }

  getClientProfile(id: string) {
    return `Traerá el perfil del cliente #${id}`;
  }

  createClientProfile(createClientDto: CreateClientDto) {
    return `Creará un nuevo perfil de cliente`;
  }

  updateClientProfile(id: string, updateClientDto: UpdateClientDto) {
    return `actualizará el perfil del cliente #${id}`;
  }

  deleteClientProfile(id: string) {
    return `borrará el perfil del cliente #${id}`;
  }
}
