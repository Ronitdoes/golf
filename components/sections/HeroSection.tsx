'use client';

import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import Link from 'next/link';
import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/dist/ScrollToPlugin';
import { signOut } from '@/app/actions/auth';

interface UserMeta { id?: string; email?: string }

export default function HeroSection({ user, isAdmin, isSubscriptionActive }: { user?: UserMeta | null, isAdmin?: boolean, isSubscriptionActive?: boolean }) {
  const words = "Subscribe. Play. Give.".split(" ");
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    gsap.registerPlugin(ScrollToPlugin);
  }, []);

  const scrollToSection = (id: string, withMessage?: boolean) => {
    if (withMessage) {
      // Small tactical notification logic
      const msg = document.createElement('div');
      msg.className = 'fixed top-24 left-1/2 -translate-x-1/2 z-[60] bg-white text-neutral-950 font-black text-xs uppercase tracking-[0.2em] px-8 py-4 rounded-2xl shadow-2xl animate-in fade-in slide-in-from-top-4 duration-500';
      msg.textContent = 'Start your subscription to see the dashboard';
      document.body.appendChild(msg);
      setTimeout(() => {
        msg.classList.add('animate-out', 'fade-out', 'slide-out-to-top-4');
        setTimeout(() => msg.remove(), 500);
      }, 3000);
    }

    gsap.to(window, {
      duration: 2.5,
      scrollTo: { y: `#${id}`, autoKill: true },
      ease: "power3.inOut"
    });
  };

  return (
    <section className="relative min-h-screen w-full flex flex-col items-center justify-center px-6 overflow-hidden">
      {/* Top Navigation */}
      <motion.nav 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute top-0 right-0 p-8 md:p-12 z-50 flex items-center gap-6 md:gap-10"
      >
        {user ? (
          <div className="flex items-center gap-6 md:gap-8">
            {isAdmin && (
               <Link 
                  href="/admin" 
                  className="text-white/40 hover:text-white font-black text-[10px] md:text-xs tracking-[0.3em] uppercase transition-all"
               >
                  Admin
               </Link>
            )}

            {isSubscriptionActive || isAdmin ? (
               <Link 
                  href="/dashboard" 
                  className="text-white/40 hover:text-white font-black text-[10px] md:text-xs tracking-[0.3em] uppercase transition-all"
               >
                  Dashboard
               </Link>
            ) : (
               <button 
                  onClick={() => scrollToSection('membership', true)}
                  className="text-white/40 hover:text-white font-black text-[10px] md:text-xs tracking-[0.3em] uppercase transition-all"
               >
                  Dashboard
               </button>
            )}

            <form action={signOut}>
               <button 
                  type="submit"
                  className="px-6 md:px-8 py-3 bg-white/[0.03] hover:bg-white/[0.08] text-white font-black text-[10px] md:text-xs tracking-[0.3em] uppercase rounded-full border border-white/10 backdrop-blur-2xl transition-all hover:scale-105 active:scale-95 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)]"
               >
                  Sign Out
               </button>
            </form>
          </div>
        ) : (
          <div className="flex items-center gap-6 md:gap-8">
            <Link 
              href="/login" 
              className="text-white/40 hover:text-white font-black text-[10px] md:text-xs tracking-[0.3em] uppercase transition-all"
            >
              Login
            </Link>
            <Link 
              href="/signup" 
              className="px-6 md:px-8 py-3 bg-white/[0.03] hover:bg-white/[0.08] text-white font-black text-[10px] md:text-xs tracking-[0.3em] uppercase rounded-full border border-white/10 backdrop-blur-2xl transition-all hover:scale-105 active:scale-95 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)]"
            >
              Sign Up
            </Link>
          </div>
        )}
      </motion.nav>

      {/* Background grain texture overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat" />
      
      <div className="relative z-10 max-w-4xl w-full text-center space-y-8">
        <h1 className="text-[clamp(2.5rem,6vw,5rem)] font-black text-white leading-[0.9] tracking-tighter drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
          {words.map((word, i) => (
            <motion.span
              key={i}
              initial={{ filter: shouldReduceMotion ? 'none' : 'blur(20px)', opacity: 0, y: shouldReduceMotion ? 0 : 40 }}
              whileInView={{ filter: 'none', opacity: 1, y: 0 }}
              transition={{ 
                duration: 1, 
                delay: i * 0.1, 
                ease: [0.215, 0.61, 0.355, 1] 
              }}
              viewport={{ once: true }}
              className="inline-block mr-[0.2em] last:mr-0"
            >
              {word}
            </motion.span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          viewport={{ once: true }}
          className="text-neutral-200 text-lg md:text-2xl font-bold max-w-2xl mx-auto leading-relaxed drop-shadow-[0_5px_15px_rgba(0,0,0,0.8)]"
        >
          Enter your scores. Win monthly prizes. <br className="hidden md:block" />
          Support a charity you love.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6"
        >
          <button 
            onClick={() => scrollToSection('membership')}
            className="w-full sm:w-auto px-10 py-5 bg-green-500 hover:bg-green-400 text-neutral-950 font-black text-lg tracking-tight rounded-2xl shadow-[0_20px_40px_-10px_rgba(34,197,94,0.4)] transition-all hover:scale-105 active:scale-95"
          >
            Subscribe Now
          </button>
          <button 
            onClick={() => scrollToSection('how-it-works')}
            className="w-full sm:w-auto px-10 py-5 bg-white/5 hover:bg-white/10 text-white font-bold text-lg rounded-2xl border border-white/10 transition-all active:scale-95"
          >
            Learn How It Works
          </button>
        </motion.div>
      </div>

      {/* Animated scroll indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-10 flex flex-col items-center gap-3"
      >
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-600">Scroll to Explore</span>
        <div className="w-px h-12 bg-gradient-to-b from-neutral-800 to-transparent" />
        <motion.div 
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-1.5 h-1.5 bg-green-500 rounded-full shadow-[0_0_10px_#22C55E]"
        />
      </motion.div>
    </section>
  );
}
