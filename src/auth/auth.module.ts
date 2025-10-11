import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { SupabaseModule } from './supabase/supabase.module';
import { User } from './entities/user.entity';
// ===== NUEVOS IMPORTS PARA HERENCIA =====
import { Client } from '../clients/entities/client.entity';
import { ServiceProvider } from '../serviceprovider/serviceprovider/entities/serviceprovider.entity';
// ===== FIN NUEVOS IMPORTS =====
import { AuthRepository } from './auth-repository';
// OIDC guard moved to src/guards; no import/export here

@Module({
  imports: [
    // ===== CONFIGURACIÓN ORIGINAL (COMENTADA PARA ROLLBACK) =====
    // TypeOrmModule.forFeature([User]),
    // ===== FIN CONFIGURACIÓN ORIGINAL =====

    // ===== NUEVA CONFIGURACIÓN CON HERENCIA =====
    TypeOrmModule.forFeature([User, Client, ServiceProvider]),
    // ===== FIN NUEVA CONFIGURACIÓN =====
    PassportModule,
    JwtModule.register({
      global: true,
      // ===== CÓDIGO ORIGINAL (COMENTADO PARA ROLLBACK) =====
      // secret: process.env.JWT_SECRET || 'dev_secret',
      // ===== FIN CÓDIGO ORIGINAL =====

      // ===== NUEVA CONFIGURACIÓN CON SECRETO CORRECTO =====
      secret: process.env.JWT_SECRET || 'devsecret',
      // ===== FIN NUEVA CONFIGURACIÓN =====
      signOptions: { expiresIn: '1d' },
    }),
    SupabaseModule,
  ],
  providers: [AuthService, JwtStrategy, AuthRepository],
  controllers: [AuthController],
  exports: [AuthService, AuthRepository],
})
export class AuthModule {}
