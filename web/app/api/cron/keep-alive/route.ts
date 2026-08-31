import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/supabase-admin';

/**
 * Supabase's free tier auto-pauses a project after 7 days with no API
 * activity - the project then needs a manual "restore" click in the
 * dashboard before the site works again. This route just needs to run
 * before that window closes; Vercel Cron (see vercel.json, scheduled daily)
 * is the primary trigger, with .github/workflows/supabase-keep-alive.yml as
 * an independent backup in case a Vercel Cron run is ever missed/disabled -
 * two unrelated schedulers both failing in the same week is what it'd take
 * for the project to actually pause.
 *
 * Never gated behind requireAdminSession - Vercel Cron calls it
 * unauthenticated by default. Instead, when CRON_SECRET is set (in both
 * Vercel's env vars and, for the GitHub Actions backup, as a repo secret),
 * only requests carrying that exact bearer token are served; anyone else
 * gets 401. Works with CRON_SECRET unset too (open endpoint) so this
 * doesn't hard-fail in an environment that hasn't configured it yet - it's
 * only a real DB read either way, nothing destructive.
 */
export async function GET(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  try {
    const admin = getSupabaseAdminClient();
    // Lightest real read against the DB - counts as genuine API activity
    // toward Supabase's inactivity clock, unlike e.g. a static health check
    // that never touches the database at all.
    const { error } = await admin.from('event_types').select('id').limit(1);
    if (error) throw error;

    return NextResponse.json({ ok: true, timestamp: new Date().toISOString() });
  } catch (e) {
    console.error('Supabase keep-alive ping failed:', e);
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
