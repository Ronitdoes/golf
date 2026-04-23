// Server component for displaying unified subscription mechanics with Razorpay integration
import { createServerSupabaseClient } from '@/lib/supabase';
import { redirect } from 'next/navigation';
import CashfreeCheckout from '@/components/payments/CashfreeCheckout';

export default async function SubscribePage() {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Route strictly relies upon authentication state
  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('subscription_status, subscription_plan')
    .eq('id', user.id)
    .single();

  const isActive = profile?.subscription_status === 'active';

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 flex flex-col items-center bg-[#060606]">
      <div className="max-w-4xl w-full text-center mb-16">
        <h2 className="text-green-500 font-black uppercase tracking-[0.3em] text-sm mb-4">The Membership</h2>
        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-4 leading-none">Choose Your Plan</h1>
        <p className="text-white/30 text-lg font-bold">Support your chosen charity, track your scores, and win monthly prizes.</p>
      </div>

      {isActive ? (
        <div className="bg-white/[0.01] border border-green-500/30 w-full max-w-lg rounded-[2.5rem] p-12 text-center text-white mb-24 shadow-2xl backdrop-blur-3xl overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-[60px] pointer-events-none" />
          <h2 className="text-2xl font-black mb-2 capitalize tracking-tight">
            Active {profile?.subscription_plan} plan
          </h2>
          <p className="text-white/30 font-bold mb-8">
            Thank you for being a subscriber. High-fidelity verification protocols are active on your account.
          </p>
          <div className="px-8 py-3 bg-white/5 inline-block rounded-xl text-[10px] font-black uppercase tracking-widest text-green-500 border border-green-500/20">
             Verified Subscriber
          </div>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-8 w-full max-w-5xl">
          {/* Monthly Card */}
          <div className="flex-1 bg-white/[0.01] border border-white/5 hover:border-white/10 transition-all rounded-[3rem] p-12 flex flex-col items-center shadow-2xl backdrop-blur-3xl group h-full">
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 mb-8 self-start">Access Protocol</h2>
            <div className="text-center space-y-2 mb-10">
               <h3 className="text-2xl font-black text-white tracking-tight">Monthly</h3>
               <div className="text-5xl font-black text-white tracking-tighter">
                 €10<span className="text-base text-white/20 font-bold ml-2 tracking-normal">/MO</span>
               </div>
            </div>
            
            <ul className="text-white/40 space-y-5 w-full mb-12 flex-1 font-bold text-sm">
              <li className="flex items-center gap-3">
                 <div className="w-5 h-5 bg-white/5 rounded-full flex items-center justify-center border border-white/10 shrink-0">
                    <svg className="w-3 h-3 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" /></svg>
                 </div>
                 Full platform access
              </li>
              <li className="flex items-center gap-3">
                 <div className="w-5 h-5 bg-white/5 rounded-full flex items-center justify-center border border-white/10 shrink-0">
                    <svg className="w-3 h-3 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" /></svg>
                 </div>
                 Charity contributions
              </li>
              <li className="flex items-center gap-3">
                 <div className="w-5 h-5 bg-white/5 rounded-full flex items-center justify-center border border-white/10 shrink-0">
                    <svg className="w-3 h-3 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" /></svg>
                 </div>
                 Prize pool eligibility
              </li>
            </ul>

            <CashfreeCheckout 
               plan="monthly" 
               user={user}
               buttonText="Subscribe Monthly"
               className="w-full py-5 bg-white text-neutral-950 font-black rounded-2xl transition-all shadow-xl hover:scale-[1.03] active:scale-95"
            />
          </div>

          {/* Yearly Card */}
          <div className="flex-1 bg-white/[0.01] border border-green-500/20 hover:border-green-500/40 rounded-[3rem] p-12 flex flex-col items-center relative overflow-hidden transition-all shadow-[0_30px_60px_-15px_rgba(34,197,94,0.1)] backdrop-blur-3xl group">
            <div className="absolute top-8 right-8 bg-green-500 text-neutral-950 text-[10px] font-black px-4 py-1.5 rounded-full shadow-lg z-20 uppercase tracking-tighter">
              Save 36%
            </div>
            
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-green-500/60 mb-8 self-start">Optimal Alignment</h2>
            
            <div className="text-center space-y-2 mb-10">
               <h3 className="text-2xl font-black text-white px-8 tracking-tight">Yearly</h3>
               <div className="flex flex-col items-center">
                 <span className="text-white/20 text-xl font-bold line-through mb-1">€150</span>
                 <div className="text-6xl font-black text-white tracking-tighter">
                   €96<span className="text-base text-white/20 font-bold ml-2 tracking-normal">/YR</span>
                 </div>
               </div>
            </div>

            <ul className="text-white/60 space-y-5 w-full mb-12 flex-1 font-bold text-sm">
              <li className="flex items-center gap-3">
                 <div className="w-5 h-5 bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/20 shrink-0">
                    <svg className="w-3 h-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" /></svg>
                 </div>
                 All platform features
              </li>
              <li className="flex items-center gap-3 text-green-400">
                 <div className="w-5 h-5 bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/20 shrink-0">
                    <svg className="w-3 h-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" /></svg>
                 </div>
                 Priority charity routing
              </li>
              <li className="flex items-center gap-3 text-green-400">
                 <div className="w-5 h-5 bg-green-500/20 rounded-full flex items-center justify-center border border-green-500/30 shrink-0">
                    <svg className="w-3 h-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" /></svg>
                 </div>
                 Get 2 months free
              </li>
            </ul>

            <CashfreeCheckout 
               plan="yearly" 
               user={user}
               buttonText="Subscribe Yearly"
               className="w-full py-5 bg-green-500 text-neutral-950 font-black rounded-2xl transition-all shadow-[0_20px_40px_-5px_rgba(34,197,94,0.3)] hover:shadow-[0_20px_50px_-5px_rgba(34,197,94,0.5)] hover:scale-[1.03] active:scale-95"
            />
          </div>
        </div>
      )}
    </div>
  );
}
