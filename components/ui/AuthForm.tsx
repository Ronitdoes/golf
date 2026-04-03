'use client';

// Shared UI wrapper for authentication forms (login/signup) - Updated for compact high-fidelity display
import React, { useState } from 'react';
import { motion } from 'framer-motion';

export interface AuthField {
  name: string;
  label: string;
  type: string;
  placeholder?: string;
  required?: boolean;
}

interface AuthFormProps {
  title: string;
  fields: AuthField[];
  submitLabel: string;
  onSubmit: (formData: FormData) => Promise<{ error?: string; success?: string; isVerifying?: boolean } | void>;
  onVerify?: (code: string) => Promise<{ error?: string; success?: string } | void>;
  footer?: React.ReactNode;
  success?: string;
  error?: string;
  isVerifying?: boolean;
}

export default function AuthForm({ 
  title, 
  fields, 
  submitLabel, 
  onSubmit, 
  onVerify,
  footer, 
  success, 
  error, 
  isVerifying: initialIsVerifying = false 
}: AuthFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(error || null);
  const [successMsg, setSuccessMsg] = useState<string | null>(success || null);
  const [isVerifying, setIsVerifying] = useState(initialIsVerifying);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const formData = new FormData(e.currentTarget);
    try {
      if (isVerifying && onVerify) {
        const code = formData.get('token') as string;
        const res = await onVerify(code);
        if (res && res.error) setErrorMsg(res.error);
        else if (res && res.success) setSuccessMsg(res.success);
      } else {
        const res = await onSubmit(formData);
        if (res && res.error) {
          setErrorMsg(res.error);
        } else if (res && res.success) {
          setSuccessMsg(res.success);
        }
        
        if (res && (res as any).isVerifying) {
          setIsVerifying(true);
        }
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Something went wrong. Please try again.';
      setErrorMsg(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: [0.215, 0.61, 0.355, 1] }}
      className="w-full max-w-[400px] mx-auto p-8 rounded-[2.5rem] bg-white/[0.03] border border-white/10 backdrop-blur-2xl shadow-[0_40px_100px_-20px_rgba(34,197,94,0.1)] relative overflow-hidden group"
    >
      {/* Glossy overlay effect */}
      <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/[0.05] to-transparent pointer-events-none" />
      
      <div className="relative z-10">
        <h2 className="text-2xl font-black text-white mb-6 text-center tracking-tighter drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)] uppercase">{title}</h2>
        
        {errorMsg && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold flex items-center gap-3"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            {errorMsg}
          </motion.div>
        )}

        {successMsg && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-6 p-4 rounded-2xl bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold flex items-center gap-3"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            {successMsg}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isVerifying ? (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col gap-3"
            >
              <label htmlFor="token" className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 ml-1 text-center">
                 Verification Code
              </label>
              <input
                id="token"
                name="token"
                type="text"
                maxLength={8}
                required
                autoFocus
                placeholder="0 0 0 0 0 0 0 0"
                className="w-full text-center text-3xl font-black py-6 bg-white/[0.04] border border-green-500/20 rounded-3xl text-white tracking-[0.5em] focus:outline-none focus:ring-4 focus:ring-green-500/10 focus:border-green-500/50 transition-all placeholder-white/5 uppercase"
              />
              <p className="text-[10px] text-center text-white/30 font-medium tracking-tight">Enter the code sent to your email.</p>
            </motion.div>
          ) : (
            fields.map((field, idx) => (
              <motion.div 
                key={field.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + idx * 0.05, duration: 0.5 }}
                className="flex flex-col gap-1.5"
              >
                <label htmlFor={field.name} className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20 ml-1">
                  {field.label}
                </label>
                <div className="relative">
                  <input
                    id={field.name}
                    name={field.name}
                    type={field.type}
                    required={field.required}
                    placeholder={field.placeholder}
                    className="w-full px-5 py-3.5 bg-white/[0.02] border border-white/5 rounded-2xl text-white text-sm font-medium placeholder-white/10 focus:outline-none focus:ring-2 focus:ring-green-500/10 focus:border-green-500/30 transition-all hover:bg-white/[0.04]"
                  />
                </div>
              </motion.div>
            ))
          )}

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-4 px-6 bg-green-500 hover:bg-green-400 text-neutral-950 font-black text-base tracking-tight rounded-xl flex items-center justify-center transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_15px_30px_-5px_rgba(34,197,94,0.3)] group"
            >
              {isLoading ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-neutral-950" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : null}
              {isVerifying ? 'Confirm Code' : submitLabel}
            </button>
          </motion.div>
        </form>

        {footer && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="mt-8 text-center text-[9px] font-black uppercase tracking-[0.2em] text-white/10"
          >
            {footer}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
