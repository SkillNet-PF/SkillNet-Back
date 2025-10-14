import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ClientRegisterDto {
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

  // membership selected in frontend; optional here for future use
  @IsOptional()
  @IsString()
  membership?: string;
}


