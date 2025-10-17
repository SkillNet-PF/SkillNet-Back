import { Module, OnModuleInit } from '@nestjs/common';
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
import { CategoriesModule } from './categories/categories.module';
import { SeedsModule } from './seeds/seeds.module';
import { InitialDataSeed } from './seeds/seeds.service';
import { SupabaseModule } from './auth/supabase/supabase.module';

@Module({
  imports: [
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
          dropSchema: false, // ✅ ACTIVAR DROP SCHEMA SOLO EN DESARROLLO
          synchronize: true,
          logging: false,
          autoLoadEntities: true,
        } as any;
      },
    }),
    SupabaseModule,
    AuthModule,
    AppointmentsModule,
    ClientsModule,
    ServiceproviderModule,
    SubscriptionModule,
    CategoriesModule,
    SeedsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly seedService: InitialDataSeed) {}

  async onModuleInit() {
    await this.seedService.run();
  }
}
