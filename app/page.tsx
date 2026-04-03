// Homepage with interactive 3D scene and scrollable sections
import dynamic from 'next/dynamic';
import HeroSection from '@/components/sections/HeroSection';
import HowItWorks from '@/components/sections/HowItWorks';
import CharityImpact from '@/components/sections/CharityImpact';
import DrawMechanics from '@/components/sections/DrawMechanics';
import SubscribeCTA from '@/components/sections/SubscribeCTA';
import { getCharities } from '@/app/actions/charities';
import { getCharityStats } from '@/lib/analytics';
import { createServerSupabaseClient } from '@/lib/supabase';

const Scene = dynamic(() => import('@/components/canvas/Scene'), {
  ssr: false,
});

export default async function Home() {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = user ? await supabase
    .from('profiles')
    .select('is_admin, subscription_status')
    .eq('id', user.id)
    .single() : { data: null };

  const isSubscriptionActive = profile?.subscription_status === 'active';

  const featuredCharities = await getCharities(true);
  const featuredCharity = featuredCharities && featuredCharities.length > 0 ? featuredCharities[0] : undefined;
  const { totalImpact } = await getCharityStats();

  return (
    <div className="relative min-h-[500vh] bg-[#070707]">
      {/* Fixed 3D Foundation background */}
      <Scene />

      {/* Primary Scrollable Content */}
      <main className="relative z-10 w-full flex flex-col items-center">
        
        {/* Section 1: Hero (0-20% scroll) */}
        <div className="w-full min-h-[100svh]">
          <HeroSection 
            user={user} 
            isAdmin={profile?.is_admin} 
            isSubscriptionActive={isSubscriptionActive} 
          />
        </div>

        {/* Section 2: How It Works (20-40% scroll) */}
        <div className="w-full min-h-[100svh]">
           <HowItWorks />
        </div>

        {/* Section 3: Charity Impact (40-60% scroll) */}
        <div className="w-full min-h-[100svh]">
           <CharityImpact featuredCharity={featuredCharity} totalImpact={totalImpact} />
        </div>

        {/* Section 4: Draw Mechanics (60-80% scroll) */}
        <div className="w-full min-h-[100svh]">
           <DrawMechanics />
        </div>

        {/* Section 5: CTA (80-100% scroll) */}
        <div className="w-full min-h-[100svh]">
           <SubscribeCTA user={user} />
        </div>

      </main>
    </div>
  );
}
