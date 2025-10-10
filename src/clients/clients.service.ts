import {
  BadRequestException,
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
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ClientsService {
  private supabase: SupabaseClient;

  constructor(
    private clientsRepository: ClientsRepository,
    private configService: ConfigService,
  ) {
    this.supabase = createClient(
      this.configService.get<string>('SUPABASE_URL') || '',
      this.configService.get<string>('SUPABASE_ANON_KEY') || '',
    );
  }

  async getAllClients(page: number, limit: number, filters?: ClientFilters) {
    const validPage = Math.max(1, page);
    const validLimit = Math.min(Math.max(1, limit), 100); //

    const result = await this.clientsRepository.getAllClients(
      validPage,
      validLimit,
      filters,
    );

    return {
      success: true,
      data: result,
      pagination: {
        currentPage: validPage,
        usersPerPage: validLimit,
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

      // Validar contraseña actual con Supabase Auth
      if (!updateClientDto.currentPassword) {
        throw new BadRequestException(
          'La contraseña actual es requerida para actualizar el perfil',
        );
      }

      const isValidPassword = await this.validatePasswordWithSupabase(
        clientData.email,
        updateClientDto.currentPassword,
      );

      if (!isValidPassword) {
        throw new ForbiddenException('La contraseña actual es incorrecta');
      }

      // Actualizar contraseña en Supabase Auth
      if (updateClientDto.newPassword) {
        await this.updatePasswordInSupabase(updateClientDto.newPassword);
        console.log('✅ Contraseña actualizada en Supabase Auth');
      }

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

  /**
   * Valida contraseña con Supabase Auth
   */
  private async validatePasswordWithSupabase(
    email: string,
    password: string,
  ): Promise<boolean> {
    try {
      const { error } = await this.supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.log('❌ Error validando contraseña:', error.message);
        return false;
      }

      console.log('✅ Contraseña validada correctamente');
      return true;
    } catch (error) {
      console.error('❌ Error en validación de contraseña:', error);
      return false;
    }
  }

  /**
   * Actualiza contraseña en Supabase Auth
   */
  private async updatePasswordInSupabase(newPassword: string): Promise<void> {
    try {
      const { error } = await this.supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        console.error('❌ Error actualizando contraseña:', error.message);
        throw new BadRequestException(
          'Error actualizando contraseña en el sistema de autenticación',
        );
      }

      console.log('✅ Contraseña actualizada en Supabase Auth');
    } catch (error) {
      console.error('❌ Error crítico actualizando contraseña:', error);
      throw new BadRequestException('Error actualizando contraseña');
    }
  }
}
