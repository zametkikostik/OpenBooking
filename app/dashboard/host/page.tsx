import { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Кабинет арендодателя | OpenBooking',
  description: 'Панель управления арендодателя',
};

export default function HostDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">🏠 Кабинет арендодателя</h1>
            <p className="text-muted-foreground">Добро пожаловать, Хост!</p>
          </div>
          <Button asChild variant="outline">
            <Link href="/">← На главную</Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard label="Объекты" value="6" icon="🏢" />
          <StatCard label="Бронирования" value="12" icon="📅" />
          <StatCard label="Доход" value="$45K" icon="💰" />
          <StatCard label="Рейтинг" value="4.8" icon="⭐" />
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>➕ Добавить объект</CardTitle>
              <CardDescription>Новая недвижимость</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/cms/properties">Создать</Link>
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>📅 Календарь</CardTitle>
              <CardDescription>Бронирования и доступность</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full" variant="outline">
                <Link href="/dashboard/host/bookings">Открыть</Link>
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>💳 Выплаты</CardTitle>
              <CardDescription>История и настройки</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full" variant="outline">
                <Link href="/dashboard/host/settings">Открыть</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Properties */}
        <Card>
          <CardHeader>
            <CardTitle>Мои объекты</CardTitle>
            <CardDescription>6 активных объектов</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <PropertyCard name="Вилла в Сочи" city="Сочи" price="$15,000/ночь" rating="4.9" bookings="24" />
              <PropertyCard name="Квартира в СПб" city="Санкт-Петербург" price="$7,500/ночь" rating="4.7" bookings="18" />
              <PropertyCard name="Лофт в Москве" city="Москва" price="$9,000/ночь" rating="4.8" bookings="32" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{icon}</span>
          <div>
            <div className="text-2xl font-bold">{value}</div>
            <div className="text-sm text-muted-foreground">{label}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function PropertyCard({ name, city, price, rating, bookings }: { name: string; city: string; price: string; rating: string; bookings: string }) {
  return (
    <div className="p-4 border rounded-lg space-y-2">
      <div className="font-semibold">{name}</div>
      <div className="text-sm text-muted-foreground">📍 {city}</div>
      <div className="flex items-center justify-between">
        <div className="text-lg font-bold">{price}</div>
        <div className="text-sm">⭐ {rating} • {bookings} брон.</div>
      </div>
      <div className="flex gap-2 pt-2">
        <Button size="sm" variant="outline">Ред.</Button>
        <Button size="sm">Статистика</Button>
      </div>
    </div>
  );
}
