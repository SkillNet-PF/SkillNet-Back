import { IsString, IsUUID, IsOptional, IsArray } from 'class-validator';

export class CreateServiceproviderDto {
  @IsUUID()
  userId: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsUUID()
  categoryId: string;

  @IsOptional()
  @IsArray()
  dias?: string[];

  @IsOptional()
  @IsArray()
  horarios?: string[];

  @IsOptional()
  @IsArray()
  appointments?: string[];
}
export class CreateServiceproviderDto {}
