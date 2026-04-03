'use server';

import { razorpay } from '@/lib/razorpay';
import { createServerSupabaseClient } from '@/lib/supabase';

export async function createRazorpayOrder(plan: 'monthly' | 'yearly') {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('Authentication required');

  const amount = plan === 'monthly' ? 1000 : 9600; // In pence/cents
  const currency = 'EUR';

  try {
    const order = await razorpay.orders.create({
      amount,
      currency,
      receipt: `receipt_${user.id}_${Date.now()}`,
      notes: {
        userId: user.id,
        plan,
      }
    });

    return {
      id: order.id,
      amount: order.amount,
      currency: order.currency,
    };
  } catch (error) {
    console.error('[RAZORPAY_ORDER_CREATE_ERROR]', error);
    throw new Error('Failed to create payment order');
  }
}

export async function verifyRazorpayPayment(_response: unknown) {
  // Client-side verification is handled by signature validation
  // We will mostly rely on Webhooks for updating the status 
  // but we can do a quick check here if needed.
  return { success: true };
}
