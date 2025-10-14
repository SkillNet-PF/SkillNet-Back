import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsService } from './clients.service';
import { ClientsController } from './clients.controller';
import { ClientsRepository } from './clients.repository';
import { Client } from './entities/client.entity';
import { suscriptions } from 'src/suscirption/entities/suscription.entity';
import { AuthModule } from 'src/auth/auth.module';
import { PublicClientsController } from './public-clients.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Client, suscriptions]), AuthModule],
  controllers: [ClientsController, PublicClientsController],
  providers: [ClientsService, ClientsRepository],
  exports: [ClientsService, ClientsRepository],
})
export class ClientsModule {}
