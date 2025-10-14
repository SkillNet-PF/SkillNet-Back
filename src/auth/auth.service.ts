import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { ProviderRegisterDto } from './dto/provider-register.dto';
import { LoginDto } from './dto/login.dto';
import { User } from './entities/user.entity';
import { AuthRepository } from './auth-repository';
import { SupabaseService } from './supabase/supabase.service';
import type { Request } from 'express';
import { UserRole } from '../common/enums/user-role.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService, 
    private readonly authRepository: AuthRepository,
    private readonly supabase: SupabaseService,
  ) {}

  async register(payload: RegisterDto): Promise<{ user: User; accessToken: string }> {
    const { email, password, name } = payload;
    const { data, error } = await this.supabase.signUpWithEmail(email, password);
    if (error) {
      throw new UnauthorizedException(error.message);
    }
    const externalAuthId = data.user?.id ?? '';

    const userData: Partial<User> = {
      ...payload,
      externalAuthId,
    };
    const createdUser = await this.authRepository.create(userData);
    const accessToken = await this.signJwt(createdUser);
    return { user: createdUser, accessToken };
  }

  async registerProvider(payload: ProviderRegisterDto): Promise<{ user: User; accessToken: string }> {
    const { email, password, name, about, serviceType, days, horarios } = payload;
    const { data, error } = await this.supabase.signUpWithEmail(email, password);
    if (error) {
      throw new UnauthorizedException(error.message);
    }
    const externalAuthId = data.user?.id ?? '';

    const userData: Partial<User> = {
      ...payload,
      externalAuthId,
      rol: UserRole.provider,
      // map provider specific fields
      // bio and arrays belong to ServiceProvider entity
      // but repository.create handles inheritance by rol
      bio: about as any,
      dias: days?.split(',').map(s => s.trim()) as any,
      horarios: horarios?.split(',').map(s => s.trim()) as any,
      serviceType: serviceType as any,
    } as any;

    const createdUser = await this.authRepository.create(userData);
    const accessToken = await this.signJwt(createdUser);
    return { user: createdUser, accessToken };
  }

  async login(payload: LoginDto): Promise<{ user: User; accessToken: string }> {
    const { email, password } = payload;
    const { data, error } = await this.supabase.signInWithEmail(email, password);
    if (error) {
      throw new UnauthorizedException(error.message);
    }
    const user = await this.authRepository.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const accessToken = await this.signJwt(user);
    return { user, accessToken };
  }

  async signJwt(user: User): Promise<string> {
    const { userId, email, rol } = user;
    return this.jwtService.signAsync({ sub: userId, email, rol });
  }

  async upsertFromAuth0Profile(auth0User: any, forcedRole?: UserRole): Promise<{ user: User; accessToken: string }> {
    const externalAuthId: string = auth0User?.sub ?? '';
    const email: string = auth0User?.email ?? '';
    const name: string = auth0User?.name ?? auth0User?.nickname ?? '';
    const imgProfile: string | undefined = auth0User?.picture;

    if (!externalAuthId || !email) {
      throw new UnauthorizedException('Invalid OIDC profile');
    }

    const userData: Partial<User> = {
      email,
      name,
      imgProfile,
      rol: forcedRole,
    };

    const user = await this.authRepository.upsertByExternalAuthId(externalAuthId, userData);
    const accessToken = await this.signJwt(user);
    return { user, accessToken };
  }

  async me(userId: string): Promise<User | null> {
    return this.authRepository.findById(userId);
  }

  async uploadAvatar(userId: string, file: any): Promise<{ user: User; imgProfile: string }> {
    if (!file || !file.buffer || !file.originalname) {
      throw new UnauthorizedException('Invalid file');
    }
    const imgUrl = await this.supabase.uploadUserImage(userId, file.buffer, file.originalname);
    const user = await this.authRepository.update(userId, { imgProfile: imgUrl }) as User;
    return { user, imgProfile: imgUrl };
  }
}


