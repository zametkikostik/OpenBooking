'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCompactNumber } from '@/lib/utils/helpers';
import type { DashboardMetrics } from '@/types';

export function RealTimeMetrics() {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    active_bookings: 0,
    online_users: 0,
    tvl: 0,
    revenue: 0,
    total_properties: 0,
    total_users: 0,
  });

  useEffect(() => {
    // Fetch initial metrics
    fetchMetrics();

    // Set up WebSocket or polling for real-time updates
    const interval = setInterval(fetchMetrics, 30000); // Poll every 30 seconds

    return () => clearInterval(interval);
  }, []);

  async function fetchMetrics() {
    try {
      const response = await fetch('/api/metrics');
      if (response.ok) {
        const data = await response.json();
        setMetrics(data);
      }
    } catch (error) {
      console.error('Error fetching metrics:', error);
    }
  }

  const metricCards = [
    {
      title: 'Активные бронирования',
      value: metrics.active_bookings,
      icon: '📅',
      color: 'text-blue-600',
    },
    {
      title: 'Пользователей онлайн',
      value: metrics.online_users,
      icon: '👥',
      color: 'text-green-600',
    },
    {
      title: 'TVL',
      value: `$${formatCompactNumber(metrics.tvl)}`,
      icon: '💰',
      color: 'text-purple-600',
    },
    {
      title: 'Доход',
      value: `$${formatCompactNumber(metrics.revenue)}`,
      icon: '📈',
      color: 'text-orange-600',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metricCards.map((metric) => (
        <Card key={metric.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
            <span className="text-2xl">{metric.icon}</span>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${metric.color}`}>
              {typeof metric.value === 'number' ? formatCompactNumber(metric.value) : metric.value}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
