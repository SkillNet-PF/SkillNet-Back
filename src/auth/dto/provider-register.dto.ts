import { IsString } from 'class-validator';
import { RegisterDto } from './register.dto';
import { UserRole } from '../../common/enums/user-role.enum';

export class ProviderRegisterDto extends RegisterDto {
  // Forzar el rol como provider (comentado para evitar conflicto de tipos)
  // rol: UserRole.provider = UserRole.provider;

  @IsString()
  serviceType: string;

  @IsString()
  about: string;

  @IsString()
  days: string; // CSV e.g. "lunes,martes"

  @IsString()
  horarios: string; // CSV e.g. "09:00,14:00"
}