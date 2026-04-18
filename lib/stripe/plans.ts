export type Plan = {
  name: string;
  description: string;
  priceMonthly: number;
  priceYearly: number;
  priceIdMonthly: string | undefined;
  priceIdYearly: string | undefined;
  features: string[];
  featured?: boolean;
};

export const PLANS: Plan[] = [
  {
    name: "Free",
    description: "Everything you need to try it out.",
    priceMonthly: 0,
    priceYearly: 0,
    priceIdMonthly: undefined,
    priceIdYearly: undefined,
    features: [
      "Up to 10 projects",
      "Community support",
      "Basic analytics",
    ],
  },
  {
    name: "Pro",
    description: "For builders shipping real products.",
    priceMonthly: 19,
    priceYearly: 190,
    priceIdMonthly: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_MONTHLY,
    priceIdYearly: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_YEARLY,
    features: [
      "Unlimited projects",
      "Priority email support",
      "Advanced analytics",
      "Custom domains",
    ],
    featured: true,
  },
];
