// Serverside route for modifying existing charity metadata
import { createServerSupabaseClient } from '@/lib/supabase';
import CharityFormPage from '../../CharityFormPage';
import { notFound } from 'next/navigation';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createServerSupabaseClient();
  const { id } = await params;
  
  const { data, error } = await supabase.from('charities').select('*').eq('id', id).single();

  if (error) return notFound();

  return (
    <CharityFormPage charity={data} />
  );
}
