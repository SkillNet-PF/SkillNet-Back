import { Injectable } from '@nestjs/common';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { subscriptions } from './entities/subscription.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(subscriptions)
    private readonly subscriptionsRepository: Repository<subscriptions>,
  ){}
  async create(createSubscriptionDto: CreateSubscriptionDto) {
    const {Name, Descption, monthlyServices, price} = createSubscriptionDto;

    if (!Name || !Descption || !monthlyServices || !price) {
      throw new Error('All fields are required');
    }
    
    if (!Number(monthlyServices) || !Number(price)) {
      throw new Error('monthlyServices and price must be numbers');
    }

    const subscription = new subscriptions();
    subscription.Name = Name;
    subscription.Descption = Descption;
    subscription.monthlyServices = Number(monthlyServices);
    subscription.price = Number(price);
    subscription.isActive = true;
    
    await this.subscriptionsRepository.save(subscription);
    return subscription;
  }

  findAll() {
    return `This action returns all subscription`;
  }

  findOne(id: number) {
    return `This action returns a #${id} subscription`;
  }

  update(id: number, updateSubscriptionDto: UpdateSubscriptionDto) {
    return `This action updates a #${id} subscription`;
  }

  remove(id: number) {
    return `This action removes a #${id} subscription`;
  }
}
