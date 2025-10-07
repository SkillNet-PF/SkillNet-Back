import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServiceproviderModule } from './serviceprovider/serviceprovider/serviceprovider.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import typeorm from './config/typeorm'

@Module({
  imports: [ServiceproviderModule,
    ConfigModule.forRoot({isGlobal: true, load: [typeorm]}),
    TypeOrmModule.forRootAsync({
      inject:[ConfigService],
      useFactory:(config:ConfigService)=> config.get('typeorm')!

    }),
import { AuthModule } from './auth/auth.module';
import typeormConfig from './config/typeorm';
import { AppointmentsController } from './appointments/appointments.controller';
import { AppointmentsService } from './appointments/appointments.service';
import { AppointmentsModule } from './appointments/appointments.module';

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
    AppointmentsModule,
  ],
  controllers: [AppController , AppointmentsController],
  providers: [AppService, AppointmentsService],
})
export class AppModule {}
