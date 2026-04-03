'use client';

// Administrative high-fidelity visualization center for platform performance using Green brand theme
import { 
  BarChart, Bar, 
  PieChart, Pie, 
  XAxis, YAxis, 
  CartesianGrid, Tooltip, 
  ResponsiveContainer, Cell 
} from 'recharts';
import StatsCard from '@/components/admin/StatsCard';
import { motion } from 'framer-motion';

const COLORS = ['#10B981', '#34D399', '#059669', '#047857', '#064E3B', '#10B981'];

interface SubscriberStats { active: number }
interface PrizeHistoryEntry { month: string; amount: number }
interface PrizeStats { totalPaid: number; history: PrizeHistoryEntry[] }
interface CharityBreakdownEntry { name: string; value: number }
interface CharityStats { totalImpact: number; breakdown: CharityBreakdownEntry[] }
interface DrawFrequencyEntry { number: number; count: number }
interface DrawStats { drawsRun: number; frequencyChart: DrawFrequencyEntry[] }

export default function ReportsDashboard({ 
  subscriberStats, 
  prizeStats, 
  charityStats, 
  drawStats 
}: { 
  subscriberStats: SubscriberStats, 
  prizeStats: PrizeStats, 
  charityStats: CharityStats, 
  drawStats: DrawStats 
}) {
  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      
      {/* Header and Title Control */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-white/5 pb-16 space-y-4"
      >
         <span className="text-[10px] font-black uppercase tracking-[0.4em] text-green-500/60 ml-1">Aggregate Network Analytics</span>
         <h1 className="text-[clamp(2.5rem,5vw,4rem)] font-black text-white tracking-tighter leading-none">Performance Intelligence</h1>
         <p className="text-white/30 font-bold text-lg max-w-2xl leading-relaxed">
            Global aggregation of verified subscriber growth, financial allotments, and charitable manifestation outcomes.
         </p>
      </motion.div>

      {/* High-Fidelity Tactical Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
         <StatsCard 
            label="Verified Subscribers" 
            value={subscriberStats.active} 
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>}
            trend="4.2%" 
         />
         <StatsCard 
            label="Allocated Prizes" 
            value={`£${prizeStats.totalPaid.toLocaleString()}`} 
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            trend="12.8%" 
         />
         <StatsCard 
            label="Charity Impact" 
            value={`£${charityStats.totalImpact.toLocaleString()}`} 
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>}
            trend="8.5%" 
         />
         <StatsCard 
            label="Draw Outcomes" 
            value={drawStats.drawsRun} 
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>}
         />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
         
         {/* Financial Distribution Chart Container */}
         <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="bg-white/[0.01] border border-white/5 rounded-[3rem] p-12 space-y-10 shadow-2xl backdrop-blur-3xl relative overflow-hidden"
         >
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/[0.02] rounded-full blur-[60px]" />
            <h3 className="text-xl font-black text-white tracking-tight uppercase text-xs opacity-40">Financial Allocation History</h3>
            <div className="h-[300px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={prizeStats.history}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                    <XAxis dataKey="month" stroke="#444" fontSize={10} fontWeight="900" tickLine={false} axisLine={false} />
                    <YAxis stroke="#444" fontSize={10} fontWeight="900" tickLine={false} axisLine={false} tickFormatter={(val) => `£${val}`} />
                    <Tooltip 
                       cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                       contentStyle={{ backgroundColor: '#000', border: '1px solid #222', borderRadius: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.8)' }}
                       labelStyle={{ fontWeight: 'black', color: '#fff', fontSize: '10px', textTransform: 'uppercase' }}
                    />
                    <Bar dataKey="amount" fill="#10B981" radius={[8, 8, 4, 4]} barSize={40} />
                  </BarChart>
               </ResponsiveContainer>
            </div>
         </motion.div>

         {/* Charity Manifestation Chart Container */}
         <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="bg-white/[0.01] border border-white/5 rounded-[3rem] p-12 space-y-10 shadow-2xl backdrop-blur-3xl flex flex-col items-center text-center lg:items-start lg:text-left relative overflow-hidden"
         >
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-green-500/[0.02] rounded-full blur-[60px]" />
            <h3 className="text-xl font-black text-white tracking-tight uppercase text-xs opacity-40">Organization Manifestation Reach</h3>
            <div className="h-[300px] w-full z-10">
               <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={charityStats.breakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={100}
                      paddingAngle={8}
                      dataKey="value"
                    >
                      {charityStats.breakdown.map((entry: CharityBreakdownEntry, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                       contentStyle={{ backgroundColor: '#000', border: '1px solid #222', borderRadius: '16px' }}
                       itemStyle={{ color: '#fff', fontWeight: '900', fontSize: '10px' }}
                    />
                  </PieChart>
               </ResponsiveContainer>
            </div>
            
            <div className="mt-4 grid grid-cols-2 gap-6 w-full relative z-10">
               {charityStats.breakdown.slice(0, 4).map((entry: CharityBreakdownEntry, index: number) => (
                  <div key={index} className="flex items-center gap-3">
                     <div className="w-2.5 h-2.5 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.3)]" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                     <span className="text-[10px] text-white/30 font-black uppercase tracking-widest truncate">{entry.name}</span>
                  </div>
               ))}
            </div>
         </motion.div>

      </div>

      {/* Global Number Matrix Frequency Container */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        className="bg-white/[0.01] border border-white/5 rounded-[3rem] p-12 space-y-12 shadow-2xl backdrop-blur-3xl relative overflow-hidden"
      >
         <div className="flex items-center justify-between relative z-10">
            <h3 className="text-xl font-black text-white tracking-tight uppercase text-xs opacity-40">Frequency Intersection Matrix (Top 10)</h3>
            <span className="text-[10px] bg-white/[0.05] border border-white/5 px-6 py-2 rounded-full text-white/30 font-black uppercase tracking-widest">Aggregate Registry Data</span>
         </div>
         <div className="h-[300px] w-full z-10">
            <ResponsiveContainer width="100%" height="100%">
               <BarChart data={drawStats.frequencyChart} layout="vertical">
                 <CartesianGrid strokeDasharray="3 3" stroke="#222" horizontal={false} />
                 <XAxis type="number" stroke="#444" fontSize={10} fontWeight="900" tickLine={false} axisLine={false} />
                 <YAxis dataKey="number" type="category" stroke="#fff" fontSize={10} fontWeight="900" tickLine={false} axisLine={false} />
                 <Tooltip 
                    cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                    contentStyle={{ backgroundColor: '#000', border: '1px solid #222', borderRadius: '16px' }}
                    itemStyle={{ color: '#10B981', fontWeight: '900' }}
                 />
                 <Bar dataKey="count" fill="#10B981" radius={[0, 8, 8, 0]} barSize={20} />
               </BarChart>
            </ResponsiveContainer>
         </div>
      </motion.div>

    </div>
  );
}
