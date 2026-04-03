'use client';

// Administrative visual file-mapping component for charity assets
import { useState, useRef } from 'react';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';
import Image from 'next/image';

export default function ImageUpload({ 
  onUpload, 
  defaultUrl = '', 
  bucket = 'charities' 
}: { 
  onUpload: (url: string) => void, 
  defaultUrl?: string,
  bucket?: string 
}) {
  const [preview, setPreview] = useState(defaultUrl);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];

    // Basic validity boundaries for visual mapping
    if (file.size > 5 * 1024 * 1024) return alert('Payload structurally Compromised. Limit 5MB.');
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) return alert('Format Isolated Fault. Use JPG, PNG or WebP.');

    setIsUploading(true);
    const supabase = createBrowserSupabaseClient();
    
    // Construct isolated path for file-mapping
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
    const filePath = `visuals/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file);

    if (uploadError) {
      alert(uploadError.message);
    } else {
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);
      
      setPreview(publicUrl);
      onUpload(publicUrl);
    }
    
    setIsUploading(false);
  };

  return (
    <div className="space-y-4">
      <div 
        onClick={() => fileInputRef.current?.click()}
        className={`relative w-full aspect-video rounded-3xl overflow-hidden border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center group ${preview ? 'border-neutral-800' : 'border-neutral-800 hover:border-amber-500/50 hover:bg-amber-500/5 bg-neutral-950'}`}
      >
        {preview ? (
          <>
            <Image src={preview} alt="Profile Preview" fill className="object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
            <div className="absolute inset-0 bg-neutral-950/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity backdrop-blur-sm">
               <span className="text-white font-black text-sm tracking-widest uppercase">Replace Image</span>
            </div>
          </>
        ) : (
          <div className="text-center p-8">
             <div className="w-16 h-16 bg-neutral-900 border border-neutral-800 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-neutral-600 group-hover:text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
             </div>
             <p className="text-neutral-500 font-bold mb-1">Drag and drop or click to upload</p>
             <p className="text-[10px] text-neutral-700 font-black uppercase tracking-[0.2em]">JPG, PNG, WebP (Max 5MB)</p>
          </div>
        )}

        {isUploading && (
           <div className="absolute inset-0 bg-neutral-950/80 backdrop-blur-md flex flex-col items-center justify-center gap-4">
              <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-amber-500 font-black text-xs tracking-widest uppercase">Uploading Manifest...</span>
           </div>
        )}
      </div>

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
        accept="image/*" 
      />
    </div>
  );
}
