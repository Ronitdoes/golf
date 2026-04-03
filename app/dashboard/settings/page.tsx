'use client';

import { useState, useEffect } from 'react';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [profile, setProfile] = useState({
    full_name: '',
    avatar_url: '',
    email: ''
  });

  const supabase = createBrowserSupabaseClient();

  useEffect(() => {
    async function getProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('full_name, avatar_url, email')
          .eq('id', user.id)
          .single();
        
        if (data) setProfile(data);
      }
      setLoading(false);
    }
    getProfile();
  }, [supabase]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profile.full_name,
        })
        .eq('id', user.id);

      if (error) alert('Error updating profile');
      else alert('Profile updated successfully!');
    }
    setUpdating(false);
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    setUpdating(true);
    const fileExt = file.name.split('.').pop();
    const filePath = `${user.id}/avatar.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true });

    if (!uploadError) {
      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(filePath);
      await supabase.from('profiles').update({ avatar_url: publicUrl }).eq('id', user.id);
      setProfile(prev => ({ ...prev, avatar_url: publicUrl }));
      alert('Avatar updated!');
    }
    setUpdating(false);
  };

  if (loading) return <div className="h-96 flex items-center justify-center"><div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="max-w-3xl space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-4xl font-black text-white tracking-tighter mb-2">Account Settings</h1>
        <p className="text-white/40 font-bold">Manage your player identity and security protocols.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="space-y-6">
          <h3 className="text-xs font-black text-white/20 uppercase tracking-[0.3em]">Player Identity</h3>
          <div className="relative group w-40 h-40">
            <div className="w-full h-full rounded-[2.5rem] bg-neutral-900 border-2 border-dashed border-white/10 overflow-hidden flex items-center justify-center relative">
              {profile.avatar_url ? (
                <Image src={profile.avatar_url} alt="Avatar" fill className="object-cover" />
              ) : (
                <span className="text-4xl font-black text-white/10">{profile.full_name?.charAt(0) || 'U'}</span>
              )}
            </div>
            <label className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-[2.5rem]">
              <span className="text-[10px] font-black text-white uppercase tracking-widest">Change Photo</span>
              <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} disabled={updating} />
            </label>
          </div>
        </div>

        <form onSubmit={handleUpdate} className="md:col-span-2 space-y-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Full Name</label>
              <input
                type="text"
                value={profile.full_name}
                onChange={e => setProfile(prev => ({ ...prev, full_name: e.target.value }))}
                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-white font-bold focus:outline-none focus:ring-4 focus:ring-green-500/10 focus:border-green-500/50 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Email Address</label>
              <input
                type="email"
                disabled
                value={profile.email}
                className="w-full bg-white/[0.01] border border-white/5 rounded-2xl px-6 py-4 text-white/30 font-bold cursor-not-allowed"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={updating}
            className="px-10 py-4 bg-green-500 hover:bg-green-400 text-neutral-950 font-black rounded-2xl transition-all disabled:opacity-50 shadow-xl shadow-green-500/10 active:scale-95"
          >
            {updating ? 'Processing Synchronizatons...' : 'Save Configuration'}
          </button>
        </form>
      </div>

      <div className="pt-12 border-t border-white/5">
        <div className="bg-red-500/5 border border-red-500/10 rounded-[2.5rem] p-10 flex flex-col md:flex-row items-center justify-between gap-8">
           <div className="space-y-1 text-center md:text-left">
              <h4 className="text-xl font-bold text-white">Danger Terminal</h4>
              <p className="text-sm text-red-400/60 font-medium">Permanently decommission your account and all associated draw data.</p>
           </div>
           <button className="px-8 py-3 bg-red-500/10 hover:bg-red-500 hover:text-white text-red-500 font-black rounded-xl transition-all text-xs border border-red-500/20">
              DELETE ACCOUNT
           </button>
        </div>
      </div>
    </div>
  );
}
