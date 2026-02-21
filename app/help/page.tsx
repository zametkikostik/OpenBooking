import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Помощь | OpenBooking',
  description: 'Центр поддержки OpenBooking',
};

export default function HelpPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto space-y-8">
          <div>
            <h1 className="text-4xl font-bold mb-4">Помощь</h1>
            <p className="text-xl text-muted-foreground">
              Центр поддержки пользователей
            </p>
          </div>

          <div className="prose dark:prose-invert max-w-none">
            <h2>Частые вопросы</h2>
            
            <h3>Как забронировать недвижимость?</h3>
            <ol>
              <li>Найдите подходящий объект в каталоге</li>
              <li>Выберите даты и количество гостей</li>
              <li>Подключите кошелёк (MetaMask)</li>
              <li>Подтвердите транзакцию</li>
              <li>Средства блокируются в Escrow до заселения</li>
            </ol>

            <h3>Как работает защита средств?</h3>
            <p>
              Все платежи проходят через Escrow-протокол. Средства переводятся хосту 
              только после успешного заселения гостя.
            </p>

            <h3>Какие криптовалюты принимаются?</h3>
            <ul>
              <li>Ethereum (ETH)</li>
              <li>DAI Stablecoin</li>
              <li>A7A5 Token</li>
            </ul>

            <h2>Связаться с поддержкой</h2>
            <p>
              Email: <a href="mailto:support@openbooking.com" className="text-primary hover:underline">support@openbooking.com</a>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
