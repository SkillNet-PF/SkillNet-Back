import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import typeormConfig from './config/typeorm';
import { ClientsModule } from './clients/clients.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { log } from 'console';
import { ServiceproviderModule } from './serviceprovider/serviceprovider/serviceprovider.module';
import { SubscriptionModule } from './subscription/subscription.module';

@Module({
  imports: [
    ClientsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const host = (configService.get<string>('DB_HOST') || '').trim();
        const port = parseInt(
          (configService.get<string>('DB_PORT') || '5432').trim(),
          10,
        );
        const username = (configService.get<string>('DB_USER') || '').trim();
        const password = (
          configService.get<string>('DB_PASSWORD') || ''
        ).trim();
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
          logging: true,
        
        } as any;
      },
    }),
    AuthModule,
    AppointmentsModule,
    ClientsModule,
    ServiceproviderModule,
    SubscriptionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
