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
import { ClientRegisterDto } from './dto/client-register.dto';

@Controller('clients')
export class PublicClientsController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async registerClient(
    @Body() dto: ClientRegisterDto & { confirmPassword?: string },
  ) {
    if (dto.confirmPassword && dto.password !== dto.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }
    // Force client role regardless of what comes from frontend
    const payload: RegisterDto = {
      name: dto.name,
      email: dto.email,
      password: dto.password,
      confirmPassword: dto.confirmPassword || dto.password,
      address: 'No especificada',
      phone: 'No especificado',
      birthDate: dto.birthDate,
      rol: UserRole.client,
    } as RegisterDto;
    return this.authService.registerClient(payload as any);
  }
}
