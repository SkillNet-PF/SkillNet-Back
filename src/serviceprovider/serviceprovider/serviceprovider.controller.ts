import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { ServiceproviderService } from './serviceprovider.service';
import { CreateServiceproviderDto } from './dto/create-serviceprovider.dto';
import { UpdateServiceproviderDto } from './dto/update-serviceprovider.dto';
import { Query } from '@nestjs/common';

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
    return this.serviceproviderService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateServiceproviderDto: UpdateServiceproviderDto,
  ) {
    return this.serviceproviderService.update(id, updateServiceproviderDto);
  }

  @Delete(':id')// solo admin 
  remove(@Param('id') id: string) {
    return this.serviceproviderService.remove(id);
  }
//GET /serviceproviders/search?name=Juan&category=Peluqueria (forma de poner para probar )
  @Get('search')
search(
  @Query('name') name?: string,
  @Query('category') category?: string,
) {
  return this.serviceproviderService.search(name, category);
}
}
