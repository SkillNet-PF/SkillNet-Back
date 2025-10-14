import { IsOptional, IsString, IsUUID } from 'class-validator';
import { RegisterDto } from './register.dto';
import { UserRole } from '../../common/enums/user-role.enum';

export class RegisterClientDto extends RegisterDto {
  // Forzar el rol como client
  //   rol: UserRole.client = UserRole.client;

  @IsString()
  paymentMethod!: string; // "tarjeta_credito", "paypal", "transferencia"

  @IsString()
  subscription!: string; // "basic", "standard", "premium"
}
