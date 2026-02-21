'use client';

import { useState, useEffect } from 'react';
import { PropertyCard } from '@/components/property/PropertyCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import type { Property } from '@/types';
import { createClient } from '@/lib/supabase/client';

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    city: '',
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
  });

  useEffect(() => {
    loadProperties();
  }, []);

  async function loadProperties() {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProperties(data || []);
    } catch (error) {
      console.error('Error loading properties:', error);
    } finally {
      setLoading(false);
    }
  }

  const filteredProperties = properties.filter((property) => {
    const matchesSearch =
      property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.city.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCity = !filters.city || property.city === filters.city;
    const matchesMinPrice =
      !filters.minPrice || property.price_per_night >= Number(filters.minPrice);
    const matchesMaxPrice =
      !filters.maxPrice || property.price_per_night <= Number(filters.maxPrice);
    const matchesBedrooms = !filters.bedrooms || property.bedrooms >= Number(filters.bedrooms);

    return matchesSearch && matchesCity && matchesMinPrice && matchesMaxPrice && matchesBedrooms;
  });

  const cities = Array.from(new Set(properties.map((p) => p.city)));

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto space-y-8 px-4 py-12">
        {/* Header */}
        <div className="space-y-4 text-center">
          <h1 className="text-4xl font-bold">Недвижимость</h1>
          <p className="text-xl text-muted-foreground">
            Найдите идеальное место для вашего путешествия
          </p>
        </div>

        {/* Search & Filters */}
        <div className="space-y-4 rounded-lg bg-card p-6 shadow-md">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <Input
                type="text"
                placeholder="Поиск по названию или городу..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div>
              <select
                value={filters.city}
                onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                className="w-full rounded-md border bg-background px-3 py-2"
              >
                <option value="">Все города</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Input
                type="number"
                placeholder="Мин. цена"
                value={filters.minPrice}
                onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
              />
            </div>
            <div>
              <Input
                type="number"
                placeholder="Макс. цена"
                value={filters.maxPrice}
                onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
              />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Спальни"
                value={filters.bedrooms}
                onChange={(e) => setFilters({ ...filters, bedrooms: e.target.value })}
                className="w-32"
              />
            </div>
            <Button
              onClick={() => setFilters({ city: '', minPrice: '', maxPrice: '', bedrooms: '' })}
              variant="outline"
            >
              Сбросить фильтры
            </Button>
          </div>
        </div>

        {/* Results Count */}
        <div className="text-muted-foreground">Найдено: {filteredProperties.length} объектов</div>

        {/* Properties Grid */}
        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="overflow-hidden rounded-lg bg-card">
                <div className="aspect-[4/3] animate-pulse bg-muted" />
                <div className="space-y-2 p-4">
                  <div className="h-4 animate-pulse rounded bg-muted" />
                  <div className="h-3 w-2/3 animate-pulse rounded bg-muted" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredProperties.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="py-12 text-center">
            <div className="mb-4 text-6xl">🏠</div>
            <h3 className="mb-2 text-xl font-semibold">Ничего не найдено</h3>
            <p className="text-muted-foreground">Попробуйте изменить параметры поиска</p>
          </div>
        )}
      </div>
    </main>
  );
}
