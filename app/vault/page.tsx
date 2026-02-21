'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { VaultCard } from '@/components/vault/VaultCard';
import { RealTimeMetrics } from '@/components/shared/RealTimeMetrics';
import type { VaultPool } from '@/types';

// Mock vault pools - in production, fetch from API
const MOCK_VAULT_POOLS: VaultPool[] = [
  {
    id: 'pool-1',
    name: 'Aave Stable Yield',
    description: 'Консервативная стратегия через Aave с фокусом на стейблкоины',
    total_value_locked: 2500000,
    total_deposited: 2000000,
    total_yield_earned: 125000,
    average_apy: 5.2,
    risk_level: 'low',
    strategies: ['aave_supply', 'aave_stable'],
    supported_assets: ['DAI', 'USDC', 'USDT'],
    min_deposit: 100,
    fee_percentage: 2,
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'pool-2',
    name: 'ETH Liquid Staking',
    description: 'Доходность через стейкинг Ethereum с ликвидной позицией',
    total_value_locked: 5000000,
    total_deposited: 4500000,
    total_yield_earned: 275000,
    average_apy: 4.8,
    risk_level: 'medium',
    strategies: ['aave_supply'],
    supported_assets: ['ETH', 'stETH'],
    min_deposit: 0.01,
    fee_percentage: 5,
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'pool-3',
    name: 'A7A5 High Yield',
    description: 'Высокодоходная стратегия с токеном A7A5',
    total_value_locked: 750000,
    total_deposited: 600000,
    total_yield_earned: 90000,
    average_apy: 12.5,
    risk_level: 'high',
    strategies: ['aave_supply', 'yearn'],
    supported_assets: ['A7A5', 'ETH'],
    min_deposit: 500,
    fee_percentage: 10,
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export default function VaultPage() {
  const [pools] = useState<VaultPool[]>(MOCK_VAULT_POOLS);

  async function handleDeposit(poolId: string, amount: number) {
    console.log('Deposit:', poolId, amount);
    // In production: call API to create vault position
    alert(`Депозит ${amount} в пул ${poolId} обрабатывается...`);
  }

  async function handleWithdraw(poolId: string, amount: number) {
    console.log('Withdraw:', poolId, amount);
    // In production: call API to withdraw from vault position
    alert(`Вывод ${amount} из пула ${poolId} обрабатывается...`);
  }

  const totalTvl = pools.reduce((sum, pool) => sum + pool.total_value_locked, 0);
  const avgApy = pools.reduce((sum, pool) => sum + (pool.average_apy || 0), 0) / pools.length;

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto space-y-12 px-4 py-12">
        {/* Header */}
        <div className="space-y-4 text-center">
          <h1 className="text-4xl font-bold">DeFi Vault</h1>
          <p className="mx-auto max-w-2xl text-xl text-muted-foreground">
            Зарабатывайте на временном размещении средств в проверенных DeFi протоколах
          </p>
        </div>

        {/* Metrics */}
        <RealTimeMetrics />

        {/* Overview Stats */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Общий TVL</CardTitle>
              <CardDescription>Во всех пулах</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">${totalTvl.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Средний APY</CardTitle>
              <CardDescription>По всем пулам</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{avgApy.toFixed(2)}%</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Активные пулы</CardTitle>
              <CardDescription>Доступны для депозита</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">
                {pools.filter((p) => p.status === 'active').length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Vault Pools */}
        <div>
          <h2 className="mb-6 text-2xl font-bold">Доступные пулы</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {pools.map((pool) => (
              <VaultCard
                key={pool.id}
                pool={pool}
                onDeposit={handleDeposit}
                onWithdraw={handleWithdraw}
              />
            ))}
          </div>
        </div>

        {/* Info Section */}
        <Card>
          <CardHeader>
            <CardTitle>Как это работает</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="mb-2 text-2xl">💰</div>
                <h3 className="mb-1 font-semibold">1. Внесите средства</h3>
                <p className="text-sm text-muted-foreground">
                  Выберите пул и внесите криптовалюту (ETH, DAI, A7A5)
                </p>
              </div>
              <div className="flex-1">
                <div className="mb-2 text-2xl">📈</div>
                <h3 className="mb-1 font-semibold">2. Получайте доход</h3>
                <p className="text-sm text-muted-foreground">
                  Средства работают в DeFi протоколах, принося пассивный доход
                </p>
              </div>
              <div className="flex-1">
                <div className="mb-2 text-2xl">💸</div>
                <h3 className="mb-1 font-semibold">3. Выводите когда угодно</h3>
                <p className="text-sm text-muted-foreground">
                  Забирайте депозит и накопленный доход в любой момент
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Supported Assets */}
        <Card>
          <CardHeader>
            <CardTitle>Поддерживаемые активы</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <AssetBadge symbol="ETH" name="Ethereum" color="bg-blue-600" />
              <AssetBadge symbol="DAI" name="Dai Stablecoin" color="bg-yellow-500" />
              <AssetBadge symbol="A7A5" name="A7A5 Token" color="bg-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

function AssetBadge({ symbol, name, color }: { symbol: string; name: string; color: string }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border bg-card px-4 py-3">
      <div
        className={`h-10 w-10 ${color} flex items-center justify-center rounded-full text-sm font-bold text-white`}
      >
        {symbol[0]}
      </div>
      <div>
        <div className="font-semibold">{symbol}</div>
        <div className="text-xs text-muted-foreground">{name}</div>
      </div>
    </div>
  );
}
