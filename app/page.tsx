// Homepage with interactive 3D scene and scrollable sections
import HeroSection from '@/components/sections/HeroSection';
import HowItWorks from '@/components/sections/HowItWorks';
import CharityImpactSection from '@/components/sections/CharityImpactSection';
import DrawMechanics from '@/components/sections/DrawMechanics';
import SubscribeCTA from '@/components/sections/SubscribeCTA';
import { createServerSupabaseClient } from '@/lib/supabase';
import SceneClient from '@/components/canvas/SceneClient';

export default async function Home() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = user ? await supabase
    .from('profiles')
    .select('is_admin, subscription_status')
    .eq('id', user.id)
    .single() : { data: null };

  const isSubscriptionActive = profile?.subscription_status === 'active';

  return (
    <div className="relative min-h-[500vh] bg-[#070707]">
      {/* Fixed 3D Foundation background */}
      <SceneClient />

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
        <div id="how-it-works" className="w-full min-h-[100svh]">
           <HowItWorks />
        </div>

        {/* Section 3: Charity Impact (40-60% scroll) */}
        <div className="w-full min-h-[100svh]">
           <CharityImpactSection />
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
