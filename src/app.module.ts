import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import typeormConfig from './config/typeorm';
import { AuthModule } from './auth/auth.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { ClientsModule } from './clients/clients.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeormConfig],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => configService.get('typeorm') || {},
    }),
    AuthModule,
  ],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const host = (configService.get<string>('DB_HOST') || '').trim();
        const port = parseInt((configService.get<string>('DB_PORT') || '5432').trim(), 10);
        const username = (configService.get<string>('DB_USER') || '').trim();
        const password = (configService.get<string>('DB_PASSWORD') || '').trim();
        const database = (configService.get<string>('DB_NAME') || '').trim();
        return {
          type: 'postgres',
          host,
          port,
          username,
          password,
          database,
          dropSchema: false,
          synchronize: true,
          autoLoadEntities: true,
        } as any;
      },
    }),
    AuthModule,
    AppointmentsModule,
    ClientsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
