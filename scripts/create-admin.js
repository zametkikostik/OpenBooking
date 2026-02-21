#!/usr/bin/env node
/**
 * Create Admin User Script
 * Usage: node scripts/create-admin.js
 */

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

async function createAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Error: Missing Supabase credentials in .env.local')
    console.log('\nMake sure your .env.local contains:')
    console.log('NEXT_PUBLIC_SUPABASE_URL=...')
    console.log('SUPABASE_SERVICE_ROLE_KEY=...')
    process.exit(1)
  }

  const supabase = createClient(supabaseUrl, supabaseKey)

  // Admin credentials
  const email = 'admin@openbooking.io'
  const password = 'Admin@123456'
  const fullName = 'OpenBooking Admin'

  console.log('🔐 Creating admin user...')
  console.log(`Email: ${email}`)
  console.log(`Password: ${password}`)
  console.log('')

  try {
    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: fullName,
        role: 'admin'
      }
    })

    if (authError) throw authError

    // Create profile
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        email,
        full_name: fullName,
        role: 'admin',
        language: 'en',
        kyc_verified: true
      })

    if (profileError) throw profileError

    console.log('✅ Admin user created successfully!')
    console.log('')
    console.log('📋 Login credentials:')
    console.log('   Email: admin@openbooking.io')
    console.log('   Password: Admin@123456')
    console.log('')
    console.log('🌐 Login at: http://localhost:3000/auth/signin')

  } catch (error) {
    if (error.message.includes('User already registered')) {
      console.log('⚠️  Admin user already exists!')
      console.log('')
      console.log('📋 Login credentials:')
      console.log('   Email: admin@openbooking.io')
      console.log('   Password: Admin@123456')
      console.log('')
      console.log('🌐 Login at: http://localhost:3000/auth/signin')
    } else {
      console.error('❌ Error creating admin user:', error.message)
      process.exit(1)
    }
  }
}

createAdmin()
