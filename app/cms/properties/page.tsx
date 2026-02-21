'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Property {
  id: string;
  title: string;
  city: string;
  price: number;
  status: 'active' | 'pending' | 'blocked';
  host: string;
}

const mockProperties: Property[] = [
  { id: '1', title: 'Роскошная вилла с видом на море', city: 'Сочи', price: 15000, status: 'active', host: 'host@openbooking.com' },
  { id: '2', title: 'Уютная квартира в центре', city: 'Санкт-Петербург', price: 7500, status: 'active', host: 'host@openbooking.com' },
  { id: '3', title: 'Современный лофт', city: 'Москва', price: 9000, status: 'pending', host: 'host2@openbooking.com' },
];

export default function PropertiesCMS() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">🏠 Недвижимость</h1>
            <p className="text-muted-foreground">Модерация и управление объектами</p>
          </div>
          <div className="flex gap-4">
            <Button asChild><a href="/dashboard/admin">← Назад</a></Button>
            <Button>+ Добавить объект</Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockProperties.map((property) => (
            <Card key={property.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        property.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {property.status === 'active' ? 'Активен' : 'На модерации'}
                      </span>
                    </div>
                    <CardTitle className="text-lg">{property.title}</CardTitle>
                  </div>
                </div>
                <CardDescription>{property.city}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold">${property.price}</div>
                    <div className="text-xs text-muted-foreground">за ночь</div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Ред.</Button>
                    {property.status === 'pending' ? (
                      <Button size="sm">✓ Одобрить</Button>
                    ) : (
                      <Button variant="destructive" size="sm">Блок</Button>
                    )}
                  </div>
                </div>
                <div className="text-xs text-muted-foreground mt-4">
                  Хост: {property.host}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
