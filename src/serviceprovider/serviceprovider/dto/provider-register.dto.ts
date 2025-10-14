import { IsOptional, IsString } from 'class-validator';
import { RegisterDto } from '../../../auth/dto/register.dto';

export class ProviderRegisterDto extends RegisterDto {
  
  @IsString()
  serviceType: string;

  @IsString()
  about: string;

  @IsString()
  days: string;

  @IsString()
  horarios: string;
}


