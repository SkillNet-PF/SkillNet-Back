import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
    // Un cliente solo puede editar su propio perfil
    if (user?.rol === UserRole.client && user.userId !== id) {
      throw new ForbiddenException('No se puede modificar este perfil');
    }

    // Si quiere cambiar contraseña, validar flujo de password
    if (updateClientDto.newPassword) {
      if (!updateClientDto.currentPassword) {
        throw new BadRequestException(
          'La contraseña actual es requerida para cambiar la contraseña',
        );
      }

      const clientData = await this.clientsRepository.getClientProfile(id);
      if (!clientData) {
        throw new NotFoundException('Cliente no encontrado');
      }

      // Narrowing: asegurar email antes de usarlo
      const email = clientData.email;
      if (!email) {
        throw new BadRequestException('El cliente no tiene email registrado.');
      }

      const isValidPassword = await this.validatePasswordWithSupabase(
        email,
        updateClientDto.currentPassword,
      );
      if (!isValidPassword) {
        throw new ForbiddenException('La contraseña actual es incorrecta');
      }

      await this.updatePasswordInSupabase(updateClientDto.newPassword);

      // Limpiar campos de contraseña antes de persistir el perfil
      const { currentPassword, newPassword, ...rest } = updateClientDto;
      updateClientDto = rest as UpdateClientDto;
    }

    // Persistir solo datos de perfil en PostgreSQL
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
