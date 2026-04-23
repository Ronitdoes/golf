'use client';

import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import Link from 'next/link';
import CashfreeCheckout from '@/components/payments/CashfreeCheckout';
import { User } from '@supabase/supabase-js';

const features = [
  'Monthly prize draw entry',
  'Charity contribution',
  'Score tracking dashboard',
  'Winner verification system',
];

const plans = [
  {
    name: 'Monthly',
    price: '€10',
    interval: 'month',
    saving: null,
    href: '/signup?plan=monthly',
  },
  {
    name: 'Yearly',
    price: '€96',
    oldPrice: '€150',
    interval: 'year',
    saving: 'Save 36%',
    href: '/signup?plan=yearly',
  },
];

export default function SubscribeCTA({ user }: { user?: User | null }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="membership" className="relative min-h-screen w-full flex flex-col items-center justify-center px-6 overflow-hidden">
      <div className="relative z-10 max-w-5xl w-full text-center space-y-16">
        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <h2 className="text-green-500 font-black uppercase tracking-[0.3em] text-sm mb-4">Final Step</h2>
          <h1 className="text-4xl md:text-7xl font-black text-white leading-none tracking-tighter">
            Ready to <br />
            <span className="text-neutral-500">play your part?</span>
          </h1>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, x: shouldReduceMotion ? 0 : (i === 0 ? -50 : 50) }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className={`relative group bg-neutral-900/40 p-10 md:p-14 rounded-[2.5rem] md:rounded-[3.5rem] border border-white/5 backdrop-blur-md flex flex-col items-center text-center space-y-10 transition-all hover:bg-neutral-900/60 h-full ${plan.saving ? 'ring-2 ring-green-500/30' : ''}`}
            >
              {plan.saving && (
                <div className="absolute top-8 right-8 bg-green-500 text-neutral-950 font-black text-[10px] md:text-xs px-4 py-1.5 rounded-full uppercase tracking-tighter shadow-lg z-20">
                  {plan.saving}
                </div>
              )}
              
              <div className="space-y-1">
                <h3 className="text-2xl font-black text-white tracking-tight">{plan.name} Plan</h3>
                <div className="flex flex-col items-center justify-center">
                  {plan.oldPrice && (
                    <span className="text-white/20 text-lg font-bold line-through ml-[-30px]">{plan.oldPrice}</span>
                  )}
                  <div className="flex items-end justify-center gap-1.5 mt-[-5px]">
                    <span className="text-5xl md:text-6xl font-black text-white tracking-tighter">{plan.price}</span>
                    <span className="text-neutral-500 text-sm font-bold mb-2 capitalize md:mb-3">/ {plan.interval}</span>
                  </div>
                </div>
              </div>

              {/* Features List with flex-grow to push button down */}
              <div className="flex justify-center w-full flex-1">
                <ul className="space-y-5 text-neutral-300 w-full max-w-[240px] md:max-w-[280px]">
                  {features.map((feature) => (
                    <li key={feature} className="flex items-center gap-4 text-sm md:text-base font-bold text-left">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center border border-green-500/20">
                        <svg className="w-3.5 h-3.5 text-green-500" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="tracking-tight leading-tight">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {user ? (
                <CashfreeCheckout 
                  plan={plan.name === 'Standard' ? 'monthly' : 'yearly'} 
                  user={user}
                  buttonText={`Subscribe ${plan.name} Now`}
                  className={`w-full py-5 md:py-6 rounded-2xl font-black text-base md:text-lg tracking-tight transition-all duration-300 hover:scale-[1.05] active:scale-95 flex items-center justify-center gap-3 mt-auto ${
                    plan.saving 
                    ? 'bg-green-500 text-neutral-950 shadow-[0_20px_40px_-10px_rgba(34,197,94,0.4)] hover:shadow-[0_20px_50px_-5px_rgba(34,197,94,0.6)]' 
                    : 'bg-white text-neutral-950'
                  }`}
                />
              ) : (
                <Link
                  href={plan.href}
                  className={`w-full py-5 md:py-6 rounded-2xl font-black text-base md:text-lg tracking-tight transition-all duration-300 hover:scale-[1.05] active:scale-95 flex items-center justify-center gap-3 mt-auto ${
                    plan.saving 
                    ? 'bg-green-500 text-neutral-950 shadow-[0_20px_40px_-10px_rgba(34,197,94,0.4)] hover:shadow-[0_20px_50px_-5px_rgba(34,197,94,0.6)]' 
                    : 'bg-white text-neutral-950'
                  }`}
                >
                  Join the Club
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              )}
            </motion.div>
          ))}
        </div>

        {/* Footer Link */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          viewport={{ once: true }}
          className="text-neutral-600 text-[10px] md:text-sm font-medium"
        >
          {user ? 'Logged in as ' + user.email : (
            <>Already a member? <Link href="/login" className="text-white hover:text-green-500 underline underline-offset-4 decoration-neutral-800 transition-colors">Sign in to your dashboard</Link></>
          )}
        </motion.p>
      </div>
    </section>
  );
}
