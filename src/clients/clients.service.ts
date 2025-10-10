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

      // TODO: Validar contraseña actual con Supabase Auth
      // const isValidPassword = await this.validatePasswordWithSupabase(
      //   clientData.email,
      //   updateClientDto.currentPassword
      // );

      // SIMULACIÓN mientras tanto
      if (updateClientDto.currentPassword !== 'currentPassword123') {
        throw new ForbiddenException('La contraseña actual es incorrecta');
      }

      // TODO: Actualizar contraseña en Supabase Auth
      // await this.updatePasswordInSupabase(updateClientDto.newPassword);

      console.log('🔧 SIMULACIÓN: Contraseña actualizada en Supabase Auth');

      // Limpiar campos de contraseña del DTO (NO se guardan en PostgreSQL)
      const { currentPassword, newPassword, ...updateData } = updateClientDto;
      updateClientDto = updateData as UpdateClientDto;
    }

    // Actualizar solo datos de perfil en PostgreSQL
    return this.clientsRepository.updateClientProfile(id, updateClientDto);
  }

  async deleteClientProfile(id: string, user?: AuthenticatedClient) {
    // Verificar permisos: el cliente puede eliminar su propio perfil o un admin puede eliminar cualquier perfil
    if (user) {
      const isOwner = user.userId === id;
      const isAdmin = user.rol === UserRole.admin;

      if (!isOwner && !isAdmin) {
        throw new ForbiddenException(
          'Solo puedes eliminar tu propio perfil o ser administrador',
        );
      }
    }

    return this.clientsRepository.deleteClientProfile(id);
  }
}
