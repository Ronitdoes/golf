import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createAdminSupabaseClient } from '@/lib/supabase';

export async function POST(req: Request) {
  const bodyText = await req.text();
  const signature = req.headers.get('x-webhook-signature');
  const timestamp = req.headers.get('x-webhook-timestamp');

  if (!signature || !timestamp) {
    return NextResponse.json({ error: 'Signature or timestamp missing' }, { status: 400 });
  }

  const webhookSecret = process.env.CASHFREE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error('[CASHFREE_WEBHOOK_ERROR] CASHFREE_WEBHOOK_SECRET missing');
    return NextResponse.json({ error: 'Configuration fault' }, { status: 500 });
  }

  // Construct message: timestamp + rawBody
  const message = timestamp + bodyText;

  // Generate HMAC SHA256 signature
  const expectedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(message)
    .digest('base64');

  const isValid = expectedSignature === signature;

  if (!isValid) {
    console.error('[CASHFREE_WEBHOOK_ERROR] Invalid signature');
    return NextResponse.json({ error: 'Signature mismatch' }, { status: 400 });
  }

  const body = JSON.parse(bodyText);
  const { type, data } = body;

  // Handle PAYMENT_SUCCESS_WEBHOOK
  if (type === 'PAYMENT_SUCCESS_WEBHOOK') {
    const payment = data.payment;
    const order = data.order;
    const tags = order?.order_tags;
    
    if (tags && tags.userId) {
      // Use Admin client to bypass RLS for server-to-server updates
      const supabase = createAdminSupabaseClient();
      
      const { error } = await supabase
        .from('profiles')
        .update({
          subscription_status: 'active',
          subscription_plan: tags.plan || 'monthly',
          updated_at: new Date().toISOString(),
        })
        .eq('id', tags.userId);

      if (error) {
        console.error('[CASHFREE_WEBHOOK_DB_ERROR]', error);
        return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
      }

      console.log(`[CASHFREE_WEBHOOK_SUCCESS] Updated user ${tags.userId} to ${tags.plan}`);
    }
  }

  return NextResponse.json({ status: 'ok' });
}
