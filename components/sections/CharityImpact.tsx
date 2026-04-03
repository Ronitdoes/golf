'use client';

import { motion, useInView } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Charity {
  id: string;
  name: string;
  description: string;
  image_url: string;
}

interface CharityImpactProps {
  featuredCharity?: Charity;
  totalImpact: number;
}

export default function CharityImpact({ featuredCharity, totalImpact }: CharityImpactProps) {
  const counterRef = useRef<HTMLSpanElement>(null);
  const isInView = useInView(counterRef, { once: true, margin: "-100px" });
  const [count, setCount] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (isInView) {
      if (totalImpact <= 0) {
        setCount(0);
        return;
      }
      if (shouldReduceMotion) {
        setCount(totalImpact);
        return;
      }
      const _start = 0;
      const end = totalImpact;
      const duration = 2000; // 2 seconds
      const startTime = performance.now();

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Ease out cubic
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        const currentCount = Math.floor(easedProgress * end);
        
        setCount(currentCount);

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    }
  }, [isInView, totalImpact, shouldReduceMotion]);

  return (
    <section className="relative min-h-screen w-full flex items-center px-6 md:px-24 overflow-hidden">
      <div className="relative z-10 max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Left Column: Empty (Ball placeholder) */}
        <div className="hidden md:block pointer-events-none" aria-hidden="true" />

        {/* Right Column: Content */}
        <div className="flex flex-col justify-center space-y-12">
          <motion.div
            initial={{ opacity: 0, x: shouldReduceMotion ? 0 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <h2 className="text-green-500 font-black uppercase tracking-[0.3em] text-sm mb-4">The Impact</h2>
            <h1 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tighter">
              Every subscription <br />
              <span className="text-neutral-500">gives back.</span>
            </h1>
            <p className="mt-6 text-neutral-400 text-lg md:text-xl max-w-lg leading-relaxed font-medium">
              Choose a charity at signup. A minimum of 10% of your subscription goes directly to them.
            </p>
          </motion.div>

          {/* Animated Counter */}
          <motion.div
            initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-neutral-900/40 p-10 rounded-[2rem] border border-white/5 backdrop-blur-sm max-w-lg flex flex-col items-center justify-center text-center space-y-4"
          >
            <span className="text-neutral-500 font-bold uppercase tracking-widest text-xs">Total Charity Impact</span>
            <div className="text-6xl md:text-7xl font-black text-white tracking-tighter flex items-center justify-center">
              <span className="text-green-500 mr-2">£</span>
              <span ref={counterRef}>{count.toLocaleString()}</span>
            </div>
          </motion.div>

          {/* Featured Charity Card */}
          {featuredCharity && (
            <motion.div
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="group relative bg-white/[0.03] hover:bg-white/[0.05] p-6 rounded-3xl border border-white/5 transition-all duration-500 flex items-start gap-6 max-w-lg"
            >
              <div className="relative w-24 h-24 flex-shrink-0 rounded-2xl overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700">
                <Image 
                  src={featuredCharity.image_url || '/charity-placeholder.jpg'} 
                  alt={featuredCharity.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-green-500/10 text-green-500 text-[10px] font-black uppercase tracking-wider rounded-full border border-green-500/20">Featured</span>
                  <h4 className="text-xl font-bold text-white tracking-tight">{featuredCharity.name}</h4>
                </div>
                <p className="text-neutral-400 text-sm line-clamp-2 leading-relaxed">
                  {featuredCharity.description}
                </p>
              </div>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
          >
            <Link 
              href="/charities"
              className="group inline-flex items-center gap-3 text-white font-bold hover:text-green-500 transition-colors"
            >
              Browse all charities
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
