import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';

// Supabase OAuth and magic link callback handler
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');

  // If Supabase returned an error in the URL (e.g. link expired)
  if (error || errorDescription) {
    const msg = encodeURIComponent(errorDescription || error || 'Authentication failed');
    return NextResponse.redirect(`${origin}/login?error=${msg}`);
  }
  
  // Also handle optional next parameter to redirect user to specific destination
  const next = searchParams.get('next') ?? '/dashboard';
  
  if (code) {
    const supabase = createServerSupabaseClient();
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!exchangeError) {
      // Redirect to login with a success message for a better user experience
      return NextResponse.redirect(`${origin}/login?success=Account+confirmed!+Please+log+in+to+continue.`);
    }

    // Redirect with the specific exchange error message
    const msg = encodeURIComponent(exchangeError.message || 'Invalid or expired login link');
    return NextResponse.redirect(`${origin}/login?error=${msg}`);
  }

  // Final fallback
  return NextResponse.redirect(`${origin}/login?error=Authentication+request+missing+verification+code`);
}
