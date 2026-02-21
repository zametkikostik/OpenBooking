import { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Бронирования | Host Dashboard',
  description: 'Бронирования объектов арендодателя',
};

const mockBookings = [
  { id: 'BK-101', guest: 'Иван Иванов', property: 'Вилла в Сочи', checkIn: '2026-03-01', checkOut: '2026-03-07', status: 'payment_locked', amount: 105000 },
  { id: 'BK-102', guest: 'Петр Петров', property: 'Квартира в СПб', checkIn: '2026-02-25', checkOut: '2026-02-28', status: 'checked_in', amount: 22500 },
  { id: 'BK-103', guest: 'Анна Сидорова', property: 'Лофт в Москве', checkIn: '2026-01-10', checkOut: '2026-01-15', status: 'completed', amount: 45000 },
];

export default function HostBookingsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">📅 Бронирования объектов</h1>
            <p className="text-muted-foreground">Управление бронированиями ваших объектов</p>
          </div>
          <Button asChild>
            <Link href="/dashboard/host">← В кабинет</Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard label="Всего" value="12" />
          <StatCard label="Активные" value="5" />
          <StatCard label="Доход" value="$45K" />
          <StatCard label="Рейтинг" value="4.8" />
        </div>

        {/* Bookings List */}
        <Card>
          <CardHeader>
            <CardTitle>Все бронирования</CardTitle>
            <CardDescription>12 бронирований</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockBookings.map((booking) => (
                <BookingItem key={booking.id} booking={booking} />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="text-2xl font-bold">{value}</div>
        <div className="text-sm text-muted-foreground">{label}</div>
      </CardContent>
    </Card>
  );
}

function BookingItem({ booking }: { booking: any }) {
  const statusColors: Record<string, string> = {
    payment_locked: 'bg-blue-100 text-blue-800',
    checked_in: 'bg-purple-100 text-purple-800',
    completed: 'bg-green-100 text-green-800',
  };
  const statusLabels: Record<string, string> = {
    payment_locked: 'Оплачено',
    checked_in: 'Заселено',
    completed: 'Завершено',
  };

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div className="flex-1">
        <div className="font-semibold text-lg">{booking.property}</div>
        <div className="text-sm text-muted-foreground">
          {booking.id} • Гость: {booking.guest}
        </div>
        <div className="text-sm text-muted-foreground">
          {booking.checkIn} → {booking.checkOut} • ${booking.amount.toLocaleString()}
        </div>
      </div>
      <div className="flex items-center gap-4">
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[booking.status]}`}>
          {statusLabels[booking.status]}
        </span>
        <Button size="sm" variant="outline">Управление</Button>
      </div>
    </div>
  );
}
