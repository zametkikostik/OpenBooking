import { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Vault | OpenBooking Admin',
  description: 'Управление DeFi пулами',
};

export default function AdminVaultPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">💎 Vault Пулы</h1>
            <p className="text-muted-foreground">Управление DeFi пулами и настройка APY</p>
          </div>
          <Button asChild>
            <Link href="/dashboard/admin">← Назад в админку</Link>
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Aave Stable Yield</CardTitle>
              <CardDescription>Консервативная стратегия</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-2">APY: 5.2%</div>
              <div className="text-sm text-muted-foreground">TVL: $2,500,000</div>
              <div className="text-sm text-muted-foreground">Риск: Низкий</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>ETH Liquid Staking</CardTitle>
              <CardDescription>Стейкинг Ethereum</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-2">APY: 4.8%</div>
              <div className="text-sm text-muted-foreground">TVL: $5,000,000</div>
              <div className="text-sm text-muted-foreground">Риск: Средний</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>A7A5 High Yield</CardTitle>
              <CardDescription>Высокодоходная стратегия</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-2">APY: 12.5%</div>
              <div className="text-sm text-muted-foreground">TVL: $750,000</div>
              <div className="text-sm text-muted-foreground">Риск: Высокий</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
