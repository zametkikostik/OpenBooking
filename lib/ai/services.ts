import { createClient } from '@supabase/supabase-js';
import type { AiGeneratedContent } from '@/types';

/**
 * AI Content Generation Service
 *
 * Generates SEO-optimized content for city pages, district pages, etc.
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export interface GenerateContentParams {
  contentType: 'seo_page' | 'travel_guide' | 'ad_copy' | 'landing_page' | 'description';
  targetType: 'property' | 'city' | 'district' | 'seasonal' | 'general';
  locale: string;
  metadata?: Record<string, unknown>;
}

export interface GeneratedContent {
  title: string;
  content: string;
  metaDescription: string;
  metaKeywords: string[];
  schemaMarkup: Record<string, unknown>;
  openGraph: Record<string, string>;
  qualityScore: number;
  seoScore: number;
}

export class AiContentService {
  /**
   * Generate SEO content for city page
   */
  async generateCityContent(
    city: string,
    country: string,
    locale: string
  ): Promise<GeneratedContent> {
    const content: GeneratedContent = {
      title: `Аренда недвижимости в городе ${city}, ${country} | OpenBooking`,
      content: this.generateCityDescription(city, country),
      metaDescription: `Лучшие предложения аренды в городе ${city}. Бронирование с защитой через Escrow.`,
      metaKeywords: [`аренда ${city}`, `недвижимость ${city}`, `апартаменты ${city}`],
      schemaMarkup: this.generateCitySchema(city, country),
      openGraph: {
        title: `Аренда в ${city}`,
        description: `Найдите идеальное жильё в ${city}`,
        type: 'website',
        locale: locale.replace('_', '-'),
      },
      qualityScore: 0.85,
      seoScore: 92,
    };

    // Save to database
    await this.saveContent({
      content_type: 'seo_page',
      target_type: 'city',
      locale,
      ...content,
      status: 'published',
      published_at: new Date().toISOString(),
    });

    return content;
  }

  /**
   * Get or create content for SEO page
   */
  async getOrCreateContent(params: GenerateContentParams): Promise<GeneratedContent | null> {
    // Try to get existing content
    const { data: existing } = await supabase
      .from('ai_generated_content')
      .select('*')
      .eq('content_type', params.contentType)
      .eq('target_type', params.targetType)
      .eq('locale', params.locale)
      .eq('status', 'published')
      .single();

    if (existing) {
      return {
        title: existing.title || '',
        content: existing.content,
        metaDescription: existing.meta_description || '',
        metaKeywords: existing.meta_keywords || [],
        schemaMarkup: (existing.schema_markup as Record<string, unknown>) || {},
        openGraph: (existing.open_graph as Record<string, string>) || {},
        qualityScore: existing.quality_score || 0.8,
        seoScore: existing.seo_score || 85,
      };
    }

    // Generate new content based on type
    if (params.targetType === 'city' && params.metadata?.city) {
      return this.generateCityContent(
        params.metadata.city as string,
        (params.metadata.country as string) || 'Unknown',
        params.locale
      );
    }

    return null;
  }

  /**
   * Save generated content to database
   */
  private async saveContent(content: Omit<AiGeneratedContent, 'id' | 'created_at' | 'updated_at'>) {
    await supabase.from('ai_generated_content').insert(content);
  }

  /**
   * Generate city description (template-based)
   */
  private generateCityDescription(city: string, country: string): string {
    return `
# Аренда недвижимости в городе ${city}, ${country}

Добро пожаловать в ${city} — один из самых привлекательных городов ${country} для путешествий!

## Почему стоит выбрать ${city}?

${city} предлагает уникальное сочетание культурных достопримечательностей и современной инфраструктуры.

## Популярные районы

- **Центральный район** — сердце города с лучшими ресторанами
- **Исторический квартал** — для любителей архитектуры
- **Прибрежная зона** — идеальный выбор для отдыха

## Бронирование с защитой

OpenBooking обеспечивает полную безопасность ваших средств через Escrow-протокол.
    `.trim();
  }

  /**
   * Generate Schema.org markup for city
   */
  private generateCitySchema(city: string, country: string): Record<string, unknown> {
    return {
      '@context': 'https://schema.org',
      '@type': 'City',
      name: city,
      containedInPlace: {
        '@type': 'Country',
        name: country,
      },
    };
  }
}

// Export singleton instance
export const aiContentService = new AiContentService();
