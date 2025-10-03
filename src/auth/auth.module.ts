import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { SupabaseModule } from './supabase/supabase.module';
import { DbModule } from '../db/db.module';
import { PostgresUserRepository } from './repositories/user.repo.postgres';
import { UserRepository } from './repositories/user.repository';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'dev_secret',
      signOptions: { expiresIn: '1d' },
    }),
    SupabaseModule,
    DbModule,
  ],
  providers: [
    AuthService,
    JwtStrategy,
    { provide: UserRepository, useClass: PostgresUserRepository },
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}


