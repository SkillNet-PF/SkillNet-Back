
export const STRIPE_PRICE_IDS = {
    BASIC: 'price_basic_5000',      // 5 servicios mensuales, $5000
    STANDARD: 'price_standard_8000', // 10 servicios mensuales, $8000
    PREMIUM: 'price_premium_12000',  // 15 servicios mensuales, $12000
};

export const SUBSCRIPTION_PLANS = {
    BASIC: {
        name: 'Basic',
        monthlyServices: 5,
        price: 5000,
        stripePriceId: STRIPE_PRICE_IDS.BASIC,
    },
    STANDARD: {
        name: 'Standard',
        monthlyServices: 10,
        price: 8000,
        stripePriceId: STRIPE_PRICE_IDS.STANDARD,
    },
    PREMIUM: {
        name: 'Premium',
        monthlyServices: 15,
        price: 12000,
        stripePriceId: STRIPE_PRICE_IDS.PREMIUM,
    },
};