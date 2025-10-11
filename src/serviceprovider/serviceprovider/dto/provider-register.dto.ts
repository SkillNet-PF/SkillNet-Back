import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ProviderRegisterDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;

  @IsOptional()
  @IsString()
  birthDate?: string;

  // provider specific
  @IsOptional()
  @IsString()
  serviceType?: string;

  @IsOptional()
  @IsString()
  about?: string;
}


