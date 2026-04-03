'use client';

// Administrative form interface for registering or modifying organization metadata
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ImageUpload from '@/components/admin/ImageUpload';
import { createCharity, updateCharity, addCharityEvent, deleteCharityEvent } from '@/app/actions/admin/charities';
import Link from 'next/link';

interface CharityData {
  id: string;
  name: string;
  description?: string;
  website_url?: string;
  image_url?: string;
  is_featured?: boolean;
  is_active?: boolean;
}

interface CharityEvent {
  id: string;
  title: string;
  description?: string;
  event_date: string;
  location?: string;
}

export default function CharityFormPage({ 
  charity, 
  events = [] 
}: { 
  charity?: CharityData, 
  events?: CharityEvent[] 
}) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: charity?.name || '',
    description: charity?.description || '',
    website_url: charity?.website_url || '',
    image_url: charity?.image_url || '',
    is_featured: charity?.is_featured || false,
    is_active: charity?.is_active ?? true,
  });

  // Event creation state
  const [newEvent, setNewEvent] = useState({
     title: '',
     description: '',
     event_date: '',
     location: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    const res = charity 
      ? await updateCharity(charity.id, formData)
      : await createCharity(formData);

    if (res.success) {
      router.push('/admin/charities');
    } else {
      alert(res.error);
    }
    setIsSaving(false);
  };

  const handleAddEvent = async () => {
    if (!charity) return alert('Register organization metadata prior to adding physical activations.');
    if (!newEvent.title || !newEvent.event_date) return alert('Title and Date are structurally required.');

    const res = await addCharityEvent(charity.id, newEvent);
    if (!res.error) {
       setNewEvent({ title: '', description: '', event_date: '', location: '' });
    } else {
       alert(res.error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
      
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 border-b border-neutral-800 pb-12">
        <div className="space-y-4">
           <Link href="/admin/charities" className="text-neutral-500 hover:text-amber-500 text-sm font-bold flex items-center gap-2 mb-4 group transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" /></svg>
              <span>Return to Registry</span>
           </Link>
           <h1 className="text-5xl font-black text-white tracking-tighter">
              {charity ? `Edit ${charity.name}` : 'Register Organization'}
           </h1>
           <p className="text-neutral-400 font-bold max-w-lg">Define organizational metadata, visual branding, and upcoming physical activations.</p>
        </div>
        
        <button 
           onClick={handleSubmit}
           disabled={isSaving}
           className="px-10 py-4 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-lg tracking-tight rounded-2xl shadow-lg transition-all active:scale-95 disabled:opacity-50"
        >
           {isSaving ? 'Processing Manifest...' : charity ? 'SAVE CHANGES' : 'VERIFY & REGISTER'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
         
         {/* Metadata and Visual Identity */}
         <div className="space-y-10">
            <section className="space-y-6">
               <h3 className="text-xl font-black text-white tracking-tight flex items-center gap-3">
                  <div className="w-1.5 h-6 bg-amber-500 rounded-full" />
                  Branding & Metadata
               </h3>
               
               <div className="space-y-6">
                  <div className="space-y-2">
                     <label className="text-xs font-black uppercase tracking-widest text-neutral-500">Visual Identifier</label>
                     <ImageUpload 
                        defaultUrl={formData.image_url} 
                        onUpload={(url) => setFormData(prev => ({ ...prev, image_url: url }))} 
                     />
                  </div>

                  <div className="space-y-2">
                     <label className="text-xs font-black uppercase tracking-widest text-neutral-500">Organization Name</label>
                     <input 
                        type="text" 
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-2xl py-4 px-6 text-white font-bold focus:outline-none focus:border-amber-500 transition-colors shadow-sm"
                        placeholder="Verified Entity Name"
                     />
                  </div>

                  <div className="space-y-2">
                     <label className="text-xs font-black uppercase tracking-widest text-neutral-500">Platform URL</label>
                     <input 
                        type="url" 
                        value={formData.website_url}
                        onChange={(e) => setFormData(prev => ({ ...prev, website_url: e.target.value }))}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-2xl py-4 px-6 text-white font-bold focus:outline-none focus:border-amber-500 transition-colors shadow-sm"
                        placeholder="https://organization.org"
                     />
                  </div>

                  <div className="space-y-2">
                     <label className="text-xs font-black uppercase tracking-widest text-neutral-500">Description Manifest</label>
                     <textarea 
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-2xl py-4 px-6 text-white font-medium focus:outline-none focus:border-amber-500 transition-colors shadow-sm min-h-[160px]"
                        placeholder="Describe the organization's core mission and verified impact..."
                     />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <button 
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, is_featured: !prev.is_featured }))}
                        className={`flex items-center justify-between px-6 py-4 rounded-2xl border-2 transition-all font-bold ${formData.is_featured ? 'border-amber-500 bg-amber-500/10 text-white' : 'border-neutral-800 text-neutral-500 hover:border-neutral-700'}`}
                     >
                        Featured Spotlight
                        <div className={`w-4 h-4 rounded-full border-2 ${formData.is_featured ? 'border-amber-500 bg-amber-500' : 'border-neutral-700'}`} />
                     </button>
                     <button 
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, is_active: !prev.is_active }))}
                        className={`flex items-center justify-between px-6 py-4 rounded-2xl border-2 transition-all font-bold ${formData.is_active ? 'border-green-500 bg-green-500/10 text-white' : 'border-neutral-800 text-neutral-500 hover:border-neutral-700'}`}
                     >
                        Registry Status
                        <div className={`w-4 h-4 rounded-full border-2 ${formData.is_active ? 'border-green-500 bg-green-500' : 'border-neutral-700'}`} />
                     </button>
                  </div>
               </div>
            </section>
         </div>

         {/* Activations and Events */}
         <div className="space-y-10">
            <section className="space-y-6">
               <h3 className="text-xl font-black text-white tracking-tight flex items-center gap-3">
                  <div className="w-1.5 h-6 bg-rose-500 rounded-full" />
                  Physical Activations
               </h3>

               {!charity ? (
                  <div className="p-10 border-2 border-dashed border-neutral-800 rounded-3xl text-center">
                     <p className="text-neutral-500 font-bold mb-4">Registry ID unmapped structurally.</p>
                     <p className="text-xs text-neutral-700 font-black uppercase tracking-widest">Register core metadata prior to scheduling physical activations.</p>
                  </div>
               ) : (
                  <div className="space-y-8">
                     {/* Add New Event Form */}
                     <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 space-y-4 shadow-xl">
                        <div className="grid grid-cols-2 gap-4">
                           <input 
                              type="text" 
                              placeholder="Event Title"
                              value={newEvent.title}
                              onChange={(e) => setNewEvent(p => ({ ...p, title: e.target.value }))}
                              className="bg-neutral-950 border border-neutral-800 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-amber-500"
                           />
                           <input 
                              type="date" 
                              value={newEvent.event_date}
                              onChange={(e) => setNewEvent(p => ({ ...p, event_date: e.target.value }))}
                              className="bg-neutral-950 border border-neutral-800 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-amber-500"
                           />
                        </div>
                        <input 
                           type="text" 
                           placeholder="Physical Location"
                           value={newEvent.location}
                           onChange={(e) => setNewEvent(p => ({ ...p, location: e.target.value }))}
                           className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-amber-500"
                        />
                        <button 
                           onClick={handleAddEvent}
                           className="w-full py-3 bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all border border-neutral-700"
                        >
                           Schedule Activation
                        </button>
                     </div>

                     {/* Events List */}
                     <div className="space-y-4">
                        {events.length === 0 ? (
                           <p className="text-center text-xs text-neutral-700 font-black uppercase tracking-widest py-8">No physical activations scheduled.</p>
                        ) : (
                           events.map((evt) => (
                              <div key={evt.id} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 flex items-center justify-between group hover:border-neutral-700 transition-all">
                                 <div className="space-y-1">
                                    <span className="text-xs font-black text-amber-500 uppercase tracking-widest">{new Date(evt.event_date).toLocaleDateString()}</span>
                                    <h4 className="text-white font-bold">{evt.title}</h4>
                                    <p className="text-xs text-neutral-500">{evt.location}</p>
                                 </div>
                                 <button 
                                    onClick={() => deleteCharityEvent(evt.id, charity.id)}
                                    className="p-3 text-neutral-700 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all"
                                 >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                 </button>
                              </div>
                           ))
                        )}
                     </div>
                  </div>
               )}
            </section>
         </div>

      </div>
    </div>
  );
}
