import { Suspense } from 'react';
import { getCharities } from '@/app/actions/charities';
import { getCharityStats } from '@/lib/analytics';
import CharityImpact from './CharityImpact';

// Skeleton loader for the charity impact section
function CharityImpactSkeleton() {
  return (
    <div className="w-full min-h-screen bg-[#070707] flex items-center px-6 md:px-24">
      <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="hidden md:block" />
        <div className="space-y-12 animate-pulse">
          <div className="space-y-4">
            <div className="w-24 h-4 bg-white/5 rounded" />
            <div className="w-64 h-12 bg-white/5 rounded" />
            <div className="w-48 h-12 bg-white/5 rounded" />
            <div className="w-full h-24 bg-white/5 rounded" />
          </div>
          <div className="w-full h-48 bg-white/5 rounded-3xl" />
          <div className="w-full h-32 bg-white/5 rounded-3xl" />
        </div>
      </div>
    </div>
  );
}

async function CharityImpactData() {
  const featuredCharities = await getCharities(true);
  const featuredCharity = featuredCharities && featuredCharities.length > 0 ? featuredCharities[0] : undefined;
  const { totalImpact } = await getCharityStats();

  return <CharityImpact featuredCharity={featuredCharity} totalImpact={totalImpact} />;
}

export default function CharityImpactSection() {
  return (
    <Suspense fallback={<CharityImpactSkeleton />}>
      <CharityImpactData />
    </Suspense>
  );
}
