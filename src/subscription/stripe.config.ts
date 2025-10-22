// src/subscription/stripe.config.ts
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

const configService = new ConfigService();
const stripeSecretKey = configService.get<string>('STRIPE_SECRET_KEY');

if (!stripeSecretKey) {
    throw new Error('❌ STRIPE_SECRET_KEY is not defined in .env');
}

export const stripe = new Stripe(stripeSecretKey, {
    apiVersion:'2025-09-30.clover', 
});
