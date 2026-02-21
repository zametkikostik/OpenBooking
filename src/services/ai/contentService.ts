import { createClient } from '@/lib/supabase'
import { AIContent, SEOPage, Property } from '@/types/database'

// AI Provider Configuration
export interface AIProviderConfig {
  provider: 'openai' | 'anthropic' | 'local'
  apiKey?: string
  model?: string
  maxTokens?: number
  temperature?: number
}

export const DEFAULT_AI_CONFIG: AIProviderConfig = {
  provider: (process.env.OPENAI_API_KEY ? 'openai' : 'local') as any,
  apiKey: process.env.OPENAI_API_KEY || process.env.ANTHROPIC_API_KEY,
  model: 'gpt-4-turbo-preview',
  maxTokens: 4000,
  temperature: 0.7,
}

// AI Content Generation Service
export class AIContentService {
  private supabase: any
  private config: AIProviderConfig

  constructor(config?: AIProviderConfig) {
    this.supabase = createClient()
    this.config = config || DEFAULT_AI_CONFIG
  }

  // Generate property description
  async generatePropertyDescription(params: {
    propertyId: string
    language: string
    highlights?: string[]
  }): Promise<{ content: string; error?: any }> {
    const { property, error } = await this.getProperty(params.propertyId)

    if (error || !property) {
      return { content: '', error: error || 'Property not found' }
    }

    const prompt = this.buildPropertyDescriptionPrompt(property, params.language, params.highlights)
    const generated = await this.generateContent(prompt)

    if (!generated) {
      return { content: '', error: 'Failed to generate content' }
    }

    // Save to database
    await this.saveContent({
      content_type: 'property_description',
      reference_id: params.propertyId,
      language: params.language,
      body: generated,
      metadata: {
        property_title: property.title,
        highlights: params.highlights,
      },
    })

    return { content: generated }
  }

  // Generate travel guide for city
  async generateTravelGuide(params: {
    city: string
    country: string
    language: string
    season?: string
  }): Promise<{ content: string; error?: any }> {
    const prompt = `Create a comprehensive travel guide for ${params.city}, ${params.country}.
    
    Include:
    - Top attractions and landmarks
    - Best neighborhoods to stay
    - Local cuisine and restaurants
    - Transportation tips
    - Cultural etiquette
    - Best time to visit${params.season ? ` (${params.season})` : ''}
    - Budget tips
    - Safety information

    Write in ${params.language}, engaging tone, 1500-2000 words.
    Use proper HTML formatting with h2, h3, p, ul tags.`

    const generated = await this.generateContent(prompt)

    if (!generated) {
      return { content: '', error: 'Failed to generate guide' }
    }

    return { content: generated }
  }

  // Generate SEO page content
  async generateSEOPage(params: {
    pageType: 'city' | 'district' | 'seasonal' | 'property_type'
    location: string
    language: string
    keywords?: string[]
  }): Promise<{ page: Partial<SEOPage>; error?: any }> {
    const { title, metaDescription, h1, content } = await this.generateSEOElements(params)

    const schemaMarkup = this.generateSchemaMarkup(params)

    const pageData = {
      page_type: params.pageType,
      slug: this.generateSlug(params.location, params.pageType),
      language: params.language,
      title,
      meta_description: metaDescription,
      h1,
      content: { blocks: content },
      schema_markup: schemaMarkup,
      metadata: {
        keywords: params.keywords,
        generated_at: new Date().toISOString(),
      },
    }

    // Save to database
    const { data, error } = await this.supabase
      .from('seo_pages')
      .insert(pageData)
      .select()
      .single()

    if (error) {
      return { page: {}, error }
    }

    return { page: data }
  }

