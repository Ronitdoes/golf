import { createClient } from '@supabase/supabase-js';
import { sendSubscriptionRenewalEmail } from '@/emails/subscription-renewal';
import { NextResponse } from 'next/server';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  // Target profiles whose renewal date falls within the next 3 days
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + 3);
  const dateString = targetDate.toISOString().split('T')[0];

  const { data: expProfiles } = await supabaseAdmin
    .from('profiles')
    .select('full_name, email, subscription_renewal_date, subscription_plan')
    .eq('subscription_status', 'active')
    .gte('subscription_renewal_date', `${dateString}T00:00:00Z`)
    .lt('subscription_renewal_date', `${dateString}T23:59:59Z`);

  if (!expProfiles) return NextResponse.json({ success: true, count: 0 });

  let sentCount = 0;
  for (const profile of expProfiles) {
    const amount = profile.subscription_plan === 'monthly' ? 10 : 100;
    const date = new Date(profile.subscription_renewal_date).toLocaleDateString();
    await sendSubscriptionRenewalEmail(profile.email, profile.full_name, date, amount);
    sentCount++;
  }

  return NextResponse.json({ success: true, count: sentCount });
}
