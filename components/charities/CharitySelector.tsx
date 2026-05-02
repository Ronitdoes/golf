'use client';

// Modal interface encapsulating visual search indices overriding standard DOM bounds securely natively
import { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';
import { selectCharity } from '@/app/actions/charities';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface CharityOption {
  id: string;
  name: string;
  description: string;
  image_url?: string | null;
  is_featured?: boolean;
}

export default function CharitySelector({ 
  triggerLabel = 'Change Charity', 
  triggerClass = 'px-5 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white font-medium rounded-lg transition-colors border border-neutral-700 shadow-sm'
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [charities, setCharities] = useState<CharityOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSelecting, setIsSelecting] = useState<string | null>(null);
  const router = useRouter();

   const [mounted, setMounted] = useState(false);
   useEffect(() => setMounted(true), []);

   // Load dynamically conditionally minimizing universal payload footprint securely
   useEffect(() => {
      if (isOpen && charities.length === 0) {
         setIsLoading(true);
         const supabase = createBrowserSupabaseClient();
         supabase.from('charities').select('id, name, description, image_url, is_featured').eq('is_active', true).order('name')
           .then(({ data }) => {
              if (data) setCharities(data);
              setIsLoading(false);
           });
      }
   }, [isOpen, charities.length]);

   const filteredCharities = useMemo(() => {
     return charities.filter(charity => 
       charity.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
       charity.description.toLowerCase().includes(searchQuery.toLowerCase())
     );
   }, [charities, searchQuery]);

   const handleSelect = async (id: string) => {
     setIsSelecting(id);
     const res = await selectCharity(id);
     setIsSelecting(null);

     if (res?.success) {
       setIsOpen(false);
       // Ensure UI updates securely seamlessly 
       router.refresh(); 
     } else {
       alert(res?.error || 'Failed to update alignment parameters securely.');
     }
   };

   return (
     <>
       <button onClick={() => setIsOpen(true)} className={triggerClass}>
         {triggerLabel}
       </button>

       {isOpen && mounted && createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-neutral-950/90 backdrop-blur-lg animate-in fade-in duration-200">
             {/* Clickaway logical overlay inherently */}
             <div className="absolute inset-0" onClick={() => setIsOpen(false)}></div>
             
             <div className="relative w-full max-w-2xl max-h-[85vh] bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl flex flex-col animate-in zoom-in-95 duration-200 overflow-hidden">
                
                <div className="p-6 border-b border-neutral-800 flex items-center justify-between shrink-0 bg-neutral-900/90 backdrop-blur-md z-10">
                   <h2 className="text-xl font-bold text-white">Select Organization</h2>
                   <button onClick={() => setIsOpen(false)} className="p-2 text-neutral-500 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                   </button>
                </div>

                <div className="p-4 border-b border-neutral-800 shrink-0 relative bg-neutral-900 z-0">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-7 top-1/2 -translate-y-1/2 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                   </svg>
                   <input 
                     type="text" 
                     placeholder="Search explicitly internally..."
                     autoFocus
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-green-500 transition-colors"
                   />
                </div>

                <div className="flex-1 overflow-y-auto p-4 bg-neutral-950/50">
                   {isLoading ? (
                      <div className="flex items-center justify-center p-12">
                         <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                   ) : filteredCharities.length === 0 ? (
                      <div className="text-center p-12">
                         <p className="text-neutral-500">No organizations found dynamically mimicking search query natively.</p>
                      </div>
                   ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                         {filteredCharities.map((charity) => (
                            <div key={charity.id} className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden hover:border-green-500/50 transition-colors flex flex-col">
                               {charity.image_url && (
                                 <div className="relative w-full h-24"><Image src={charity.image_url!} alt={charity.name} fill className="object-cover opacity-80" /></div>
                               )}
                               <div className="p-4 flex flex-col flex-1">
                                  <div className="flex items-start justify-between gap-2 mb-2">
                                      <h3 className="font-bold text-white text-sm line-clamp-1">{charity.name}</h3>
                                      {charity.is_featured && <span className="bg-green-500 text-neutral-950 text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0">Featured</span>}
                                  </div>
                                  <p className="text-xs text-neutral-500 line-clamp-2 mb-4 flex-1">{charity.description}</p>
                                  <button 
                                     onClick={() => handleSelect(charity.id)}
                                     disabled={isSelecting === charity.id}
                                     className="w-full py-2 bg-neutral-950 hover:bg-green-500 hover:text-neutral-950 text-white text-xs font-bold rounded shadow-sm border border-neutral-800 transition-colors disabled:opacity-50"
                                  >
                                     {isSelecting === charity.id ? 'Binding...' : 'Select Target'}
                                  </button>
                               </div>
                            </div>
                         ))}
                      </div>
                   )}
                </div>

             </div>
          </div>,
          document.body
       )}
     </>
  );
}
