import { BadGatewayException, BadRequestException, Injectable } from '@nestjs/common';
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

    if (!Name || !Descption || !monthlyServices || !price) throw new BadRequestException('All fields are required');
    

    if (!Number(monthlyServices) || !Number(price)) throw new BadRequestException('monthlyServices and price must be numbers');
    

    if (Number(monthlyServices) <= 0 || Number(price) <= 0) throw new BadRequestException('monthlyServices and price must be greater than 0');
  

    const existingSubscription = await this.subscriptionsRepository.findOne({ where: { Name } });

    if(existingSubscription) throw new BadRequestException('subscription already exists');

    const subscription = new subscriptions();
    subscription.Name = Name;
    subscription.Descption = Descption;
    subscription.monthlyServices = Number(monthlyServices);
    subscription.price = Number(price);
    subscription.isActive = true;
    
    await this.subscriptionsRepository.save(subscription);
    return subscription;
  }

  async findAll() {
    const subscriptions = await this.subscriptionsRepository.find({where:{isActive: true}});
    return subscriptions;
  }

  async findOne(id: string) {
    const subscription = await this.subscriptionsRepository.findOne({ 
      where: { SuscriptionID: id },
  });

  if (!subscription) throw new BadGatewayException('subscription not found');

  return subscription;}

  async update(id: string, updateSubscriptionDto: UpdateSubscriptionDto) {
    const subscription = await this.subscriptionsRepository.findOne({
      
    })
    if (!subscription) throw new BadGatewayException('subscription not found');

    const {Name, Descption, monthlyServices, price} = updateSubscriptionDto;

    if (Name) subscription.Name = Name;
    if (Descption) subscription.Descption = Descption;
    if (monthlyServices) subscription.monthlyServices = Number(monthlyServices);
    if (price) subscription.price = Number(price);

    await this.subscriptionsRepository.save(subscription);
    //faltan las validaciones de los datos mandados
    return subscription;
  }

  remove(id: string) {
    return `This action removes a #${id} subscription`;
  }
}
