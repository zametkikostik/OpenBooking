'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface AnalyticsData {
  totalEvents: number;
  pageViews: number;
  uniqueSessions: number;
  pages: Record<string, number>;
  countries: Record<string, number>;
  devices: Record<string, number>;
}

export function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    loadAnalytics();
  }, [dateRange]);

  async function loadAnalytics() {
    try {
      const response = await fetch(`/api/analytics?start=${dateRange.start}&end=${dateRange.end}`);
      if (response.ok) {
        const analyticsData = await response.json();
        setData(analyticsData);
      }
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="space-y-6">Загрузка аналитики...</div>;
  }

  if (!data) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">Нет данных для отображения</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Date Range Selector */}
      <div className="flex items-end gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Начало</label>
          <input
            type="date"
            value={dateRange.start}
            onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
            className="rounded-md border px-3 py-2"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Конец</label>
          <input
            type="date"
            value={dateRange.end}
            onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
            className="rounded-md border px-3 py-2"
          />
        </div>
        <Button onClick={loadAnalytics}>Обновить</Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <MetricCard title="Всего событий" value={data.totalEvents.toLocaleString()} icon="📊" />
        <MetricCard title="Просмотров страниц" value={data.pageViews.toLocaleString()} icon="👁️" />
        <MetricCard
          title="Уникальных сессий"
          value={data.uniqueSessions.toLocaleString()}
          icon="👤"
        />
        <MetricCard title="Стран" value={Object.keys(data.countries).length.toString()} icon="🌍" />
      </div>

      {/* Pages */}
      <Card>
        <CardHeader>
          <CardTitle>Популярные страницы</CardTitle>
          <CardDescription>Топ страниц по количеству просмотров</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(data.pages)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 10)
              .map(([page, views], index) => (
                <div key={page} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-6 text-muted-foreground">{index + 1}</span>
                    <span className="font-medium">{page}</span>
                  </div>
                  <span className="text-muted-foreground">{views.toLocaleString()}</span>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Countries */}
      <Card>
        <CardHeader>
          <CardTitle>География пользователей</CardTitle>
          <CardDescription>Посещения по странам</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(data.countries)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 10)
              .map(([country, visits]) => (
                <div key={country} className="flex items-center justify-between">
                  <span className="font-medium">{country}</span>
                  <span className="text-muted-foreground">{visits.toLocaleString()}</span>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Devices */}
      <Card>
        <CardHeader>
          <CardTitle>Устройства</CardTitle>
          <CardDescription>Типы устройств пользователей</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(data.devices).map(([device, count]) => (
              <div key={device} className="flex items-center justify-between">
                <span className="font-medium capitalize">{device}</span>
                <span className="text-muted-foreground">{count.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* GDPR Notice */}
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle>🔒 GDPR Compliance</CardTitle>
          <CardDescription>Информация о защите данных</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>✓ Используем только first-party cookies</li>
            <li>✓ IP-адреса анонимизированы</li>
            <li>✓ Требуем явное согласие на отслеживание</li>
            <li>✓ Предоставляем экспорт данных по запросу</li>
            <li>✓ Реализуем право на удаление данных</li>
            <li>✓ Нет кросс-сайтового отслеживания</li>
          </ul>
          <div className="flex gap-4">
            <Button variant="outline" size="sm">
              Экспорт данных
            </Button>
            <Button variant="outline" size="sm">
              Удалить мои данные
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function MetricCard({ title, value, icon }: { title: string; value: string; icon: string }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <span className="text-2xl">{icon}</span>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}
