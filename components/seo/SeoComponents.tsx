'use client';

import Script from 'next/script';

interface SchemaMarkupProps {
  schema: Record<string, unknown>;
}

export function SchemaMarkup({ schema }: SchemaMarkupProps) {
  return (
    <Script
      id="schema-markup"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      strategy="afterInteractive"
    />
  );
}

interface OpenGraphTagsProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: string;
  locale?: string;
}

export function OpenGraphTags({
  title,
  description,
  image = '/og-default.jpg',
  url,
  type = 'website',
  locale = 'ru_RU',
}: OpenGraphTagsProps) {
  const fullUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  const imageUrl = image.startsWith('http')
    ? image
    : `${process.env.NEXT_PUBLIC_APP_URL || ''}${image}`;

  return (
    <>
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:locale" content={locale} />
      {imageUrl && <meta property="og:image" content={imageUrl} />}
      {fullUrl && <meta property="og:url" content={fullUrl} />}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {imageUrl && <meta name="twitter:image" content={imageUrl} />}
    </>
  );
}

interface SeoMetadataProps {
  title: string;
  description: string;
  keywords?: string[];
  canonical?: string;
  noindex?: boolean;
  nofollow?: boolean;
}

export function SeoMetadata({
  title,
  description,
  keywords = [],
  canonical,
  noindex = false,
  nofollow = false,
}: SeoMetadataProps) {
  const robotsContent = [noindex ? 'noindex' : 'index', nofollow ? 'nofollow' : 'follow'].join(
    ', '
  );

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords.length > 0 && <meta name="keywords" content={keywords.join(', ')} />}
      <meta name="robots" content={robotsContent} />
      <link rel="canonical" href={canonical || ''} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </>
  );
}

interface Breadcrumb {
  name: string;
  url: string;
}

interface BreadcrumbSchemaProps {
  breadcrumbs: Breadcrumb[];
}

export function BreadcrumbSchema({ breadcrumbs }: BreadcrumbSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((breadcrumb, index) => ({
      '@type': 'ListItem' as const,
      position: index + 1,
      name: breadcrumb.name,
      item: breadcrumb.url,
    })),
  };

  return <SchemaMarkup schema={schema} />;
}

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSchemaProps {
  faqs: FAQItem[];
}

export function FAQSchema({ faqs }: FAQSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question' as const,
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer' as const,
        text: faq.answer,
      },
    })),
  };

  return <SchemaMarkup schema={schema} />;
}

interface ProductSchemaProps {
  name: string;
  description: string;
  price: number;
  currency: string;
  image?: string;
  rating?: number;
  reviewCount?: number;
}

export function ProductSchema({
  name,
  description,
  price,
  currency,
  image,
  rating,
  reviewCount,
}: ProductSchemaProps) {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    offers: {
      '@type': 'Offer',
      price,
      priceCurrency: currency,
      availability: 'https://schema.org/InStock',
    },
  };

  if (image) {
    schema.image = image;
  }

  if (rating && reviewCount) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: rating,
      reviewCount,
    };
  }

  return <SchemaMarkup schema={schema} />;
}

interface LocalBusinessSchemaProps {
  name: string;
  address: string;
  phone: string;
  openingHours?: string;
  priceRange?: string;
}

export function LocalBusinessSchema({
  name,
  address,
  phone,
  openingHours = 'Mo-Su 00:00-23:59',
  priceRange = '$$',
}: LocalBusinessSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name,
    address: {
      '@type': 'PostalAddress',
      streetAddress: address,
    },
    telephone: phone,
    openingHours,
    priceRange,
  };

  return <SchemaMarkup schema={schema} />;
}
