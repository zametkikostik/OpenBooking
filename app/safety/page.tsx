import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Безопасность | OpenBooking',
  description: 'Безопасность на платформе OpenBooking',
};

export default function SafetyPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto space-y-8">
          <div>
            <h1 className="text-4xl font-bold mb-4">Безопасность</h1>
            <p className="text-xl text-muted-foreground">
              Как мы обеспечиваем безопасность ваших данных и средств
            </p>
          </div>

          <div className="prose dark:prose-invert max-w-none">
            <h2>Защита средств</h2>
            <ul>
              <li>🔒 Escrow-протокол для всех платежей</li>
              <li>✅ Верификация транзакций через blockchain RPC</li>
              <li>📊 Минимум 12 подтверждений для ETH</li>
              <li>🚫 Host не может отменить после заселения</li>
            </ul>

            <h2>Защита данных</h2>
            <ul>
              <li>🔐 Шифрование данных (TLS 1.3)</li>
              <li>🛡️ Row Level Security в базе данных</li>
              <li>👁️ Анонимизация IP-адресов</li>
              <li>📝 Audit logging всех действий</li>
            </ul>

            <h2>Безопасность аккаунта</h2>
            <ul>
              <li>🔑 JWT аутентификация</li>
              <li>🔄 Refresh token rotation</li>
              <li>⏰ Session expiry (1 час)</li>
              <li>🚨 Rate limiting на auth endpoints</li>
            </ul>

            <h2>Сообщить о проблеме</h2>
            <p>
              Email: <a href="mailto:security@openbooking.com" className="text-primary hover:underline">security@openbooking.com</a>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
