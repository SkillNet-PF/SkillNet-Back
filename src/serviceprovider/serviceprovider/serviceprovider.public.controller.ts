import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { RegisterDto } from 'src/auth/dto/register.dto';
import { UserRole } from 'src/common/enums/user-role.enum';
import { ProviderRegisterDto } from './dto/provider-register.dto';

@Controller('serviceprovider')
export class PublicServiceProviderController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async registerProvider(
    @Body() dto: ProviderRegisterDto & { confirmPassword?: string },
  ) {
    if (dto.confirmPassword && dto.password !== dto.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }
    // Force provider role regardless of what comes from frontend
    const payload: RegisterDto = {
      name: dto.name,
      email: dto.email,
      password: dto.password,
      confirmPassword: dto.confirmPassword || dto.password,
      address: 'No especificada',
      phone: 'No especificado',
      birthDate: dto.birthDate,
      rol: UserRole.provider,
    } as RegisterDto;
    return this.authService.registerProvider(payload as any);
  }
}
