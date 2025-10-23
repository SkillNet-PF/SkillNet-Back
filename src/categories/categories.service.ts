import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Categories } from './entities/categories.entity';
import { User } from 'src/auth/entities/user.entity';
import { UserRole } from 'src/common/enums/user-role.enum';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Categories)
    private readonly categoriesRepository: Repository<Categories>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ){}
  async create(createCategoryDto: CreateCategoryDto, user) {
    const authUser = await this.userRepository.findOneBy({
      userId: user.userId
    })
    if(!authUser) throw new NotFoundException('User not found');
    if(authUser.rol !== UserRole.admin) throw new UnauthorizedException('You are not an admin');

    const existCategory = await this.categoriesRepository.findOne({
      where: { Name: createCategoryDto.name },
    });
    if (existCategory) {
      throw new Error('Category already exists');
    }
    
    const category = new Categories();
    category.Name = createCategoryDto.name;
    await this.categoriesRepository.save(category);
  }

  async createMany(payload: CreateCategoryDto[]) {
    const categories = payload.map(dto => {
      const category = new Categories();
      category.Name = dto.name;
      return category;
    });
    return await this.categoriesRepository.save(categories);
  }

  async findAll() {
    const categories = await this.categoriesRepository.find();
    return categories;
  }

  async findOne(id: string) {
   const category = await this.categoriesRepository.findOne({
     where: { CategoryID: id },
   });
  }

  async update(id: string, updateCategoryDto: CreateCategoryDto) {
    const category = await this.categoriesRepository.findOne({
      where: { CategoryID: id }});
      if(!category) throw new NotFoundException('Category not found');
      category.Name = updateCategoryDto.name;
      await this.categoriesRepository.save(category);
      return category;
  }


  async remove(id: string) {
    const category = await this.categoriesRepository.findOne({
      where: { CategoryID: id },
    });

    if (!category || category.isActive === false) throw new NotFoundException('Category not found');

    category.isActive = false;
    await this.categoriesRepository.save(category);
    return category;

  }
}
