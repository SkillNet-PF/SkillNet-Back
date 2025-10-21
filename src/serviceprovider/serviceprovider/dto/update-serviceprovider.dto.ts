import { PartialType } from '@nestjs/mapped-types';
import { CreateServiceproviderDto } from './create-serviceprovider.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateServiceproviderDto extends PartialType(CreateServiceproviderDto) {
  @IsOptional()
  @IsString()
  categoryId?: string;
}
