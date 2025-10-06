import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { User } from './entities/user.entity';
import { AuthRepository } from './auth-repository';
import { SupabaseService } from './supabase/supabase.service';

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
}