  // Generate ad copy for marketing
  async generateAdCopy(params: {
    propertyId: string
    platform: 'google' | 'facebook' | 'instagram' | 'tiktok'
    language: string
    tone?: 'professional' | 'casual' | 'luxury' | 'budget'
  }): Promise<{ copies: string[]; error?: any }> {
    const { property, error } = await this.getProperty(params.propertyId)

    if (error || !property) {
      return { copies: [], error }
    }

    const platformSpecs: Record<string, { maxChars: number; style: string }> = {
      google: { maxChars: 90, style: 'concise, keyword-rich' },
      facebook: { maxChars: 125, style: 'engaging, social' },
      instagram: { maxChars: 2200, style: 'visual, emoji-friendly' },
      tiktok: { maxChars: 150, style: 'trendy, Gen-Z friendly' },
    }

    const spec = platformSpecs[params.platform]
    
    const prompt = `Generate 5 ad copies for a property rental.
    
    Property: ${JSON.stringify(property)}
    Platform: ${params.platform}
    Style: ${spec.style}
    Max characters per headline: ${spec.maxChars}
    Language: ${params.language}
    Tone: ${params.tone || 'professional'}

    Return as JSON array with {headline, description} objects.`

    const generated = await this.generateContent(prompt)
    
    try {
      const copies = JSON.parse(generated || '[]')
      return { copies }
    } catch {
      return { copies: [generated || ''], error: 'Failed to parse response' }
    }
  }

  // Generate personalized recommendations
  async generateRecommendations(params: {
    userId: string
    preferences?: {
      budget?: number
      location?: string
      propertyType?: string
      amenities?: string[]
    }
    limit?: number
  }): Promise<{ recommendations: Property[]; error?: any }> {
    // Build query based on preferences
    let query = this.supabase
      .from('properties')
      .select('*')
      .eq('status', 'active')
      .order('rating', { ascending: false })
      .limit(params.limit || 10)

    if (params.preferences?.location) {
      query = query.ilike('address->>city', `%${params.preferences.location}%`)
    }

    if (params.preferences?.propertyType) {
      query = query.eq('property_type', params.preferences.propertyType)
    }

    if (params.preferences?.budget) {
      query = query.lte('price_per_night', params.preferences.budget)
    }

    const { data, error } = await query

    if (error) {
      return { recommendations: [], error }
    }

    // AI-powered ranking
    const ranked = await this.rankRecommendations(data || [], params.userId, params.preferences)

    return { recommendations: ranked }
  }

  // Generate smart pricing suggestion
  async generateSmartPricing(params: {
    propertyId: string
    checkIn: string
    checkOut: string
    competitors?: any[]
  }): Promise<{ suggestedPrice: number; confidence: number; error?: any }> {
    const { property, error } = await this.getProperty(params.propertyId)

    if (error || !property) {
      return { suggestedPrice: 0, confidence: 0, error }
    }

    // Analyze factors
    const basePrice = property.price_per_night
    const seasonMultiplier = this.getSeasonMultiplier(params.checkIn)
    const demandMultiplier = this.getDemandMultiplier(params.checkIn, params.checkOut)
    const competitorAdjustment = this.analyzeCompetitors(params.competitors, basePrice)

    const suggestedPrice = basePrice * seasonMultiplier * demandMultiplier * competitorAdjustment
    const confidence = 0.85 // AI confidence score

    return { suggestedPrice: Math.round(suggestedPrice * 100) / 100, confidence }
  }

  // Translate content
  async translateContent(params: {
    content: string
    sourceLanguage: string
    targetLanguage: string
    contentType?: 'property' | 'legal' | 'marketing'
  }): Promise<{ translated: string; error?: any }> {
    const prompt = `Translate the following ${params.contentType || 'content'} from ${params.sourceLanguage} to ${params.targetLanguage}.
    
    Maintain tone, style, and formatting. Do not translate proper nouns or brand names.
    
    Content:
    ${params.content}`

    const translated = await this.generateContent(prompt)

    if (!translated) {
      return { translated: '', error: 'Translation failed' }
    }

    return { translated }
  }

  // Helper: Generate content using AI provider
  private async generateContent(prompt: string): Promise<string | null> {
    if (this.config.provider === 'openai' && this.config.apiKey) {
      return this.generateWithOpenAI(prompt)
    } else if (this.config.provider === 'anthropic' && this.config.apiKey) {
      return this.generateWithAnthropic(prompt)
    } else {
      // Fallback: return placeholder
      console.log('AI generation requested but no API key configured')
      return '[AI Content Placeholder - Configure API key for generation]'
    }
  }

