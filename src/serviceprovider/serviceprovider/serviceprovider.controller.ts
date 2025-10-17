import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { ServiceproviderService } from './serviceprovider.service';
import { CreateServiceproviderDto } from './dto/create-serviceprovider.dto';
import { UpdateServiceproviderDto } from './dto/update-serviceprovider.dto';
import { Query } from '@nestjs/common';
import { Roles } from 'src/auth/roles.decorator';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@Controller('serviceprovider')
export class ServiceproviderController {
  constructor(
    private readonly serviceproviderService: ServiceproviderService,
  ) {}

  // @Roles()
  // @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createServiceproviderDto: CreateServiceproviderDto) {
    return this.serviceproviderService.create(createServiceproviderDto);
  }

  // @Roles()
  // @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.serviceproviderService.findAll();
  }

  // @Roles()
  // @UseGuards(JwtAuthGuard)
  //GET /serviceproviders/search?name=Juan&category=Peluqueria (forma de poner para probar )
  @Get('search')
  search(@Query('name') name?: string, @Query('category') category?: string) {
    return this.serviceproviderService.search(name, category);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.serviceproviderService.findOne(id);
  }

  // @Roles()
  // @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateServiceproviderDto: UpdateServiceproviderDto,
  ) {
    return this.serviceproviderService.update(id, updateServiceproviderDto);
  }

  // @Roles(UserRole.admin)
  // @UseGuards(JwtAuthGuard)
  @Delete(':id') // solo admin
  remove(@Param('id') id: string) {
    return this.serviceproviderService.remove(id);
  }

  @Get('providers')
async getProviders(
  @Query('name') name?: string,
  @Query('category') category?: string,
  @Query('day') day?: string,
) {
  return this.serviceproviderService.filterProviders(name, category, day);
}
// como usar :
// /providers?name=Juan
// /providers?category=Peluqueria
// /providers?day=lunes
// /providers?name=Juan&category=Peluqueria&day=lunes


}
