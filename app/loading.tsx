// Minimal and clean loading state for the Golf Charity Platform
export default function Loading() {
  return (
    <div className="fixed inset-0 bg-[#060606] z-[9999] flex flex-col items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        {/* Minimal Logo */}
        <h2 className="text-white font-black text-[10px] tracking-[0.5em] uppercase opacity-40">
          Digital<span className="text-green-500">Hero</span>
        </h2>
        
        {/* Clean, ultra-thin progress indicator */}
        <div className="w-24 h-[1px] bg-white/5 relative overflow-hidden">
          <div className="absolute inset-0 bg-green-500/30 w-1/3 animate-shimmer" />
        </div>
      </div>
    </div>
  );
}
