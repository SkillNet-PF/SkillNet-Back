import { BadGatewayException, BadRequestException, Injectable } from '@nestjs/common';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { subscriptions } from './entities/subscription.entity';
import { Repository } from 'typeorm';
import { SUBSCRIPTION_PLANS } from './stripe.constants';
import { User } from 'src/auth/entities/user.entity';
import { MailService } from 'src/mail/mail.service';


@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(subscriptions)
    private readonly subscriptionsRepository: Repository<subscriptions>,
      @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly mailService: MailService,
  ) { }
  async create(createSubscriptionDto: CreateSubscriptionDto) {
    const { Name, Descption, monthlyServices, price } = createSubscriptionDto;

    if (!Name || !Descption || !monthlyServices || !price) throw new BadRequestException('All fields are required');


    if (!Number(monthlyServices) || !Number(price)) throw new BadRequestException('monthlyServices and price must be numbers');


    if (Number(monthlyServices) <= 0 || Number(price) <= 0) throw new BadRequestException('monthlyServices and price must be greater than 0');


    const existingSubscription = await this.subscriptionsRepository.findOne({ where: { Name } });

    if (existingSubscription) throw new BadRequestException('subscription already exists');

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
    const subscriptions = await this.subscriptionsRepository.find({ where: { isActive: true } });
    return subscriptions;
  }

  async findOne(id: string) {
    const subscription = await this.subscriptionsRepository.findOne({
      where: { SuscriptionID: id },
    });

    if (!subscription) throw new BadGatewayException('subscription not found');

    return subscription;
  }

  async update(id: string, updateSubscriptionDto: UpdateSubscriptionDto) {
    const subscription = await this.subscriptionsRepository.findOne({

    })
    if (!subscription) throw new BadGatewayException('subscription not found');

    const { Name, Descption, monthlyServices, price } = updateSubscriptionDto;

    if (Name && typeof Name !== 'string') throw new BadRequestException('Name must be a string');
    if (Descption && typeof Descption !== 'string') throw new BadRequestException('Descption must be a string');
    if (monthlyServices && typeof Number(monthlyServices) !== 'number') throw new BadRequestException('monthlyServices must be a number');
    if (price && typeof Number(price) !== 'number') throw new BadRequestException('price must be a number');

    if (Name) subscription.Name = Name;
    if (Descption) subscription.Descption = Descption;
    if (monthlyServices) subscription.monthlyServices = Number(monthlyServices);
    if (price) subscription.price = Number(price);

    await this.subscriptionsRepository.save(subscription);
    //faltan las validaciones de los datos mandados
    return subscription;
  }

  async remove(id: string) {
    const subscription = await this.subscriptionsRepository.findOne({ where: { SuscriptionID: id } });

    if (!subscription) throw new BadGatewayException('subscription not found');

    subscription.isActive = false;
    await this.subscriptionsRepository.save(subscription);
    return subscription;
  }

  async activateSubscription(userId: string, plan: 'BASIC' | 'STANDARD' | 'PREMIUM') {
    const planData = SUBSCRIPTION_PLANS[plan];

    if (!planData) {
      throw new BadRequestException('Invalid plan');
    }

    try {
      console.log(`💰 Activando suscripción para usuario ${userId} con plan ${plan}`);

      const user = await this.userRepository.findOne({ where: { userId } });
      if (!user) throw new BadGatewayException('User not found');

      const newSubscription = this.subscriptionsRepository.create({
        Name: planData.name,
        Descption: `Plan ${planData.name} activado desde Stripe`,
        monthlyServices: planData.monthlyServices,
        price: planData.price,
        isActive: true,
      });

        await this.subscriptionsRepository.save(newSubscription);
      console.log('✅ Suscripción guardada correctamente en la base de datos.');


    await this.mailService.sendSubscriptionConfirmation(
        user.email,                // 📧 correo del usuario
        user.name,                 // 👤 nombre del usuario
        planData.name,             // 🪪 nombre del plan
        planData.monthlyServices,  // 💼 cantidad de servicios
        planData.price,            // 💵 precio
      );


      

      console.log('✅ Suscripción registrada correctamente en la base de datos.y correo enviado correctamente.');
      return { message: 'Subscription activated successfully' };
    } catch (error) {
      console.error('❌ Error al activar suscripción:', error.message);
      throw new BadRequestException('Error al activar suscripción');
    }
  }
}

