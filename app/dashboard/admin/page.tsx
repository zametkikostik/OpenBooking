import { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Админ-панель | OpenBooking',
  description: 'Панель управления платформой OpenBooking',
};

const adminFeatures = [
  {
    title: 'Управление пользователями',
    description: 'Просмотр, редактирование и блокировка пользователей',
    icon: '👥',
    href: '/cms/users',
    color: 'from-blue-500 to-blue-600',
  },
  {
    title: 'Управление недвижимостью',
    description: 'Модерация объектов, редактирование и удаление',
    icon: '🏠',
    href: '/cms/properties',
    color: 'from-green-500 to-green-600',
  },
  {
    title: 'CMS Статьи',
    description: 'Создание и редактирование контента сайта',
    icon: '📝',
    href: '/cms/articles',
    color: 'from-purple-500 to-purple-600',
  },
  {
    title: 'Бронирования',
    description: 'Просмотр всех бронирований и управление статусами',
    icon: '📅',
    href: '/dashboard/admin/bookings',
    color: 'from-orange-500 to-orange-600',
  },
  {
    title: 'Escrow транзакции',
    description: 'Мониторинг и управление Escrow платежами',
    icon: '💰',
    href: '/dashboard/admin/escrow',
    color: 'from-yellow-500 to-yellow-600',
  },
  {
    title: 'Vault пулы',
    description: 'Управление DeFi пулами и настройка APY',
    icon: '💎',
    href: '/dashboard/admin/vault',
    color: 'from-pink-500 to-pink-600',
  },
  {
    title: 'Аналитика',
    description: 'Подробная статистика и метрики платформы',
    icon: '📊',
    href: '/analytics',
    color: 'from-indigo-500 to-indigo-600',
  },
  {
    title: 'Настройки сайта',
    description: 'Редактирование компонентов и настроек',
    icon: '⚙️',
    href: '/dashboard/admin/settings',
    color: 'from-gray-500 to-gray-600',
  },
];

const stats = [
  { label: 'Пользователей', value: '156', change: '+12' },
  { label: 'Объектов', value: '6', change: '+2' },
  { label: 'Бронирований', value: '47', change: '+5' },
  { label: 'TVL', value: '$8.2M', change: '+1.8%' },
];

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Админ-панель</h1>
            <p className="text-muted-foreground">
              Управление платформой OpenBooking
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline">
              🔔 <span className="ml-2">3 уведомления</span>
            </Button>
            <Button asChild>
              <Link href="/api/auth/logout">Выйти</Link>
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardHeader className="pb-2">
                <CardDescription>{stat.label}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
                <p className="text-xs text-green-600 mt-1">{stat.change}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features Grid */}
        <h2 className="text-2xl font-bold mb-6">Инструменты</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {adminFeatures.map((feature) => (
            <Link key={feature.title} href={feature.href}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center text-2xl mb-4`}>
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" variant="outline" size="sm">
                    Открыть →
                  </Button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 p-6 bg-card rounded-lg border">
          <h3 className="text-xl font-bold mb-4">Быстрые действия</h3>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline">Добавить пользователя</Button>
            <Button variant="outline">Создать статью</Button>
            <Button variant="outline">Добавить объект</Button>
            <Button variant="outline">Экспорт данных</Button>
            <Button variant="outline">Бэкап БД</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
