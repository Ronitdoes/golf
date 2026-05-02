import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function createAdmin() {
  const email = process.env.ADMIN_EMAIL || 'admin@example.com';
  const password = process.env.ADMIN_PASSWORD || 'admin-password-123';

  console.log(`Creating admin user: ${email}`);

  const { data: authData, error: authErr } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (authErr) {
    if (authErr.message.includes('already been registered')) {
       console.log('Admin user already exists in auth.users.');
       // Still try to ensure they are admin in profile
    } else {
       console.error('❌ Failed to create auth user:', authErr.message);
       process.exit(1);
    }
  }

  // We should make sure the profile has is_admin true
  const { data: user } = await supabase.from('profiles').select('id').eq('email', email).single();
  let userId = authData?.user?.id;
  
  if (!userId && user) {
     userId = user.id;
  } else if (!userId) {
     // Fetch from auth
     const { data: authUsers } = await supabase.auth.admin.listUsers();
     const existingUser = authUsers.users.find(u => u.email === email);
     if (existingUser) userId = existingUser.id;
  }

  if (userId) {
     const { error: profileErr } = await supabase.from('profiles').upsert({
        id: userId,
        email,
        full_name: 'System Admin',
        is_admin: true,
        subscription_status: 'active'
     });

     if (profileErr) {
        console.error('❌ Failed to update admin profile:', profileErr.message);
     } else {
        console.log('✅ Admin profile successfully configured!');
     }
  } else {
     console.error('❌ Could not determine user ID.');
  }
}

createAdmin().catch(console.error);
