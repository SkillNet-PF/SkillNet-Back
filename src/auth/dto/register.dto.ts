import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator';
import { UserRole } from '../../common/enums/user-role.enum';

// DTO BASE para campos comunes
export abstract class RegisterDto {
  @IsOptional()
  @IsUUID()
  userId?: string;

  @IsOptional()
  @IsString()
  imgProfile?: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  birthDate!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password!: string;

  @IsString()
  confirmPassword!: string;

  @IsString()
  @IsNotEmpty()
  address!: string;

  @IsString()
  @IsNotEmpty()
  phone!: string;

  @IsEnum(UserRole)
  @IsIn(['client', 'provider'])
  rol!: UserRole;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
