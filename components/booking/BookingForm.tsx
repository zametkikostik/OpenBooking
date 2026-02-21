'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { calculateNights, calculateTotalPrice, formatCurrency } from '@/lib/utils/helpers';
import { useWeb3 } from '@/lib/web3/provider';

interface BookingFormProps {
  propertyId: string;
  pricePerNight: number;
  currency: string;
  onBook: (data: BookingData) => Promise<void>;
}

export interface BookingData {
  property_id: string;
  check_in_date: string;
  check_out_date: string;
  num_guests: number;
  payment_method: 'eth' | 'dai' | 'a7a5';
}

export function BookingForm({ propertyId, pricePerNight, currency, onBook }: BookingFormProps) {
  const { isConnected, connect } = useWeb3();
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedCrypto, setSelectedCrypto] = useState<'eth' | 'dai' | 'a7a5'>('eth');

  const nights = checkIn && checkOut ? calculateNights(checkIn, checkOut) : 0;
  const pricing = nights > 0 ? calculateTotalPrice(pricePerNight, nights, 10, 50) : null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!isConnected) {
      await connect();
      return;
    }

    if (!pricing || nights === 0) return;

    setLoading(true);
    try {
      await onBook({
        property_id: propertyId,
        check_in_date: checkIn,
        check_out_date: checkOut,
        num_guests: guests,
        payment_method: selectedCrypto,
      });
    } finally {
      setLoading(false);
    }
  }

  const today = new Date().toISOString().split('T')[0];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Забронировать</CardTitle>
        <CardDescription>
          {pricing ? (
            <>
              <span className="text-2xl font-bold">${pricing.total.toFixed(2)}</span>
              <span className="text-muted-foreground"> за {nights} ночей</span>
            </>
          ) : (
            'Выберите даты'
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="mb-1 block text-sm font-medium">Заезд</label>
              <Input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                min={today}
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Выезд</label>
              <Input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                min={checkIn || today}
                required
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Гости</label>
            <Input
              type="number"
              value={guests}
              onChange={(e) => setGuests(parseInt(e.target.value))}
              min="1"
              max="10"
              required
            />
          </div>

          {pricing && (
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>
                  ${pricePerNight} × {nights} ночей
                </span>
                <span>${pricing.basePrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Сервисный сбор (10%)</span>
                <span>${pricing.serviceFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Уборка</span>
                <span>${pricing.cleaningFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t pt-2 font-semibold">
                <span>Итого</span>
                <span>${pricing.total.toFixed(2)}</span>
              </div>
            </div>
          )}

          {pricing && (
            <div>
              <label className="mb-2 block text-sm font-medium">Способ оплаты</label>
              <div className="grid grid-cols-3 gap-2">
                <CryptoOption
                  symbol="ETH"
                  name="Ethereum"
                  selected={selectedCrypto === 'eth'}
                  onClick={() => setSelectedCrypto('eth')}
                />
                <CryptoOption
                  symbol="DAI"
                  name="DAI"
                  selected={selectedCrypto === 'dai'}
                  onClick={() => setSelectedCrypto('dai')}
                />
                <CryptoOption
                  symbol="A7A5"
                  name="A7A5"
                  selected={selectedCrypto === 'a7a5'}
                  onClick={() => setSelectedCrypto('a7a5')}
                />
              </div>
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={!pricing || nights === 0}
            loading={loading}
          >
            {!isConnected ? 'Подключить кошелёк' : loading ? 'Обработка...' : 'Забронировать'}
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            🔒 Средства защищены Escrow до момента заселения
          </p>
        </form>
      </CardContent>
    </Card>
  );
}

interface CryptoOptionProps {
  symbol: string;
  name: string;
  selected: boolean;
  onClick: () => void;
}

function CryptoOption({ symbol, name, selected, onClick }: CryptoOptionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg border-2 p-3 transition-all ${
        selected ? 'border-primary bg-primary/10' : 'border-input hover:border-primary/50'
      }`}
    >
      <div className="font-bold">{symbol}</div>
      <div className="text-xs text-muted-foreground">{name}</div>
    </button>
  );
}
