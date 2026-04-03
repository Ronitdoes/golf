import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { runDraw } from '@/lib/draw-runner';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { drawId, mode, logicType } = body;

    // Authenticate via Bearer token
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Missing authentication token' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }

    // Verify admin role via service client
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single();

    if (!profile?.is_admin) {
      return NextResponse.json({ error: 'Forbidden: admin access required' }, { status: 403 });
    }

    if (!drawId) {
      return NextResponse.json({ error: 'drawId is required' }, { status: 400 });
    }

    const summary = await runDraw(drawId, mode || 'simulation', logicType || 'random');
    return NextResponse.json(summary);

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    console.error('[DRAW_RUN_ERROR]', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
