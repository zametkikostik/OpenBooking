import { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Кабинет клиента | OpenBooking',
  description: 'Личный кабинет клиента',
};

export default function ClientDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">👤 Личный кабинет</h1>
            <p className="text-muted-foreground">Добро пожаловать, Клиент!</p>
          </div>
          <Button asChild variant="outline">
            <Link href="/">← На главную</Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard label="Бронирования" value="3" icon="📅" />
          <StatCard label="Предстоящие" value="1" icon="⏰" />
          <StatCard label="Завершены" value="2" icon="✅" />
          <StatCard label="Бонусы" value="$150" icon="💎" />
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>🔍 Найти жильё</CardTitle>
              <CardDescription>Новые предложения</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/properties">Смотреть</Link>
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>📅 Мои бронирования</CardTitle>
              <CardDescription>Активные и прошлые</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full" variant="outline">
                <Link href="/dashboard/client/bookings">Управление</Link>
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>⚙️ Настройки</CardTitle>
              <CardDescription>Профиль и предпочтения</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full" variant="outline">
                <Link href="/dashboard/client/settings">Изменить</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Bookings */}
        <Card>
          <CardHeader>
            <CardTitle>Последние бронирования</CardTitle>
            <CardDescription>Ваши последние 3 бронирования</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <BookingItem id="BK-001" property="Вилла в Сочи" dates="1-7 Мар 2026" status="payment_locked" />
              <BookingItem id="BK-002" property="Квартира в СПб" dates="25-28 Фев 2026" status="checked_in" />
              <BookingItem id="BK-003" property="Лофт в Москве" dates="10-15 Янв 2026" status="completed" />
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

function BookingItem({ id, property, dates, status }: { id: string; property: string; dates: string; status: string }) {
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
      <div>
        <div className="font-medium">{property}</div>
        <div className="text-sm text-muted-foreground">{id} • {dates}</div>
      </div>
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}>
        {statusLabels[status]}
      </span>
    </div>
  );
}
