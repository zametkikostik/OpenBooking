import { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'CMS | OpenBooking Admin',
  description: 'Управление контентом сайта',
};

export default function CMSDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">📝 CMS - Управление контентом</h1>
            <p className="text-muted-foreground">Редактирование материалов сайта</p>
          </div>
          <Button asChild>
            <Link href="/dashboard/admin">← В админку</Link>
          </Button>
        </div>

        {/* CMS Sections */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <CMSCard
            icon="📰"
            title="Статьи"
            description="Блог, новости, путеводители"
            href="/cms/articles"
            count="24"
            color="from-blue-500 to-blue-600"
          />
          <CMSCard
            icon="🏠"
            title="Недвижимость"
            description="Объекты и модерация"
            href="/cms/properties"
            count="156"
            color="from-green-500 to-green-600"
          />
          <CMSCard
            icon="👥"
            title="Пользователи"
            description="Клиенты и хосты"
            href="/cms/users"
            count="1,234"
            color="from-purple-500 to-purple-600"
          />
          <CMSCard
            icon="⚖️"
            title="Юр. документы"
            description="Условия, политики"
            href="/cms/legal"
            count="8"
            color="from-orange-500 to-orange-600"
          />
        </div>

        {/* Recent Activity */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Последние изменения</CardTitle>
            <CardDescription>История редактирования контента</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <ActivityItem user="Admin" action="изменил статью" target="Путеводитель по Сочи" time="5 мин назад" />
              <ActivityItem user="Moderator" action="одобрил объект" target="Вилла в Сочи" time="15 мин назад" />
              <ActivityItem user="Admin" action="обновил политику" target="Условия использования" time="1 час назад" />
              <ActivityItem user="Admin" action="создал статью" target="Новые возможности DeFi" time="2 часа назад" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function CMSCard({ icon, title, description, href, count, color }: any) {
  return (
    <Link href={href}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
        <CardHeader>
          <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-2xl mb-4 shadow-lg`}>
            {icon}
          </div>
          <CardTitle className="flex items-center justify-between">
            {title}
            <span className="text-sm font-normal text-muted-foreground">{count}</span>
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="w-full" variant="outline">Открыть →</Button>
        </CardContent>
      </Card>
    </Link>
  );
}

function ActivityItem({ user, action, target, time }: any) {
  return (
    <div className="flex items-center justify-between p-3 border rounded-lg">
      <div>
        <span className="font-medium">{user}</span>
        {' '}{action}{' '}
        <span className="font-medium text-primary">{target}</span>
      </div>
      <span className="text-xs text-muted-foreground">{time}</span>
    </div>
  );
}
