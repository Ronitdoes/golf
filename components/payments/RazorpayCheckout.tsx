'use client';

import { useState } from 'react';
import { createRazorpayOrder } from '@/app/actions/razorpay';
import { useRouter } from 'next/navigation';
import { User } from '@supabase/supabase-js';

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayOptions {
  key: string;
  amount: string | number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill: { name: string; email: string };
  theme: { color: string };
  handler: (response: RazorpayResponse) => void;
  modal: { ondismiss: () => void };
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => { open: () => void };
  }
}

export default function RazorpayCheckout({ 
  plan, 
  user,
  buttonText,
  className
}: { 
  plan: 'monthly' | 'yearly', 
  user: User | null,
  buttonText: string,
  className?: string
}) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handlePayment = async () => {
    setIsLoading(true);
    try {
      const order = await createRazorpayOrder(plan);

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_SYn93dWkI1TQo5',
        amount: order.amount,
        currency: order.currency,
        name: 'DigitalHero',
        description: `${plan === 'monthly' ? 'Monthly' : 'Yearly'} Membership`,
        order_id: order.id,
        prefill: {
          name: user?.user_metadata?.full_name || '',
          email: user?.email || '',
        },
        theme: {
          color: '#22c55e',
        },
        handler: async function (response: RazorpayResponse) {
          // Send to verification route if needed, but we rely on Webhooks for reliability
          console.log('[RAZORPAY_PAYMENT_SUCCESS]', response);
          router.push('/dashboard?payment=success');
        },
        modal: {
          ondismiss: function () {
            setIsLoading(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error: unknown) {
      console.error('[RAZORPAY_CHECKOUT_ERROR]', error);
      const msg = error instanceof Error ? error.message : 'Internal security boundary fault';
      alert(`Payment Initiation Error: ${msg}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={isLoading}
      className={className}
    >
      {isLoading ? (
         <div className="flex items-center gap-2">
            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
            Encrypting...
         </div>
      ) : buttonText}
    </button>
  );
}
