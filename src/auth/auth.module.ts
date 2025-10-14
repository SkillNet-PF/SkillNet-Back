import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { SupabaseModule } from './supabase/supabase.module';
import { User } from './entities/user.entity';
import { Client } from 'src/clients/entities/client.entity';
import { ServiceProvider } from 'src/serviceprovider/serviceprovider/entities/serviceprovider.entity';
import { AuthRepository } from './auth-repository';
// OIDC guard moved to src/guards; no import/export here

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([User, Client, ServiceProvider]),
    PassportModule,
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET', 'dev_secret'),
        signOptions: { expiresIn: '1d' },
      }),
    }),
    SupabaseModule,
  ],
  providers: [AuthService, JwtStrategy, AuthRepository],
  controllers: [AuthController],
  exports: [AuthService, AuthRepository],
})
export class AuthModule {}
