#!/usr/bin/env node
/**
 * OPENBOOKING DATABASE SEED SCRIPT
 * Populates local database with sample data
 */

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321'
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'local-key'

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

async function seed() {
  console.log('🌱 Starting database seed...')
  
  // Seed sample properties
  await seedProperties()
  
  // Seed SEO pages
  await seedSEOPages()
  
  // Seed legal documents
  await seedLegalDocuments()
  
  console.log('✅ Database seeded successfully!')
}

async function seedProperties() {
  console.log('📍 Seeding properties...')
  
  const properties = [
    {
      title: 'Modern Apartment in Moscow Center',
      description: 'Stylish apartment in the heart of Moscow with stunning city views.',
      property_type: 'apartment',
      country: 'Russia',
      city: 'Moscow',
      district: 'Tverskoy',
      base_price: 150,
      guests: 4,
      bedrooms: 2,
      beds: 2,
      bathrooms: 1,
      amenities: ['WiFi', 'Kitchen', 'Air conditioning', 'Washer'],
      status: 'active'
    },
    {
      title: 'Cozy Studio in Saint Petersburg',
      description: 'Charming studio near Hermitage Museum.',
      property_type: 'apartment',
      country: 'Russia',
      city: 'Saint Petersburg',
      base_price: 80,
      guests: 2,
      bedrooms: 1,
      beds: 1,
      bathrooms: 1,
      amenities: ['WiFi', 'Kitchen', 'Heating'],
      status: 'active'
    },
    {
      title: 'Luxury Villa in Sofia',
      description: 'Beautiful villa with pool and garden.',
      property_type: 'villa',
      country: 'Bulgaria',
      city: 'Sofia',
      base_price: 250,
      guests: 8,
      bedrooms: 4,
      beds: 5,
      bathrooms: 3,
      amenities: ['WiFi', 'Pool', 'Garden', 'Parking', 'BBQ'],
      status: 'active'
    },
    {
      title: 'Berlin Loft',
      description: 'Industrial loft in trendy Kreuzberg.',
      property_type: 'apartment',
      country: 'Germany',
      city: 'Berlin',
      base_price: 120,
      guests: 3,
      bedrooms: 1,
      beds: 2,
      bathrooms: 1,
      amenities: ['WiFi', 'Kitchen', 'Workspace'],
      status: 'active'
    },
    {
      title: 'Paris Studio near Eiffel Tower',
      description: 'Romantic studio with Eiffel Tower view.',
      property_type: 'apartment',
      country: 'France',
      city: 'Paris',
      base_price: 200,
      guests: 2,
      bedrooms: 1,
      beds: 1,
      bathrooms: 1,
      amenities: ['WiFi', 'Kitchen', 'Balcony'],
      status: 'active'
    },
    {
      title: 'Barcelona Beach Apartment',
      description: 'Modern apartment steps from the beach.',
      property_type: 'apartment',
      country: 'Spain',
      city: 'Barcelona',
      base_price: 140,
      guests: 4,
      bedrooms: 2,
      beds: 3,
      bathrooms: 2,
      amenities: ['WiFi', 'Beach access', 'Air conditioning'],
      status: 'active'
    }
  ]
  
  for (const prop of properties) {
    const { error } = await supabase
      .from('properties')
      .insert(prop)
    
    if (error) {
      console.error(`Error inserting ${prop.title}:`, error.message)
    } else {
      console.log(`  ✓ ${prop.title}`)
    }
  }
}

async function seedSEOPages() {
  console.log('📄 Seeding SEO pages...')
  
  const cities = [
    { city: 'Moscow', country: 'Russia' },
    { city: 'Saint Petersburg', country: 'Russia' },
    { city: 'Sofia', country: 'Bulgaria' },
    { city: 'Berlin', country: 'Germany' },
    { city: 'Paris', country: 'France' },
    { city: 'Barcelona', country: 'Spain' },
  ]
  
  for (const { city, country } of cities) {
    const slug = `${country.toLowerCase()}-${city.toLowerCase()}`.replace(/ /g, '-')
    
    const { error } = await supabase
      .from('seo_pages')
      .insert({
        slug,
        path: `/destinations/${slug}`,
        title: `Apartments and Stays in ${city}, ${country}`,
        meta_title: `${city} Apartments | Best Prices | OpenBooking`,
        meta_description: `Book unique apartments in ${city}, ${country}. Verified properties, best prices.`,
        language: 'en',
        target_city: city,
        target_country: country,
        status: 'published',
        published_at: new Date().toISOString()
      })
    
    if (error) {
      console.error(`Error inserting SEO page for ${city}:`, error.message)
    } else {
      console.log(`  ✓ ${city}, ${country}`)
    }
  }
}

async function seedLegalDocuments() {
  console.log('📜 Seeding legal documents...')
  
  const documents = [
    {
      doc_type: 'terms_of_service',
      version: '1.0.0',
      language: 'en',
      title: 'Terms of Service',
      status: 'active',
      is_required: true,
      acceptance_required_for: ['client', 'host']
    },
    {
      doc_type: 'privacy_policy',
      version: '1.0.0',
      language: 'en',
      title: 'Privacy Policy',
      status: 'active',
      is_required: true,
      acceptance_required_for: ['client', 'host']
    },
    {
      doc_type: 'host_agreement',
      version: '1.0.0',
      language: 'en',
      title: 'Host Agreement',
      status: 'active',
      is_required: true,
      acceptance_required_for: ['host']
    },
    {
      doc_type: 'guest_agreement',
      version: '1.0.0',
      language: 'en',
      title: 'Guest Agreement',
      status: 'active',
      is_required: true,
      acceptance_required_for: ['client']
    }
  ]
  
  for (const doc of documents) {
    const { error } = await supabase
      .from('legal_documents')
      .insert(doc)
    
    if (error) {
      console.error(`Error inserting ${doc.title}:`, error.message)
    } else {
      console.log(`  ✓ ${doc.title}`)
    }
  }
}

// Run seed
seed().catch(console.error)
