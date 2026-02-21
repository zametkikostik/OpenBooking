import { Metadata } from 'next';
import { AnalyticsDashboard } from '@/components/analytics/AnalyticsDashboard';

export const metadata: Metadata = {
  title: 'Аналитика | OpenBooking',
  description: 'Панель аналитики трафика и пользовательской активности',
};

export default function AnalyticsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto px-4 py-12">
        <div className="space-y-8">
          <div>
            <h1 className="mb-4 text-4xl font-bold">Аналитика</h1>
            <p className="text-xl text-muted-foreground">
              GDPR-совместимая аналитика трафика и активности пользователей
            </p>
          </div>

          <AnalyticsDashboard />
        </div>
      </div>
    </main>
  );
}
