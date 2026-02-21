import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { Property } from '@/types';
import Link from 'next/link';
import Image from 'next/image';

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  return (
    <Link href={`/properties/${property.id}`}>
      <Card className="cursor-pointer overflow-hidden transition-shadow hover:shadow-lg">
        <div className="relative aspect-[4/3] overflow-hidden">
          {property.photos?.[0] ? (
            <Image
              src={property.photos[0]}
              alt={property.title}
              fill
              className="object-cover transition-transform duration-300 hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted">
              <span className="text-4xl">🏠</span>
            </div>
          )}
          {property.instant_book && (
            <div className="absolute right-2 top-2 rounded-full bg-green-500 px-2 py-1 text-xs text-white">
              Мгновенное бронирование
            </div>
          )}
        </div>
        <CardHeader>
          <CardTitle className="text-lg">{property.title}</CardTitle>
          <CardDescription className="flex items-center gap-1">
            <span>📍</span>
            {property.city}, {property.country}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-2xl font-bold">${property.price_per_night}</span>
              <span className="text-sm text-muted-foreground"> / ночь</span>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <span>⭐</span>
              <span className="font-medium">{property.rating.toFixed(2)}</span>
              <span className="text-muted-foreground">({property.review_count})</span>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
            <span>🛏️ {property.bedrooms} спален</span>
            <span>🚿 {property.bathrooms} ванных</span>
            <span>👥 {property.max_guests} гостей</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
