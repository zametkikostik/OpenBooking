import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Пресса | OpenBooking',
  description: 'Пресс-центр OpenBooking',
};

export default function PressPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto space-y-8">
          <div>
            <h1 className="text-4xl font-bold mb-4">Пресса</h1>
            <p className="text-xl text-muted-foreground">
              Новости и публикации о OpenBooking
            </p>
          </div>

          <div className="prose dark:prose-invert max-w-none">
            <h2>Пресс-кит</h2>
            <p>
              Логотипы, скриншоты и другая информация для прессы доступна по запросу.
            </p>

            <h2>Последние новости</h2>
            <ul>
              <li>
                <strong>Февраль 2026</strong> — Запуск OpenBooking v1.0 с поддержкой ETH, DAI, A7A5
              </li>
              <li>
                <strong>Январь 2026</strong> — Интеграция с Aave Protocol для DeFi Vault
              </li>
              <li>
                <strong>Декабрь 2025</strong> — Анонс проекта OpenBooking
              </li>
            </ul>

            <h2>Контакты для прессы</h2>
            <p>
              Email: <a href="mailto:press@openbooking.com" className="text-primary hover:underline">press@openbooking.com</a>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
