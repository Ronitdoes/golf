'use client';

import { useState } from 'react';
import { createCashfreeOrder } from '@/app/actions/cashfree';
import { useRouter } from 'next/navigation';
import { User } from '@supabase/supabase-js';
import { load } from '@cashfreepayments/cashfree-js';

export default function CashfreeCheckout({ 
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
      const order = await createCashfreeOrder(plan);

      const cashfree = await load({
        mode: process.env.NEXT_PUBLIC_CASHFREE_ENVIRONMENT === 'PRODUCTION' ? 'production' : 'sandbox'
      });

      const checkoutOptions = {
        paymentSessionId: order.payment_session_id,
        redirectTarget: "_self",
      };
      
      cashfree.checkout(checkoutOptions);

    } catch (error: unknown) {
      console.error('[CASHFREE_CHECKOUT_ERROR]', error);
      const msg = error instanceof Error ? error.message : 'Internal boundary fault';
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
            Processing...
         </div>
      ) : buttonText}
    </button>
  );
}
