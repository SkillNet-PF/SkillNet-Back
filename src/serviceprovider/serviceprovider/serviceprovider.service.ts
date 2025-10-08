import { Injectable } from '@nestjs/common';
import { CreateServiceproviderDto } from './dto/create-serviceprovider.dto';
import { UpdateServiceproviderDto } from './dto/update-serviceprovider.dto';

@Injectable()
export class ServiceproviderService {
  create(createServiceproviderDto: CreateServiceproviderDto) {
    return 'This action adds a new serviceprovider';
  }

  findAll() {
    return `This action returns all serviceprovider`;
  }

  findOne(id: number) {
    return `This action returns a #${id} serviceprovider`;
  }

  update(id: number, updateServiceproviderDto: UpdateServiceproviderDto) {
    return `This action updates a #${id} serviceprovider`;
  }

  remove(id: number) {
    return `This action removes a #${id} serviceprovider`;
  }
}
