import { Module } from '@nestjs/common';
import { InitialDataSeed } from './seeds.service';
// import { SeedsController } from './seeds.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Categories } from 'src/categories/entities/categories.entity';
import { subscriptions } from 'src/subscription/entities/subscription.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Categories, subscriptions])],
  providers: [InitialDataSeed],
  exports: [InitialDataSeed],
})
export class SeedsModule {}
