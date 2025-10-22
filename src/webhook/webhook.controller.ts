// src/webhook/webhook.controller.ts
import { Controller, Post, Req, Headers } from '@nestjs/common';
import { stripe } from 'src/subscription/stripe.config';
import type { Request } from 'express';
import { SubscriptionService } from 'src/subscription/subscription.service';

@Controller('webhook')
export class WebhookController {
    constructor(private readonly subscriptionService: SubscriptionService) {} // 🔹 inyectar servicio

    @Post()
    async handleWebhook(@Req() req: Request, @Headers('stripe-signature') sig: string) {
        // 🔹 Obtenemos la clave del webhook desde las variables de entorno
        const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

        if (!endpointSecret) {
            throw new Error('❌ STRIPE_WEBHOOK_SECRET no está definido en las variables de entorno');
        }

        let event;

        try {
            // 🔹 Verificamos la firma del webhook
            event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
        } catch (err) {
            console.error('⚠️ Error verificando firma del webhook:', err.message);
            throw err;
        }

        // 🔹 Evento de pago completado
        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;

            // 🔹 Metadata actualizada para 3 planes: BASIC, STANDARD, PREMIUM
            const userId = session.metadata.userId;
            const plan = session.metadata.plan as 'BASIC' | 'STANDARD' | 'PREMIUM';

            console.log(`✅ Pago confirmado para usuario ${userId}, plan ${plan}`);

            // 🔹 Llamamos al servicio para activar la suscripción según el plan
            await this.subscriptionService.activateSubscription(userId, plan);
        }

        // 🔹 Retornamos respuesta a Stripe
        return { received: true };
    }
}
