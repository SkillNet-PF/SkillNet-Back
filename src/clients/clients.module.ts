//falta importar decoradores de nestjs, el service y el controller, agregar repositorio typeorm y el modelo Client, exportar el módulo, configurar el módulo para inyectar el servicio y el controller, y agregar el repositorio al array de providers

import { Module } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { ClientsController } from './clients.controller';

@Module({
  controllers: [ClientsController],
  providers: [ClientsService],
})
export class ClientsModule {}
