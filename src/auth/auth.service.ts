import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { User } from './entities/user.entity';
import { AuthRepository } from './auth-repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService, 
    private readonly authRepository: AuthRepository
  ) {}

  async register(payload: RegisterDto): Promise<{ user: User; accessToken: string }> {
    const user = Object.assign(new User(), payload);
    const createdUser = await this.authRepository.create(user);
    const accessToken = await this.signJwt(createdUser);
    return { user: createdUser, accessToken };
  }

  async login(payload: LoginDto): Promise<{ user: User; accessToken: string }> {
    const user = await this.authRepository.findByEmail(payload.email);
    if (!user || user.externalAuthId !== payload.externalAuthId) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const accessToken = await this.signJwt(user);
    return { user, accessToken };
  }

  async signJwt(user: User): Promise<string> {
    const { userId, email, rol } = user;
    return this.jwtService.signAsync({ sub: userId, email, rol });
  }
}


