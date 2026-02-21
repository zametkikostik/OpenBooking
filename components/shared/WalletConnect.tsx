'use client';

import { Button } from '@/components/ui/button';
import { useWallet } from '@/lib/hooks';
import { truncate } from '@/lib/utils/helpers';

export function WalletConnect() {
  const { address, chainId, connecting, connect, disconnect } = useWallet();

  if (address) {
    return (
      <div className="flex items-center gap-2">
        <div className="hidden flex-col items-end md:flex">
          <span className="text-sm font-medium">{truncate(address, 6)}</span>
          <span className="text-xs text-muted-foreground">
            Chain: {chainId ? parseInt(chainId.toString(16), 16) : 'Unknown'}
          </span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={disconnect}
          className="border-red-200 text-red-600 hover:bg-red-50"
        >
          Отключить
        </Button>
      </div>
    );
  }

  return (
    <Button
      variant="default"
      size="sm"
      onClick={connect}
      disabled={connecting}
      loading={connecting}
    >
      Подключить кошелёк
    </Button>
  );
}
