import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Categories } from './entities/categories.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Categories)
    private readonly categoriesRepo: Repository<Categories>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const entity = this.categoriesRepo.create({
      Name: createCategoryDto.name,
    } as any);
    return await this.categoriesRepo.save(entity);
  }

  async findAll() {
    const rows = await this.categoriesRepo.find();
    return rows.map((c) => ({
      categoryId: c.CategoryID,
      name: c.Name,
      description: '',
    }));
  }

  async findOne(id: string) {
    const c = await this.categoriesRepo.findOne({ where: { CategoryID: id } });
    if (!c) return null;
    return { categoryId: c.CategoryID, name: c.Name, description: '' };
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    await this.categoriesRepo.update({ CategoryID: id }, { Name: updateCategoryDto.name } as any);
    return this.findOne(id);
  }

  async remove(id: string) {
    await this.categoriesRepo.delete({ CategoryID: id });
    return { ok: true };
  }
}
