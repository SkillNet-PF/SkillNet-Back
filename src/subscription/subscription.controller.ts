import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Put } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { Roles } from 'src/auth/roles.decorator';
import { UserRole } from 'src/common/enums/user-role.enum';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { STRIPE_PRICE_IDS } from './stripe.constants';
import { stripe } from './stripe.config';

@Controller('subscription')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) { }

  @Roles(UserRole.admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  create(@Body() createSubscriptionDto: CreateSubscriptionDto) {
    return this.subscriptionService.create(createSubscriptionDto);
  }

  @Get()
  findAll() {
    return this.subscriptionService.findAll();
  }


  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subscriptionService.findOne(id);
  }

  @Roles(UserRole.admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() updateSubscriptionDto: UpdateSubscriptionDto) {
    return this.subscriptionService.update(id, updateSubscriptionDto);
  }

  @Roles(UserRole.admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subscriptionService.remove(id);
  }



  @Post('checkout')
  async createCheckout(@Body() body: { plan: 'BASIC' | 'STANDARD' | 'PREMIUM'; userId: string }) {
    
    // 🔹 Selección del priceId basado en el plan enviado
    let priceId: string;
    switch (body.plan) {
      case 'BASIC':
        priceId = STRIPE_PRICE_IDS.BASIC;
        break;
      case 'STANDARD':
        priceId = STRIPE_PRICE_IDS.STANDARD;
        break;
      case 'PREMIUM':
        priceId = STRIPE_PRICE_IDS.PREMIUM;
        break;
      default:
        throw new Error('Plan inválido'); 
    }

    // 🔹 Creación de la sesión de checkout con Stripe
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: 'http://localhost:3002/success',
      cancel_url: 'http://localhost:3002/cancel',
      metadata: { userId: body.userId, plan: body.plan }, // 🔹 se guarda metadata para usar en webhook
    });

    return { url: session.url }; // 🔹 se devuelve la URL del checkout
  }
}

// /subscription/checkout