import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { ServiceproviderService } from './serviceprovider.service';
import { CreateServiceproviderDto } from './dto/create-serviceprovider.dto';
import { UpdateServiceproviderDto } from './dto/update-serviceprovider.dto';

@Controller('serviceproviders')
export class ServiceproviderController {
  constructor(
    private readonly serviceproviderService:ServiceproviderService) {}

  @Post()
  create(@Body() dto: CreateServiceproviderDto) {
    return this.serviceproviderService.create(dto);
  }

  @Get()
  findAll() {
    return this.serviceproviderService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.serviceproviderService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateServiceproviderDto) {
    return this.serviceproviderService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.serviceproviderService.remove(id);
  }
}
