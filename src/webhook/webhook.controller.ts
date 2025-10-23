import { Controller, Post, Req, Headers, Res } from '@nestjs/common';
import { stripe } from 'src/subscription/stripe.config';
import type { Request, Response } from 'express';
import { SubscriptionService } from 'src/subscription/subscription.service';

@Controller('webhook')
export class WebhookController {
    constructor(private readonly subscriptionService: SubscriptionService) { }

    @Post()
    async handleWebhook(
        @Req() req: Request,
        @Res() res: Response,
        @Headers('stripe-signature') sig: string,
    ) {
        const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

        if (!endpointSecret) {
            console.error('❌ Falta STRIPE_WEBHOOK_SECRET en las variables de entorno');
            return res.status(500).send('Webhook secret no configurado');
        }

        let event;

        try {
            // ⚠️ Usa req.body como Buffer sin parsear
            event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
        } catch (err) {
            console.error('⚠️ Error verificando firma del webhook:', err.message);
            return res.status(400).send(`Webhook Error: ${err.message}`);
        }

        // ✅ Cuando el pago se confirma
        if (event.type === 'checkout.session.completed') {
            const session = event.data.object as any;

            const userId = session.metadata?.userId;
            const plan = session.metadata?.plan as 'BASIC' | 'STANDARD' | 'PREMIUM';

            console.log(`✅ Pago confirmado para usuario ${userId}, plan ${plan}`);

            if (userId && plan) {
                await this.subscriptionService.activateSubscription(userId, plan);
            }
        }

        return res.status(200).json({ received: true });

    }
}
