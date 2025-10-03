import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
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

  @Get()//trae todos los porvedores 
  findAll() {
    return this.serviceproviderService.findAll();
  }

  @Get(':id')//busca provedor por categoria 
  findOne(@Param('id') id: string) {
    return this.serviceproviderService.findOne(+id);
  }

  @Put(':id')//actualizar datos del perfil 
  update(@Param('id') id: string, @Body() updateServiceproviderDto: UpdateServiceproviderDto) {
    return this.serviceproviderService.update(+id, updateServiceproviderDto);
  }

  @Delete(':id')// solo admin 
  remove(@Param('id') id: string) {
    return this.serviceproviderService.remove(+id);
  }
}
