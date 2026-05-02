'use client';

// Administrative form interface for registering or modifying organization metadata
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ImageUpload from '@/components/admin/ImageUpload';
import { createCharity, updateCharity } from '@/app/actions/admin/charities';
import Link from 'next/link';

interface CharityData {
  id: string;
  name: string;
  description?: string;
  website_url?: string;
  image_url?: string;
}

export default function CharityFormPage({ 
  charity
}: { 
  charity?: CharityData
}) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: charity?.name || '',
    description: charity?.description || '',
    website_url: charity?.website_url || '',
    image_url: charity?.image_url || '',
    is_featured: false,
    is_active: true,
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

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
      
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 border-b border-neutral-800 pb-12">
        <div className="space-y-4">
           <Link href="/admin/charities" className="text-neutral-500 hover:text-green-500 text-sm font-bold flex items-center gap-2 mb-4 group transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" /></svg>
              <span>Return to Registry</span>
           </Link>
           <h1 className="text-5xl font-black text-white tracking-tighter">
              {charity ? `Edit ${charity.name}` : 'Register Organization'}
           </h1>
           <p className="text-neutral-400 font-bold max-w-lg">Define organizational metadata and visual branding for the registry.</p>
        </div>
        
        <button 
           onClick={handleSubmit}
           disabled={isSaving}
           className="px-10 py-4 bg-green-500 hover:bg-green-400 text-neutral-950 font-black text-lg tracking-tight rounded-2xl shadow-lg transition-all active:scale-95 disabled:opacity-50"
        >
           {isSaving ? 'Processing Manifest...' : charity ? 'SAVE CHANGES' : 'VERIFY & REGISTER'}
        </button>
      </div>

      <div className="space-y-10">
         <section className="space-y-6">
            <h3 className="text-xl font-black text-white tracking-tight flex items-center gap-3">
               <div className="w-1.5 h-6 bg-green-500 rounded-full" />
               Branding & Metadata
            </h3>
            
            <div className="space-y-6 bg-neutral-900 border border-neutral-800 p-8 rounded-3xl">
               <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-neutral-500">Visual Identifier</label>
                  <ImageUpload 
                     defaultUrl={formData.image_url} 
                     onUpload={(url) => setFormData(prev => ({ ...prev, image_url: url }))} 
                  />
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                     <label className="text-xs font-black uppercase tracking-widest text-neutral-500">Organization Name</label>
                     <input 
                        type="text" 
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-2xl py-4 px-6 text-white font-bold focus:outline-none focus:border-green-500 transition-colors shadow-sm"
                        placeholder="Verified Entity Name"
                     />
                  </div>

                  <div className="space-y-2">
                     <label className="text-xs font-black uppercase tracking-widest text-neutral-500">Platform URL</label>
                     <input 
                        type="url" 
                        value={formData.website_url}
                        onChange={(e) => setFormData(prev => ({ ...prev, website_url: e.target.value }))}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-2xl py-4 px-6 text-white font-bold focus:outline-none focus:border-green-500 transition-colors shadow-sm"
                        placeholder="https://organization.org"
                     />
                  </div>
               </div>

               <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-neutral-500">Description Manifest</label>
                  <textarea 
                     value={formData.description}
                     onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                     className="w-full bg-neutral-950 border border-neutral-800 rounded-2xl py-4 px-6 text-white font-medium focus:outline-none focus:border-green-500 transition-colors shadow-sm min-h-[160px]"
                     placeholder="Describe the organization's core mission and verified impact..."
                  />
               </div>
            </div>
         </section>
      </div>
    </div>
  );
}
