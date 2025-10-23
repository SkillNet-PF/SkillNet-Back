import {
  IsString,
  IsOptional,
  IsEmail,
  IsArray,
  IsUUID,
} from 'class-validator';

export class CreateServiceproviderDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  externalAuthId?: string;

  @IsOptional()
  @IsString()
  bio?: string; // descripción

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  dias?: string[]; // ['lunes', 'martes']

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  horarios?: string[]; // ['09:00', '10:00', ...]

  @IsOptional()
  @IsUUID()
  categoryId?: string; // se mapeará a la relación category

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  phone?: string;
}
