import { getCharityById } from '@/app/actions/charities';
import { createClient } from '@supabase/supabase-js';
import { createServerSupabaseClient } from '@/lib/supabase';
import Link from 'next/link';
import Image from 'next/image';

interface CharityEvent {
  id: string;
  title: string;
  description: string;
  event_date: string;
  location: string;
}

// Dynamically generate static routes universally securely 
export async function generateStaticParams() {
  // Utilizing standard isolated client explicitly avoiding SSR cookie hydration dependencies natively required during static build iterations
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  
  const { data } = await supabaseAdmin.from('charities').select('id');
  return (data || []).map((charity) => ({ id: charity.id }));
}

export const revalidate = 3600; // Auto revalidation logically caching globally

export default async function CharityProfilePage({ params }: { params: Promise<{ id: string }> }) {
  // Extract strictly mapped ID efficiently preventing fault
  const { id } = await params;
  
  const { charity, events } = await getCharityById(id);

  if (!charity) {
    return (
      <div className="min-h-screen py-32 flex flex-col items-center justify-center text-white">
         <h1 className="text-3xl font-bold mb-2">Charity Isolated Fault</h1>
         <p className="text-neutral-500">Record completely unmapped structurally.</p>
         <Link href="/charities" className="mt-6 text-green-500 hover:underline">Route backwards</Link>
      </div>
    );
  }

  // Gracefully determine authentications resolving conditional components independently structurally 
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen pb-24 bg-neutral-950">
      
      {/* Dynamic Hero Layout intersecting visual identifiers cleanly natively */}
      <div className="relative h-[400px] w-full bg-neutral-900 border-b border-neutral-800">
         {charity.image_url ? (
            <Image 
              src={charity.image_url} 
              alt={charity.name} 
              fill 
              className="object-cover opacity-50" 
              unoptimized
            />
         ) : (
            <div className="w-full h-full bg-gradient-to-br from-green-900/40 to-neutral-950" />
         )}
         
         {/* Absolute overlay projecting metadata firmly natively */}
         <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-neutral-950 to-transparent pt-32 pb-12 px-4 shadow-[inset_0_-20px_50px_rgba(0,0,0,0.5)]">
            <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-end justify-between gap-6">
               <div>
                 {charity.is_featured && (
                   <span className="inline-block bg-green-500 text-neutral-950 text-xs font-bold px-3 py-1 rounded-full mb-4">
                     Featured Organization
                   </span>
                 )}
                 <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-2">{charity.name}</h1>
                 <a href={charity.website_url} target="_blank" rel="noreferrer" className="text-green-400 font-bold hover:text-green-300 transition-colors flex items-center gap-1 w-fit">
                    <span>Explore Platform</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                 </a>
               </div>
               
               {user ? (
                 <form action={async () => {
                    'use server';
                    const { selectCharity } = await import('@/app/actions/charities');
                    await selectCharity(charity.id);
                 }}>
                   <button type="submit" className="w-full md:w-auto px-8 py-3.5 bg-green-500 hover:bg-green-400 text-neutral-950 font-bold tracking-tight rounded-lg transition-colors shadow-[0_0_20px_-5px_rgba(34,197,94,0.5)] whitespace-nowrap">
                     Choose This Target
                   </button>
                 </form>
               ) : (
                 <Link href="/login" className="w-full md:w-auto px-8 py-3.5 bg-neutral-800 hover:bg-neutral-700 text-white font-bold tracking-tight rounded-lg border border-neutral-700 transition-colors text-center whitespace-nowrap">
                     Login to Routinely Align
                 </Link>
               )}
            </div>
         </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pt-16 grid grid-cols-1 md:grid-cols-3 gap-12">
         
         <div className="md:col-span-2 space-y-10">
            <section>
               <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                 Organization Description
               </h2>
               {/* Whitespace preserving efficiently explicitly rendering breaks */}
               <div className="text-neutral-400 space-y-4 leading-relaxed whitespace-pre-wrap">
                 {charity.description}
               </div>
            </section>
         </div>

         <div className="md:col-span-1 border-t md:border-t-0 md:border-l border-neutral-800 pt-10 md:pt-0 md:pl-10 space-y-8">
            <section>
               <h2 className="text-xl font-bold text-white mb-6 tracking-tight flex items-center gap-2">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                 Upcoming Activations
               </h2>
               
               {events.length === 0 ? (
                  <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 text-center shadow-sm">
                     <p className="text-sm text-neutral-500 font-medium">No verified physical calendar events universally routed globally.</p>
                  </div>
               ) : (
                  <div className="space-y-4">
                     {events.map((evt: CharityEvent) => {
                        const evtDate = new Date(evt.event_date).toLocaleDateString('en-US', {
                           month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC'
                        });
                        return (
                           <div key={evt.id} className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 shadow-sm hover:border-neutral-700 transition-colors">
                              <span className="text-xs font-bold text-green-400 mb-1 block uppercase tracking-wider">{evtDate}</span>
                              <h4 className="text-white font-bold mb-2">{evt.title}</h4>
                              <p className="text-xs text-neutral-400 line-clamp-3">{evt.description}</p>
                           </div>
                        )
                     })}
                  </div>
               )}
            </section>
         </div>

      </div>
    </div>
  );
}
