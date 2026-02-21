import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'О нас | OpenBooking',
  description: 'OpenBooking — децентрализованная платформа бронирования нового поколения',
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto space-y-8">
          <div>
            <h1 className="text-4xl font-bold mb-4">О нас</h1>
            <p className="text-xl text-muted-foreground">
              OpenBooking — платформа бронирования нового поколения
            </p>
          </div>

          <div className="prose dark:prose-invert max-w-none">
            <h2>Наша миссия</h2>
            <p>
              Мы создаём децентрализованную платформу для аренды недвижимости с защитой средств через Escrow-протокол 
              и интеграцией Web3 технологий.
            </p>

            <h2>Наши преимущества</h2>
            <ul>
              <li>🔒 Escrow защита средств</li>
              <li>💎 DeFi интеграция для доходности</li>
              <li>🌍 Глобальный охват (9 языков)</li>
              <li>⚡ Мгновенные платежи криптовалютой</li>
              <li>🤖 AI оптимизация цен</li>
              <li>📊 Полная прозрачность транзакций</li>
            </ul>

            <h2>Поддерживаемые криптовалюты</h2>
            <ul>
              <li>Ethereum (ETH)</li>
              <li>DAI Stablecoin</li>
              <li>A7A5 Token (0x6fA0BE17e4beA2fCfA22ef89BF8ac9aab0AB0fc9)</li>
            </ul>

            <h2>Контакты</h2>
            <ul>
              <li>Email: support@openbooking.com</li>
              <li>GitHub: github.com/zametkikostik/OpenBooking</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
