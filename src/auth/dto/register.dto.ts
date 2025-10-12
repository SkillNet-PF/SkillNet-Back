import { IsEmail, IsEnum, IsIn, IsNotEmpty, IsOptional, IsString, IsUUID, MinLength, IsEmpty, IsBoolean } from 'class-validator'
import { UserRole } from '../../common/enums/user-role.enum';

export class RegisterDto {
  @IsOptional()
  @IsUUID()
  userId?: string;

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
  @MinLength(6)
  password!: string;

  @IsString()
  confirmPassword!: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsEnum(UserRole)
  @IsIn(['client', 'provider'])
  rol!: UserRole;

  @IsEmpty() //Esto hace que isActive se establezca automáticamente como true en el backend
  @IsBoolean()
  isActive: boolean;
}



