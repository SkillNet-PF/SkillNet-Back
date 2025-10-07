import {
  Controller,
  Get,
  Body,
  Param,
  Delete,
  Put,
  Query,
  HttpStatus,
  ParseUUIDPipe,
  HttpCode,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { ClientsService } from './clients.service';
// import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { ClientFilters } from './interfaces/client-filter';
import { AuthenticatedClient } from './interfaces/authenticated-client';

interface AuthenticatedRequest extends Request {
  user: AuthenticatedClient;
}

// @ApiTags('Clients')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Get()
  @Roles(UserRole.admin)
  @ApiOperation({
    summary: 'Obtener todos los clientes',
    description:
      'Endpoint para administradores - Lista todos los clientes con paginación',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    example: 1,
    description: 'Número de página',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    example: 10,
    description: 'Elementos por página',
  })
  @ApiQuery({
    name: 'name',
    required: false,
    example: 'Juan Perez',
    description: 'Filtrar por nombre del cliente',
  })
  @ApiQuery({
    name: 'email',
    required: false,
    example: 'juan@email.com',
    description: 'Filtrar por email del cliente',
  })
  @ApiQuery({
    name: 'rol',
    required: false,
    example: 'client',
    description: 'Filtrar por rol (client, provider, admin)',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de clientes obtenida exitosamente',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado - Token requerido',
  })
  @ApiResponse({
    status: 403,
    description: 'Prohibido - Solo administradores',
  })
  getAllClients(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('name') name?: string,
    @Query('email') email?: string,
    @Query('rol') rol?: string,
  ) {
    const filters: ClientFilters = {
      name,
      email,
      rol: rol as UserRole,
    };

    if (page && limit) {
      return this.clientsService.getAllClients(
        Number(page),
        Number(limit),
        filters,
      );
    }
    return this.clientsService.getAllClients(5, 10, filters);
  }

  @Get(':id')
  @Roles(UserRole.admin, UserRole.client)
  @ApiOperation({
    summary: 'Obtener perfil de cliente',
    description:
      'Obtiene la información completa del perfil de un cliente específico',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único del cliente',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Perfil del cliente obtenido exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Cliente no encontrado',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado - Token requerido',
  })
  getClientProfile(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: AuthenticatedRequest, //Esto es como si tuviera
  ) {
    return this.clientsService.getClientProfile(id, req.user);
  }

  @Put('profile/:id')
  @Roles(UserRole.admin, UserRole.client)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Actualizar perfil de cliente',
    description:
      'Permite al cliente actualizar su información personal, suscripción y contraseña',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único del cliente',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({
    type: UpdateClientDto,
    description: 'Datos a actualizar del cliente',
  })
  @ApiResponse({
    status: 200,
    description: 'Perfil actualizado exitosamente',
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos - Revisar validaciones',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado - Token requerido',
  })
  @ApiResponse({
    status: 404,
    description: 'Cliente no encontrado',
  })
  updateClientProfile(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateClientDto: UpdateClientDto,
  ) {
    return this.clientsService.updateClientProfile(id, updateClientDto);
  }

  @Delete('profile/:id')
  @Roles(UserRole.admin, UserRole.client)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Eliminar perfil de cliente',
    description:
      'Desactiva el perfil del cliente (soft delete) - Solo admins o el propio usuario',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único del cliente',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 204,
    description: 'Cliente desactivado exitosamente',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado - Token requerido',
  })
  @ApiResponse({
    status: 403,
    description: 'Prohibido - No tienes permisos',
  })
  @ApiResponse({
    status: 404,
    description: 'Cliente no encontrado',
  })
  deleteClientProfile(@Param('id', ParseUUIDPipe) id: string) {
    return this.clientsService.deleteClientProfile(id);
  }
}
