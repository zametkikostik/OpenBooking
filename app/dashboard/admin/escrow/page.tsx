import { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Escrow | OpenBooking Admin',
  description: 'Управление Escrow транзакциями',
};

export default function AdminEscrowPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">💰 Escrow Транзакции</h1>
            <p className="text-muted-foreground">Мониторинг и управление Escrow платежами</p>
          </div>
          <Button asChild>
            <Link href="/dashboard/admin">← Назад в админку</Link>
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Всего в Escrow</CardTitle>
              <CardDescription>Заблокированные средства</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">$2,450,000</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Ожидает释放</CardTitle>
              <CardDescription>Готовы к выплате</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">$850,000</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Выплачено</CardTitle>
              <CardDescription>За этот месяц</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">$1,200,000</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Последние транзакции</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Здесь будет список Escrow транзакций...</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
