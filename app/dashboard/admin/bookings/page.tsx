import { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Бронирования | OpenBooking Admin',
  description: 'Управление бронированиями',
};

const mockBookings = [
  { id: '1', guest: 'Иван Иванов', property: 'Вилла в Сочи', checkIn: '2026-03-01', checkOut: '2026-03-07', status: 'payment_locked', amount: 105000 },
  { id: '2', guest: 'Петр Петров', property: 'Квартира в СПб', checkIn: '2026-02-25', checkOut: '2026-02-28', status: 'checked_in', amount: 22500 },
  { id: '3', guest: 'Анна Сидорова', property: 'Лофт в Москве', checkIn: '2026-03-10', checkOut: '2026-03-15', status: 'pending', amount: 45000 },
];

export default function AdminBookingsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">📅 Бронирования</h1>
            <p className="text-muted-foreground">Управление всеми бронированиями платформы</p>
          </div>
          <Button asChild>
            <Link href="/dashboard/admin">← Назад в админку</Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard label="Всего" value="47" color="bg-blue-600" />
          <StatCard label="Ожидают" value="12" color="bg-yellow-600" />
          <StatCard label="Оплачено" value="23" color="bg-green-600" />
          <StatCard label="Заселено" value="12" color="bg-purple-600" />
        </div>

        {/* Bookings Table */}
        <Card>
          <CardHeader>
            <CardTitle>Все бронирования</CardTitle>
            <CardDescription>Последние 50 бронирований</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">ID</th>
                    <th className="text-left py-3 px-4">Гость</th>
                    <th className="text-left py-3 px-4">Объект</th>
                    <th className="text-left py-3 px-4">Заезд</th>
                    <th className="text-left py-3 px-4">Выезд</th>
                    <th className="text-left py-3 px-4">Статус</th>
                    <th className="text-left py-3 px-4">Сумма</th>
                    <th className="text-left py-3 px-4">Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {mockBookings.map((booking) => (
                    <tr key={booking.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4 font-mono text-xs">{booking.id}</td>
                      <td className="py-3 px-4">{booking.guest}</td>
                      <td className="py-3 px-4">{booking.property}</td>
                      <td className="py-3 px-4">{booking.checkIn}</td>
                      <td className="py-3 px-4">{booking.checkOut}</td>
                      <td className="py-3 px-4">
                        <StatusBadge status={booking.status} />
                      </td>
                      <td className="py-3 px-4 font-medium">${booking.amount.toLocaleString()}</td>
                      <td className="py-3 px-4">
                        <Button size="sm" variant="outline">Детали</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${color}`} />
          <div>
            <div className="text-2xl font-bold">{value}</div>
            <div className="text-sm text-muted-foreground">{label}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function StatusBadge({ status }: { status: string }) {
  const statuses: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    payment_locked: 'bg-blue-100 text-blue-800',
    checked_in: 'bg-purple-100 text-purple-800',
    completed: 'bg-green-100 text-green-800',
    settled: 'bg-gray-100 text-gray-800',
  };
  
  const labels: Record<string, string> = {
    pending: 'Ожидает',
    payment_locked: 'Оплачено',
    checked_in: 'Заселено',
    completed: 'Завершено',
    settled: 'Расчёт',
  };

  return (
    <span className={`px-2 py-1 rounded text-xs font-medium ${statuses[status] || statuses.pending}`}>
      {labels[status] || status}
    </span>
  );
}
