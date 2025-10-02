import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ServiceproviderService } from './serviceprovider.service';
import { CreateServiceproviderDto } from './dto/create-serviceprovider.dto';
import { UpdateServiceproviderDto } from './dto/update-serviceprovider.dto';

@Controller('serviceprovider')
export class ServiceproviderController {
  constructor(private readonly serviceproviderService: ServiceproviderService) {}

  @Post()
  create(@Body() createServiceproviderDto: CreateServiceproviderDto) {
    return this.serviceproviderService.create(createServiceproviderDto);
  }

  @Get()
  findAll() {
    return this.serviceproviderService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.serviceproviderService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateServiceproviderDto: UpdateServiceproviderDto) {
    return this.serviceproviderService.update(+id, updateServiceproviderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.serviceproviderService.remove(+id);
  }
}
