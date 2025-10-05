//al controlador le faltan los guardianes de autenticación, roles y validaciones, importar decoradores de nestjs, el service, los DTOs y configurar las rutas, inyectar el servicio en el constructor y usar los DTOs en los métodos que los requieran...

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  //traer todos los perfiles de clientes (solo para admin)
  @Get()
  getAllClients() {
    return this.clientsService.getAllClients();
  }

  //para acceder a la ruta deberá tener guardianes de autenticación, roles y validaciones
  @Get('profile/:id')
  getClientProfile(@Param('id') id: string) {
    return this.clientsService.getClientProfile(id);
  }

  //Crear un nuevo perfil de cliente
  @Post()
  createClientProfile(@Body() createClientDto: CreateClientDto) {
    return this.clientsService.createClientProfile(createClientDto);
  }

  //Actualizar datos del perfil del cliente
  @Put('profile/:id')
  updateClientProfile(
    @Param('id') id: string,
    @Body() updateClientDto: UpdateClientDto,
  ) {
    return this.clientsService.updateClientProfile(id, updateClientDto);
  }

  //Borrar perfil del cliente (soft delete)
  @Delete('profile/:id')
  deleteClientProfile(@Param('id') id: string) {
    return this.clientsService.deleteClientProfile(id);
  }
}
