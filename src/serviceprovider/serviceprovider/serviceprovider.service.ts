import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateServiceproviderDto } from './dto/create-serviceprovider.dto';
import { UpdateServiceproviderDto } from './dto/update-serviceprovider.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ServiceProvider } from './entities/serviceprovider.entity';
import { Repository ,Like} from 'typeorm';
import { UserRole } from 'src/common/enums/user-role.enum';

@Injectable()
export class ServiceproviderService {

  constructor(@InjectRepository(ServiceProvider)
    private readonly serviceprovider:Repository<ServiceProvider>,
  ){}
async create(createServiceProviderDto: CreateServiceproviderDto) {
  
  const provider = this.serviceprovider.create({
    ...createServiceProviderDto,
    rol: UserRole.provider, 
    isActive: true,
  });

  return await this.serviceprovider.save(provider);
}



  async findAll() {
    return this.serviceprovider.find({ relations: ['category'] });
  }




  async findOne(id:string ) {
  const provider = await this.serviceprovider.findOne({
      where: { userId: id},
      relations:['category','schedule']
    });

    if (!provider) {
      throw new NotFoundException(`Service provider with ID ${id} not found`);
    }

    return provider;
  }
  


  async update(id: string, updateServiceproviderDto: UpdateServiceproviderDto) {
  const provider = await this.serviceprovider.findOne({ where: { userId: id } });

  if (!provider) {
    throw new NotFoundException(`El proveedor con id ${id} no existe`);
  }

  // Mapear categoryId -> relación ManyToOne 'category'
  const anyDto: any = updateServiceproviderDto as any;
  if (anyDto.categoryId) {
    provider.category = { CategoryID: anyDto.categoryId } as any;
    delete anyDto.categoryId;
  }

  Object.assign(provider, anyDto); 
  return await this.serviceprovider.save(provider);
}


async remove(id: string) {
  const provider = await this.serviceprovider.findOne({ where: { userId: id } });

  if (!provider) {
    throw new NotFoundException(`El proveedor con id ${id} no existe`);
  }

  return await this.serviceprovider.remove(provider);
}



  async search(name?: string, category?: string) {
    const where: any = {};

    if (name) {
      // Busca proveedores cuyo nombre contenga la palabra ingresada
      where.name = Like(`%${name}%`);
    }

    if (category) {
      // Busca proveedores cuya categoría coincida con la ingresada
      where.category = { name: Like(`%${category}%`) };
    }

    return this.serviceprovider.find({
      where,
      relations: ['category'], // trae categoría relacionada
    });
  }


  async filterProviders(
  name?: string,
  category?: string,
  day?: string,
) {
  const query = this.serviceprovider
    .createQueryBuilder('provider')
    .leftJoinAndSelect('provider.category', 'category')
    .leftJoinAndSelect('provider.schedule', 'schedule');

  // Filtrar por nombre
  if (name) {
    query.andWhere('provider.name ILIKE :name', { name: `%${name}%` });
  }

  // Filtrar por categoría
  if (category) {
    query.andWhere('category.name ILIKE :category', { category: `%${category}%` });
  }

  // Filtrar por día disponible
  if (day) {
    // Asumiendo que schedule.days es un string tipo "lunes,martes"
    query.andWhere('schedule.days ILIKE :day', { day: `%${day}%` });
  }

  return await query.getMany();
}
}
