'use server';

import { cashfree } from '@/lib/cashfree';
import { createServerSupabaseClient } from '@/lib/supabase';

export async function createCashfreeOrder(plan: 'monthly' | 'yearly') {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('Authentication required');

  const amount = plan === 'monthly' ? 10 : 96; // Adjust amount based on plan
  const currency = 'EUR';

  try {
    const request = {
      order_amount: amount,
      order_currency: currency,
      customer_details: {
        customer_id: user.id.replace(/-/g, ''), // alphanumeric ID only
        customer_name: user.user_metadata?.full_name || 'Customer',
        customer_email: user.email || 'guest@example.com',
        customer_phone: '9999999999' // Required by Cashfree, could be collected from user
      },
      order_meta: {
        return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?payment=success`,
      },
      order_tags: {
        userId: user.id,
        plan: plan,
      }
    };

    const response = await cashfree.PGCreateOrder(request);
    
    return {
      payment_session_id: response.data.payment_session_id,
      order_id: response.data.order_id,
    };
  } catch (error) {
    console.error('[CASHFREE_ORDER_CREATE_ERROR]', error);
    throw new Error('Failed to create payment order');
  }
}
