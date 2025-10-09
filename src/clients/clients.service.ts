import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { ClientsRepository } from './clients.repository';
import { ClientFilters } from './interfaces/client-filter';
import { Not } from 'typeorm';
import { AuthenticatedClient } from './interfaces/authenticated-client';
import { UserRole } from 'src/common/enums/user-role.enum';

@Injectable()
export class ClientsService {
  constructor(private clientsRepository: ClientsRepository) {}

  async getAllClients(page: number, limit: number, filters?: ClientFilters) {
    const validPage = Math.max(1, page); //sintaxis: .max(valor1, valor2) - Devuelve el mayor de los dos
    const validLimit = Math.min(Math.max(1, limit), 100); //sintaxis: .min(valor1, valor2) - Devuelve el menor(rango entre 1 y 100).

    const result = await this.clientsRepository.getAllClients(
      validPage,
      validLimit,
      filters,
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

  async getClientProfile(id: string, user?: AuthenticatedClient) {
    if (user && user.rol === UserRole.client && user.userId !== id)
      throw new ForbiddenException('No se puede acceder a este perfil');

    return this.clientsRepository.getClientProfile(id);
  }

  async updateClientProfile(
    id: string,
    updateClientDto: UpdateClientDto,
    user?: AuthenticatedClient,
  ) {
    if (user && user.rol === UserRole.client && user.userId !== id) {
      throw new ForbiddenException('No se puede modificar este perfil');
    }

    if (updateClientDto.newPassword && !updateClientDto.currentPassword) {
      throw new ForbiddenException(
        'La contraseña actual es requerida para cambiar la contraseña',
      );
    }

    if (updateClientDto.newPassword) {
      const clientData = await this.clientsRepository.getClientProfile(id);

      if (!clientData) {
        throw new NotFoundException('Cliente no encontrado');
      }
    }

    //! ----------------------------------------------------------------------
    //* TERMINAR LOGICA DE CAMBIO DE CONTRASEÑA CON SUPABASE Y CON DB LOCAL
    //* PREGUNTAR SI SOLO USAREMOS SUPABASE O DB LOCAL + SUPABASE
    //! ----------------------------------------------------------------------
  }

  async deleteClientProfile(id: string) {
    return `borrará el perfil del cliente #${id}`;
  }
}
