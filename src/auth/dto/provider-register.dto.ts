import { OmitType } from '@nestjs/mapped-types';
import { IsString } from 'class-validator';
import { RegisterDto } from './register.dto';

export class ProviderRegisterDto extends OmitType(RegisterDto, ['rol'] as const) {
  @IsString()
  serviceType: string;

  @IsString()
  about: string;

  @IsString()
  days: string; // CSV e.g. "lunes,martes"

  @IsString()
  horarios: string; // CSV e.g. "09:00,14:00"
}