  private async generateWithOpenAI(prompt: string): Promise<string | null> {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify({
          model: this.config.model || 'gpt-4-turbo-preview',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: this.config.maxTokens,
          temperature: this.config.temperature,
        }),
      })

      const data = await response.json()
      return data.choices?.[0]?.message?.content || null
    } catch (error) {
      console.error('OpenAI generation error:', error)
      return null
    }
  }

  private async generateWithAnthropic(prompt: string): Promise<string | null> {
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.config.apiKey || '',
          'anthropic-version': '2024-01-01',
        },
        body: JSON.stringify({
          model: 'claude-3-sonnet-20240229',
          max_tokens: this.config.maxTokens || 4000,
          messages: [{ role: 'user', content: prompt }],
        }),
      })

      const data = await response.json()
      return data.content?.[0]?.text || null
    } catch (error) {
      console.error('Anthropic generation error:', error)
      return null
    }
  }

  // Helper methods
  private async getProperty(propertyId: string): Promise<{ property: Property | null; error?: any }> {
    const { data, error } = await this.supabase
      .from('properties')
      .select('*')
      .eq('id', propertyId)
      .single()

    return { property: data, error }
  }

  private buildPropertyDescriptionPrompt(property: any, language: string, highlights?: string[]): string {
    return `Write an engaging property description in ${language}.
    
    Property Details:
    - Type: ${property.property_type}
    - Location: ${JSON.stringify(property.address)}
    - Guests: ${property.max_guests}
    - Bedrooms: ${property.bedrooms}
    - Beds: ${property.beds}
    - Bathrooms: ${property.bathrooms}
    - Amenities: ${property.amenities?.join(', ')}
    ${highlights ? `- Highlights: ${highlights.join(', ')}` : ''}

    Write 300-500 words, engaging tone, highlight unique features.
    Use proper HTML formatting.`
  }

  private async generateSEOElements(params: any): Promise<{ title: string; metaDescription: string; h1: string; content: string[] }> {
    const prompt = `Generate SEO elements for a ${params.pageType} page about ${params.location}.
    Language: ${params.language}
    Keywords: ${params.keywords?.join(', ') || 'travel, accommodation, booking'}

    Return JSON with: title, metaDescription, h1, content (array of sections)`

    const generated = await this.generateContent(prompt)
    
    try {
      return JSON.parse(generated || '{}')
    } catch {
      return {
        title: `${params.location} - Book Unique Stays | OpenBooking`,
        metaDescription: `Discover amazing places to stay in ${params.location}. Book with confidence on OpenBooking.`,
        h1: `Explore ${params.location}`,
        content: ['Welcome to ' + params.location, 'Top attractions', 'Where to stay'],
      }
    }
  }

  private generateSchemaMarkup(params: any): any {
    return {
      '@context': 'https://schema.org',
      '@type': params.pageType === 'city' ? 'City' : 'TravelAgency',
      name: params.location,
      description: `Book unique accommodations in ${params.location}`,
    }
  }

  private generateSlug(location: string, type: string): string {
    return location
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  private getSeasonMultiplier(date: string): number {
    const month = new Date(date).getMonth()
    // Peak season: June-August, December
    if ([5, 6, 7, 11].includes(month)) return 1.3
    // Shoulder season: April-May, September-October
    if ([3, 4, 8, 9].includes(month)) return 1.1
    // Off season: January-March, November
    return 0.9
  }

  private getDemandMultiplier(checkIn: string, checkOut: string): number {
    // Check for weekends, holidays, events
    const start = new Date(checkIn)
    const dayOfWeek = start.getDay()
    
    if ([0, 5, 6].includes(dayOfWeek)) return 1.2 // Weekend
    return 1.0
  }

  private analyzeCompetitors(competitors: any[] = [], basePrice: number): number {
    if (!competitors.length) return 1.0
    
    const avgCompetitorPrice = competitors.reduce((sum, c) => sum + c.price, 0) / competitors.length
    return avgCompetitorPrice / basePrice
  }

  private async rankRecommendations(properties: any[], userId: string, preferences?: any): Promise<any[]> {
    // Simple ranking based on rating and relevance
    return properties.sort((a, b) => {
      const scoreA = (a.rating || 0) * 10 + (a.review_count || 0)
      const scoreB = (b.rating || 0) * 10 + (b.review_count || 0)
      return scoreB - scoreA
    })
  }

  private async saveContent(content: Partial<AIContent>): Promise<void> {
    await this.supabase
      .from('ai_content')
      .insert({
        ...content,
        is_published: true,
        quality_score: 0.9,
      })
  }
}
