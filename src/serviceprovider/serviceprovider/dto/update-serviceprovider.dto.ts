import { PartialType } from '@nestjs/mapped-types';
import { CreateServiceproviderDto } from './create-serviceprovider.dto';

export class UpdateServiceproviderDto extends PartialType(CreateServiceproviderDto) {}
