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
    private readonly repo: Repository<Categories>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const entity = this.repo.create({
      Name: createCategoryDto.name,
      isActive: createCategoryDto.isActive ?? true,
    });
    return await this.repo.save(entity);
  }

  async createMany(payload: CreateCategoryDto[]) {
    const entities = payload.map((c) =>
      this.repo.create({ Name: c.name, isActive: c.isActive ?? true }),
    );
    return await this.repo.save(entities);
  }

  findAll() {
    return this.repo.find();
  }

  findOne(id: string) {
    return this.repo.findOne({ where: { CategoryID: id } });
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    await this.repo.update(
      { CategoryID: id },
      {
        Name: (updateCategoryDto as any).name,
        isActive: (updateCategoryDto as any).isActive,
      },
    );
    return this.findOne(id);
  }

  async remove(id: string) {
    await this.repo.delete({ CategoryID: id });
    return { deleted: true };
  }
}
