import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

async function createAdmin() {
  const email = 'admin@digitalhero.com'
  const password = 'GolfAdmin2024!'

  console.log(`Creating admin: ${email}...`)

  // 1. Create the user in Auth
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true
  })

  if (authError) {
    if (authError.message.includes('already exists')) {
      console.log('User already exists in Auth, updating role in profile...')
    } else {
      console.error('Error creating auth user:', authError.message)
      return
    }
  }

  const userId = authData.user?.id

  if (!userId) {
    // If user exists, find it
    const { data: userData } = await supabase.from('profiles').select('id').eq('email', email).single()
    if (!userData) {
      console.error('Could not find user ID.')
      return
    }
  }

  // 2. Set the role to 'admin' in profiles
  const { error: profileError } = await supabase
    .from('profiles')
    .update({ is_admin: true })
    .match({ email })

  if (profileError) {
    console.error('Error elevating profile to admin:', profileError.message)
    // If profile doesn't exist, try creating it (though usually handled by trigger)
    const { error: insertError } = await supabase
      .from('profiles')
      .upsert({ id: userId || 'some-id', email, is_admin: true })
    
    if (insertError) console.error('Upsert failed:', insertError.message)
  }

  console.log('Admin account initialized successfully.')
  console.log('Email:', email)
  console.log('Password:', password)
}

createAdmin()
