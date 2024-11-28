"use client";


import Pricing from '@/app/components/ui/Pricing/Pricing';
import { api } from "@/utils/api";
import { createClient } from '@/app/utils/supabase/server';
import {
  getProducts,
  getSubscription,
  getUser
} from '@/app/utils/supabase/queries';

export default async function PricingPage() {
  const supabase = createClient();
  const [user, products, subscription] = await Promise.all([
    getUser(supabase),
    getProducts(supabase),
    getSubscription(supabase)
  ]);
  const { data } = api.user.getName.useQuery();



  return (

    <Pricing
      user={user}
      products={products ?? []}
      subscription={subscription}
    />
  );
}
