import { Controller, Post } from '@nestjs/common';
import { InitialDataSeed } from './seeds.service';

@Controller('seeds')
export class SeedsController {
  constructor(private readonly seeds: InitialDataSeed) {}

  @Post('categories')
  async reseedCategories() {
    await this.seeds.reseedCategories();
    return { ok: true };
  }
}


