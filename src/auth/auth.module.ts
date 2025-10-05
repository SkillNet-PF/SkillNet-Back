import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { SupabaseModule } from './supabase/supabase.module';
import { User } from './entities/user.entity';
import { AuthRepository } from './auth-repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
    SupabaseModule,
  ],
  providers: [
    AuthService,
    JwtStrategy,
    AuthRepository,
  ],
  controllers: [AuthController],
  exports: [AuthService, AuthRepository],
})
export class AuthModule {}


