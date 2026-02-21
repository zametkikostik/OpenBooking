'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils/helpers';
import type { VaultPool } from '@/types';

interface VaultCardProps {
  pool: VaultPool;
  onDeposit: (poolId: string, amount: number) => Promise<void>;
  onWithdraw: (poolId: string, amount: number) => Promise<void>;
}

export function VaultCard({ pool, onDeposit, onWithdraw }: VaultCardProps) {
  const [showDeposit, setShowDeposit] = useState(false);
  const [amount, setAmount] = useState('');

  const riskColors = {
    low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  };

  async function handleDeposit() {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) return;

    await onDeposit(pool.id, numAmount);
    setAmount('');
    setShowDeposit(false);
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{pool.name}</CardTitle>
            <CardDescription>{pool.description}</CardDescription>
          </div>
          <span
            className={`rounded-full px-2 py-1 text-xs font-medium ${riskColors[pool.risk_level]}`}
          >
            {pool.risk_level === 'low'
              ? 'Низкий'
              : pool.risk_level === 'medium'
                ? 'Средний'
                : 'Высокий'}{' '}
            риск
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <div className="text-sm text-muted-foreground">TVL</div>
            <div className="text-lg font-bold">
              {formatCurrency(pool.total_value_locked, 'USD')}
            </div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">APY</div>
            <div className="text-lg font-bold text-green-600">
              {pool.average_apy ? `${pool.average_apy.toFixed(2)}%` : '—'}
            </div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Стратегии</div>
            <div className="text-sm font-medium">{pool.strategies.length}</div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {pool.strategies.map((strategy) => (
            <span key={strategy} className="rounded bg-muted px-2 py-1 text-xs">
              {strategy.replace('_', ' ')}
            </span>
          ))}
        </div>

        <div className="border-t pt-4">
          {showDeposit ? (
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Сумма ({pool.supported_assets.join(', ')})
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full rounded-md border px-3 py-2"
                  placeholder="0.00"
                  min={pool.min_deposit}
                  step="0.01"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleDeposit} className="flex-1">
                  Внести
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowDeposit(false);
                    setAmount('');
                  }}
                >
                  Отмена
                </Button>
              </div>
            </div>
          ) : (
            <Button
              onClick={() => setShowDeposit(true)}
              className="w-full"
              disabled={pool.status !== 'active'}
            >
              {pool.status === 'active' ? 'Внести средства' : 'Пауза'}
            </Button>
          )}
        </div>

        {pool.min_deposit > 0 && (
          <p className="text-center text-xs text-muted-foreground">
            Минимальный депозит: {formatCurrency(pool.min_deposit, 'USD')}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
