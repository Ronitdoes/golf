import { createServerSupabaseClient } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';
import Image from 'next/image';
import CharitySelector from '@/components/charities/CharitySelector';

export default async function CharityDashboardPage() {
  const supabase = createServerSupabaseClient();
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

  // Calculate strict contribution sum natively
  const { data: logs } = await supabase
    .from('subscriptions_log')
    .select('amount')
    .eq('user_id', user!.id)
    .in('event_type', ['created', 'renewed']);
    
  const totalSubscribed = logs?.reduce((acc, curr) => acc + Number(curr.amount), 0) || 0;
  // Approximation of historical impact linearly
  const historicalImpact = totalSubscribed * ((profile?.charity_contribution_percentage || 10) / 100);

  // Server action to safely persist slider inputs
  async function updatePercentage(formData: FormData) {
     'use server';
     const percentage = Number(formData.get('percentage'));
     if (percentage >= 10 && percentage <= 100) {
        const supabaseServer = createServerSupabaseClient();
        const { data: { user } } = await supabaseServer.auth.getUser();
        await supabaseServer.from('profiles').update({ charity_contribution_percentage: percentage }).eq('id', user!.id);
        revalidatePath('/dashboard/charity');
     }
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">My Charity</h1>
        <p className="text-neutral-400">Manage your selected beneficiary and adjust your direct contribution impact securely.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        
        {/* Selected Charity Display */}
        <div className="md:col-span-2 bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden flex flex-col">
           {charity ? (
             <>
               <div className="h-40 bg-neutral-800 relative">
                 {charity.image_url ? (
                   <Image src={charity.image_url} alt={charity.name} fill className="object-cover opacity-80" />
                 ) : (
                   <div className="w-full h-full bg-gradient-to-tr from-green-900/50 to-neutral-800" />
                 )}
               </div>
               <div className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                     <div>
                       <h2 className="text-2xl font-bold text-white mb-1">{charity.name}</h2>
                       <a href={charity.website_url} target="_blank" rel="noreferrer" className="text-green-400 hover:underline text-sm truncate block max-w-sm">
                         Visit Official Website
                       </a>
                     </div>
                     <span className="bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-bold px-3 py-1 rounded-full">
                       Active Target
                     </span>
                  </div>
                  <p className="text-neutral-400 mb-6 flex-1">{charity.description}</p>
                  
                  {/* Action strictly hooked into the React Client Modal boundary logically securely wrapper */}
                  <CharitySelector triggerLabel="Switch Selected Charity Target" />
               </div>
             </>
           ) : (
             <div className="flex-1 flex flex-col items-center justify-center p-10 text-center">
                 <div className="w-16 h-16 bg-neutral-800 rounded-full flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                 </div>
                 <h2 className="text-xl font-bold text-white mb-2">No Charity Selected</h2>
                 <p className="text-neutral-400 mb-6">Select an active charity to safely route your subscription contributions.</p>
                 <button className="px-5 py-2.5 bg-green-500 hover:bg-green-400 text-neutral-950 font-bold rounded-lg transition-colors shadow-md">
                    Browse Charities
                 </button>
             </div>
           )}
        </div>

        {/* Contribution Logic Panel */}
        <div className="flex flex-col gap-6">
           <div className="bg-gradient-to-b from-green-500/10 to-neutral-900 border border-green-500/20 rounded-2xl p-6 shadow-sm">
              <h3 className="text-sm font-medium text-green-400 mb-2">Total Impact Estimate</h3>
              <div className="text-4xl font-bold text-white mb-1">
                 ${historicalImpact.toFixed(2)}
              </div>
              <p className="text-xs text-neutral-500">Approximation derived sequentially from processed subscriptions</p>
           </div>

           <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 flex-1 flex flex-col">
              <h3 className="text-lg font-bold text-white mb-1">Contribution Factor</h3>
              <p className="text-sm text-neutral-400 mb-8">Determine precisely how much of your subscription translates into verifiable donations (Minimum 10%).</p>
              
              <form action={updatePercentage} className="mt-auto">
                 <div className="flex justify-between items-end mb-4">
                    <span className="text-4xl font-bold text-white">{profile?.charity_contribution_percentage || 10}%</span>
                 </div>
                 
                 <div className="relative mb-6">
                    <label htmlFor="percentage" className="sr-only">Percentage Slider</label>
                    <input 
                      type="range" 
                      id="percentage" 
                      name="percentage"
                      min="10" 
                      max="100" 
                      step="5"
                      defaultValue={profile?.charity_contribution_percentage || 10}
                      className="w-full accent-green-500 cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-neutral-500 font-medium px-1 mt-2">
                       <span>10% (Min)</span>
                       <span>100% (Max)</span>
                    </div>
                 </div>

                 <button type="submit" className="w-full py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white font-medium rounded-lg transition-colors border border-neutral-700">
                    Update Allocation
                 </button>
              </form>
           </div>
        </div>

      </div>
    </div>
  );
}
