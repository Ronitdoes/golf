'use client';

import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const prizes = [
  { match: '5 Numbers', percentage: '40%', label: 'Jackpot (Rolls over)' },
  { match: '4 Numbers', percentage: '35%', label: 'Secondary Prize' },
  { match: '3 Numbers', percentage: '25%', label: 'Participation Prize' },
];

const mockDrawnNumbers = [12, 18, 24, 33, 41];

export default function DrawMechanics() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative min-h-screen w-full flex flex-col items-center justify-center px-6 overflow-hidden">
      <div className="relative z-10 max-w-4xl w-full text-center space-y-16">
        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          className="space-y-4"
        >
          <h2 className="text-green-500 font-black uppercase tracking-[0.3em] text-sm">Monthly Mechanics</h2>
          <h1 className="text-4xl md:text-7xl font-black text-white leading-none tracking-tighter drop-shadow-[0_15px_40px_rgba(0,0,0,0.8)]">
            The Draw. <br />
            <span className="text-neutral-500">Every Month.</span>
          </h1>
        </motion.div>

        {/* Animated Lottery Balls */}
        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 py-8">
          {mockDrawnNumbers.map((num, i) => (
            <motion.div
              key={i}
              initial={{ scale: shouldReduceMotion ? 1 : 0, rotate: shouldReduceMotion ? 0 : -180 }}
              whileInView={{ scale: 1, rotate: 0 }}
              transition={{ 
                type: "spring", 
                stiffness: 260, 
                damping: 20, 
                delay: shouldReduceMotion ? 0 : 0.5 + i * 0.1 
              }}
              viewport={{ once: true }}
              className="w-14 h-14 md:w-20 md:h-20 rounded-full bg-white text-neutral-900 flex items-center justify-center text-xl md:text-3xl font-black shadow-[0_0_30px_rgba(255,255,255,0.2)] border-b-4 border-neutral-300"
            >
              {num}
            </motion.div>
          ))}
        </div>

        {/* Prize Pool Breakdown Table */}
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          viewport={{ once: true }}
          className="w-full bg-neutral-900/40 rounded-[2.5rem] border border-white/5 backdrop-blur-md overflow-hidden"
        >
          <div className="p-8 md:p-12 space-y-8">
            <h3 className="text-white font-bold text-xl md:text-2xl tracking-tight">Prize Pool Distribution</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-0 divide-y md:divide-y-0 md:divide-x divide-white/5">
              {prizes.map((prize, _i) => (
                <div key={prize.match} className="p-6 space-y-2">
                  <div className="text-4xl font-black text-green-500">{prize.percentage}</div>
                  <div className="text-white font-bold tracking-tight">{prize.match}</div>
                  <div className="text-neutral-500 text-sm">{prize.label}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Small Print */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          viewport={{ once: true }}
          className="text-neutral-600 text-[10px] md:text-sm font-medium tracking-wide uppercase italic"
        >
          * Draw uses your 5 most recent Stableford scores recorded in your dashboard.
        </motion.p>
      </div>
    </section>
  );
}
