import { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const metadata: Metadata = {
  title: 'Настройки | OpenBooking Admin',
  description: 'Настройки платформы',
};

export default function AdminSettingsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">⚙️ Настройки</h1>
            <p className="text-muted-foreground">Редактирование компонентов и настроек сайта</p>
          </div>
          <Button asChild>
            <Link href="/dashboard/admin">← Назад в админку</Link>
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Общие настройки</CardTitle>
              <CardDescription>Основные параметры платформы</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Название сайта</label>
                <Input defaultValue="OpenBooking" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Поддержка Email</label>
                <Input defaultValue="support@openbooking.com" />
              </div>
              <Button>Сохранить</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Комиссии</CardTitle>
              <CardDescription>Настройка комиссий платформы</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Сервисный сбор (%)</label>
                <Input type="number" defaultValue="10" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Комиссия за уборку ($)</label>
                <Input type="number" defaultValue="50" />
              </div>
              <Button>Сохранить</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
