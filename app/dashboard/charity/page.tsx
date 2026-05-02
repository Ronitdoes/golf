import { createServerSupabaseClient } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';
import Image from 'next/image';
import CharitySelector from '@/components/charities/CharitySelector';
import ContributionSlider from '@/components/charities/ContributionSlider';

export default async function CharityDashboardPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from('profiles')
    .select('selected_charity_id, charity_contribution_percentage')
    .eq('id', user!.id)
    .single();

  let charity = null;
  if (profile?.selected_charity_id) {
    const { data } = await supabase
      .from('charities')
      .select('*')
      .eq('id', profile.selected_charity_id)
      .single();
    charity = data;
  }

  // Calculate total amount donated to this specific charity across all draws
  let historicalImpact = 0;
  if (profile?.selected_charity_id) {
    // 1. Fetch Draw Contributions
    const { data: contributions } = await supabase
      .from('charity_draw_contributions')
      .select('amount')
      .eq('charity_id', profile.selected_charity_id);
      
    const drawTotal = contributions?.reduce((acc, curr) => acc + Number(curr.amount), 0) || 0;

    // 2. Fetch Active Subscriber Contributions (Contribution Factor Money)
    const { data: activeProfiles } = await supabase
      .from('profiles')
      .select('subscription_plan, charity_contribution_percentage')
      .eq('selected_charity_id', profile.selected_charity_id)
      .eq('subscription_status', 'active');

    const subscriptionTotal = activeProfiles?.reduce((acc, p) => {
      const planRevenue = p.subscription_plan === 'yearly' ? 8 : 10;
      const pct = (p.charity_contribution_percentage >= 10 ? p.charity_contribution_percentage : 10) / 100;
      return acc + (planRevenue * pct);
    }, 0) || 0;

    historicalImpact = drawTotal + subscriptionTotal;
  }

  // Server action to safely persist slider inputs
  async function updatePercentage(formData: FormData) {
     'use server';
     const percentage = Number(formData.get('percentage'));
     if (percentage >= 10 && percentage <= 100) {
        const supabaseServer = await createServerSupabaseClient();
        const { data: { user } } = await supabaseServer.auth.getUser();
        await supabaseServer.from('profiles').update({ charity_contribution_percentage: percentage }).eq('id', user!.id);
        revalidatePath('/dashboard/charity');
     }
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 ease-out max-w-5xl">
      <div className="space-y-2">
        <span className="text-[10px] font-black text-green-500 uppercase tracking-[0.4em] ml-1">Philanthropic Alignment</span>
        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter">Charity Intelligence</h1>
        <p className="text-white/30 font-bold text-base md:text-lg max-w-xl">Manage your selected beneficiary and adjust your direct contribution impact securely.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        
        {/* Selected Charity Display */}
        <div className="lg:col-span-2 bg-white/[0.01] border border-white/5 rounded-[2rem] overflow-hidden flex flex-col relative group">
           <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/[0.02] blur-[100px] pointer-events-none" />
           {charity ? (
             <>
               <div className="h-48 md:h-56 bg-neutral-900 relative overflow-hidden">
                 {charity.image_url ? (
                   <Image src={charity.image_url} alt={charity.name} fill className="object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000" />
                 ) : (
                   <div className="w-full h-full bg-gradient-to-tr from-green-900/40 to-neutral-800" />
                 )}
                 <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent" />
               </div>
               <div className="p-8 flex-1 flex flex-col relative z-10">
                  <div className="flex justify-between items-start mb-4">
                     <div className="space-y-1">
                       <h2 className="text-3xl md:text-4xl font-black text-white tracking-tighter leading-none">{charity.name}</h2>
                       <a href={charity.website_url} target="_blank" rel="noreferrer" className="text-green-500/60 font-black uppercase text-[10px] tracking-widest hover:text-green-400 block transition-colors">
                         Visit Secure Endpoint
                       </a>
                     </div>
                     <div className="bg-green-500/10 border border-green-500/20 text-green-500 text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-[0_0_15px_rgba(34,197,94,0.1)]">
                       Active Target
                     </div>
                  </div>
                  <p className="text-white/30 font-bold text-sm md:text-base mb-6 flex-1 leading-relaxed">{charity.description}</p>
                  
                  <div className="pt-6 border-t border-white/5">
                    <CharitySelector triggerLabel="Switch Selected Charity Target" />
                  </div>
               </div>
             </>
           ) : (
             <div className="flex-1 flex flex-col items-center justify-center p-12 lg:p-16 text-center space-y-6">
                  <div className="w-16 h-16 bg-white/5 rounded-[1.5rem] border border-white/10 flex items-center justify-center relative shadow-[0_0_20px_rgba(255,255,255,0.02)]">
                    <div className="absolute inset-0 bg-white/5 blur-xl rounded-full" />
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white/20 relative" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <div className="space-y-1">
                    <h2 className="text-2xl font-black text-white tracking-tighter">Null Beneficiary</h2>
                    <p className="text-white/20 font-bold max-w-xs mx-auto text-sm">Establish a secure charity routing to finalize your subscription contribution stream.</p>
                  </div>
                  <CharitySelector triggerLabel="Establish Connection" />
             </div>
           )}
        </div>

        {/* Contribution Logic Panel */}
        <div className="flex flex-col gap-6">
           <div className="bg-white/[0.01] border border-green-500/20 rounded-[2rem] p-8 flex flex-col justify-center relative overflow-hidden group shadow-[0_0_40px_rgba(16,185,129,0.02)]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/[0.05] blur-3xl rounded-full -mr-16 -mt-16" />
              <span className="text-[9px] font-black text-green-500 uppercase tracking-[0.4em] mb-2">Total Impact Yield</span>
              <div className="text-5xl font-black text-white tracking-tighter mb-1">
                 ${historicalImpact.toFixed(2)}
              </div>
              <p className="text-[9px] font-black text-white/30 uppercase tracking-widest">Donated to {charity?.name || 'Selected Charity'}</p>
           </div>

           <div className="bg-white/[0.01] border border-white/5 rounded-[2rem] p-8 flex-1 flex flex-col relative overflow-hidden group">
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/[0.02] blur-3xl rounded-full -ml-16 -mb-16" />
              
              <div className="space-y-1 mb-6">
                <h3 className="text-lg font-black text-white tracking-tighter">Contribution Factor</h3>
                <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest leading-relaxed">Determine how much of your subscription translates into verifiable donations.</p>
              </div>
              
              <ContributionSlider 
                initialValue={profile?.charity_contribution_percentage || 10} 
                updateAction={updatePercentage} 
              />
           </div>
        </div>

      </div>
    </div>
  );
}
