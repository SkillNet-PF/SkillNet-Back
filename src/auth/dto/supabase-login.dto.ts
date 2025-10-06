import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SupabaseLoginDto {
  @IsEmail()
  email!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;
}


