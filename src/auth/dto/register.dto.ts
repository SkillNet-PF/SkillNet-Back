import { IsBoolean, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator'
import { UserRole } from '../../common/enums/user-role.enum';

export class RegisterDto {
  @IsUUID()
  userId!: string;

  @IsOptional()
  @IsString()
  imgProfile?: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsOptional()
  @IsString()
  birthDate?: string;

  @IsEmail()
  email!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsEnum(UserRole)
  rol!: UserRole;

  @IsOptional()
  @IsString()
  paymentMethod?: string | null;

  @IsOptional()
  @IsUUID()
  suscriptionId?: string;

  @IsOptional()
  @IsUUID()
  providerId?: string;

  @IsBoolean()
  isActive!: boolean;
}


