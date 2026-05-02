import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function randomScore() {
  return Math.floor(Math.random() * 45) + 1; // 1–45
}

function randomUnique5(): number[] {
  const set = new Set<number>();
  while (set.size < 5) set.add(randomScore());
  return Array.from(set);
}

async function seed() {
  console.log('\n🌱 Seeding 20 test users with Stableford scores...\n');

  console.log('\n🌱 Seeding 10 test charities...\n');
  
  const charityDocs = [];
  for (let i = 1; i <= 10; i++) {
    charityDocs.push({
      name: `Test Charity Node ${i}`,
      description: `Verified operational test charity entity node ${i} for simulated routing.`,
      website_url: `https://test-node-${i}.org`,
      is_active: true
    });
  }

  const { data: charities, error: charErr } = await supabase.from('charities').insert(charityDocs).select('id');
  if (charErr) {
     console.error('❌ Failed to create charities:', charErr.message);
  }

  const charityIds = charities?.map(c => c.id) ?? [];
  if (charityIds.length === 0) {
    console.warn('⚠️  No charities were created. Users will have no charity assigned.');
  }

  const results: { user: string; scores: number[] }[] = [];

  for (let i = 1; i <= 20; i++) {
    const email = `player_${Date.now()}_${i}@digitalhero.test`;
    const name = `Player ${i}`;

    // 1. Create auth user
    const { data: authData, error: authErr } = await supabase.auth.admin.createUser({
      email,
      password: 'Test1234!',
      email_confirm: true,
    });

    if (authErr) {
      console.error(`❌ Failed to create auth for ${email}:`, authErr.message);
      continue;
    }

    const userId = authData.user.id;
    const charityId = charityIds.length > 0 ? charityIds[(i - 1) % charityIds.length] : null;
    const plan = i % 3 === 0 ? 'yearly' : 'monthly';

    // 2. Upsert profile
    const { error: profileErr } = await supabase.from('profiles').upsert({
      id: userId,
      full_name: name,
      email,
      subscription_status: 'active',
      subscription_plan: plan,
      selected_charity_id: charityId,
      charity_contribution_percentage: 10,
    });

    if (profileErr) {
      console.error(`❌ Profile error for ${email}:`, profileErr.message);
      continue;
    }

    // 3. Insert 5 unique random scores
    const scores = randomUnique5();
    const scoreDocs = scores.map((score, j) => {
      const date = new Date();
      date.setDate(date.getDate() - j);
      return { user_id: userId, score, played_at: date.toISOString().split('T')[0] };
    });

    const { error: scoreErr } = await supabase.from('scores').insert(scoreDocs);
    if (scoreErr) {
      console.error(`❌ Score error for ${email}:`, scoreErr.message);
      continue;
    }

    results.push({ user: email, scores });
    console.log(`✅ ${name.padEnd(10)} | Plan: ${plan.padEnd(7)} | Scores: [${scores.join(', ')}]`);
  }

  console.log(`\n✅ Done — ${results.length}/20 users created.\n`);
  console.log('📋 Score Summary (use these to predict draw matches):');
  console.log('   Drawn numbers come from 1–45. Run a simulation on the Draws page.');
  console.log('   Any user whose 5 scores contain 3+ drawn numbers wins a prize.\n');
}

seed().catch(err => {
  console.error('\n🔥 Seed failed:', err.message);
  process.exit(1);
});
