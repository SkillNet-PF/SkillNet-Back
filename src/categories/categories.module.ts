// Categories module configuration
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { Categories } from './entities/categories.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Categories])],
  controllers: [CategoriesController],
  providers: [CategoriesService],
})
export class CategoriesModule {}
