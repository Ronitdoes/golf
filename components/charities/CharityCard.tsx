'use client';

// Modular rendering component encapsulating structural visual states dynamically routing users based on explicit authentication contexts
import Link from 'next/link';
import Image from 'next/image';

interface CharityCardProps {
  charity: {
    id: string;
    name: string;
    description: string;
    image_url: string | null;
    website_url: string | null;
    is_featured: boolean;
  };
  onSelect?: (id: string) => Promise<void>;
  isLoggedIn?: boolean;
  isSelecting?: string | null;
}

export default function CharityCard({ charity, onSelect, isLoggedIn, isSelecting }: CharityCardProps) {
  const loadingState = isSelecting === charity.id;

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-[0_0_20px_-5px_rgba(34,197,94,0.15)] hover:border-green-500/50 hover:-translate-y-1 transition-all duration-300 flex flex-col items-stretch group relative h-full">
      
      {charity.is_featured && (
        <div className="absolute top-4 right-4 z-10 bg-green-500 text-neutral-950 text-xs font-bold px-3 py-1 rounded-full shadow-md">
          Featured
        </div>
      )}

      <Link href={`/charities/${charity.id}`} className="block h-48 bg-neutral-800 relative overflow-hidden shrink-0">
         {charity.image_url ? (
           <Image
             src={charity.image_url}
             alt={charity.name}
             fill
             className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
           />
         ) : (
           <div className="w-full h-full bg-gradient-to-tr from-green-900/40 to-neutral-800" />
         )}
      </Link>

      <div className="p-6 flex flex-col flex-1">
         <Link href={`/charities/${charity.id}`}>
           <h3 className="text-xl font-bold text-white mb-2 line-clamp-1 group-hover:text-green-400 transition-colors">{charity.name}</h3>
         </Link>
         
         <p className="text-neutral-400 text-sm line-clamp-3 mb-6 flex-1">
            {charity.description}
         </p>

         <div className="mt-auto">
            {isLoggedIn && onSelect ? (
              <button 
                onClick={() => onSelect(charity.id)}
                disabled={loadingState || (isSelecting !== null && !loadingState)}
                className="w-full py-2.5 bg-neutral-800 hover:bg-green-500 hover:text-neutral-950 text-white font-medium rounded-lg transition-colors disabled:opacity-50 border border-neutral-700 hover:border-transparent flex items-center justify-center"
              >
                {loadingState ? (
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                ) : 'Select Target'}
              </button>
            ) : (
              <Link 
                 href={`/charities/${charity.id}`}
                 className="w-full inline-flex items-center justify-center py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white font-medium rounded-lg transition-colors border border-neutral-700"
              >
                 Learn More
              </Link>
            )}
         </div>
      </div>
    </div>
  );
}
