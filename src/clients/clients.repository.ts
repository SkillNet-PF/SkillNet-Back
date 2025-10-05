//falta implementar la lógica real de los métodos, importar el modelo Client y el repositorio de TypeORM, y manejar errores y excepciones, además de agregar validaciones y decoradores de swagger, y usar DTOs en los métodos que los requieran, además de inyectar el repositorio en el constructor, y agregar decoradores de nestjs.

import { Injectable } from '@nestjs/common';

@Injectable()
export class ClientsRepository {
  //llevará un constructor con la inyección de dependencias del modelo Client
  //constructor(@InjectRepository(Client) private clientsRepository: Repository<Client>) {}

  //traer todos los perfiles de clientes (solo para admin)
  getAllClients() {
    return `traerá todos los perfiles de clientes`;
  }

  getClientProfile(id: string) {
    return `traerá el perfil del cliente #${id}`;
  }

  createClientProfile(createClientDto: any) {
    return `Creará un nuevo perfil de cliente`;
  }

  updateClientProfile(id: string, updateClientDto: any) {
    return `actualizará el perfil del cliente #${id}`;
  }

  deleteClientProfile(id: string) {
    return `borrará el perfil del cliente #${id}`;
  }
}
