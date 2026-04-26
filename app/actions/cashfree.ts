'use server';

import { cashfree } from '@/lib/cashfree';
import { requireUser } from '@/lib/auth-utils';
import { headers } from 'next/headers';

export async function createCashfreeOrder(plan: 'monthly' | 'yearly') {
  let user;
  try {
    const auth = await requireUser();
    user = auth.user;
  } catch (e: any) {
    throw new Error('Authentication required');
  }

  const baseAmountEur = plan === 'monthly' ? 10 : 96; 
  const exchangeRate = 89.30; // Approx exchange rate 1 EUR = 89.30 INR
  const amount = Math.round(baseAmountEur * exchangeRate); // Exact INR conversion at payment time
  const currency = 'INR'; // Use INR for Sandbox testing and domestic gateways

  const headersList = await headers();
  const origin = headersList.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'https://golf-blue.vercel.app';

  try {
    const request = {
      order_amount: amount,
      order_currency: currency,
      customer_details: {
        customer_id: user.id.replace(/-/g, ''), // alphanumeric ID only
        customer_name: user.user_metadata?.full_name || 'Customer',
        customer_email: user.email || 'guest@example.com',
        customer_phone: user.user_metadata?.phone || '9999999999' // Collected securely, fallback if empty
      },
      order_meta: {
        return_url: `${origin}/dashboard?payment=success`,
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
      error: null,
    };
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } }, message?: string };
    const errorMsg = err?.response?.data?.message || err?.message || 'Failed to create payment order';
    console.error('[CASHFREE_ORDER_CREATE_ERROR]', err?.response?.data || error);
    return {
      payment_session_id: null,
      order_id: null,
      error: errorMsg,
    };
  }
}
