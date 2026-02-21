import { RealTimeMetrics } from '@/components/shared/RealTimeMetrics';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="space-y-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
            Откройте новую эру бронирования
          </h1>
          <p className="mx-auto max-w-2xl text-xl text-muted-foreground">
            Децентрализованная платформа для аренды недвижимости с защитой средств через Escrow
          </p>

          {/* AUTH BUTTONS - PROMINENT SECTION */}
          <div className="flex flex-col items-center gap-4">
            <p className="text-sm text-muted-foreground">Присоединяйтесь к платформе</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" asChild className="min-w-[200px] text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg">
                <Link href="/auth/login">
                  🔐 Войти в аккаунт
                </Link>
              </Button>
              <Button size="lg" asChild variant="outline" className="min-w-[200px] text-lg border-2">
                <Link href="/auth/signup">
                  📝 Создать аккаунт
                </Link>
              </Button>
            </div>
          </div>

          {/* Search Box */}
          <div className="mx-auto mt-8 max-w-3xl rounded-lg bg-card p-4 shadow-lg">
            <div className="flex flex-col gap-4 md:flex-row">
              <Input type="text" placeholder="Куда вы хотите поехать?" className="flex-1" />
              <Input type="date" className="flex-1" />
              <Input type="date" className="flex-1" />
              <Input type="number" placeholder="Гости" min="1" className="w-full md:w-32" />
              <Button size="lg">Найти</Button>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="mt-8 flex justify-center gap-4">
            <Button size="lg" asChild>
              <a href="/properties">Начать путешествие</a>
            </Button>
            <Button size="lg" variant="outline">
              Стать хостом
            </Button>
          </div>
        </div>
      </section>

      {/* Real-time Metrics */}
      <section className="container mx-auto px-4 py-12">
        <RealTimeMetrics />
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="mb-12 text-center text-3xl font-bold">Почему OpenBooking</h2>
        <div className="grid gap-8 md:grid-cols-3">
          <FeatureCard
            icon="🔒"
            title="Escrow Защита"
            description="Ваши средства защищены до момента заселения. Никаких рисков, только гарантии."
          />
          <FeatureCard
            icon="💎"
            title="DeFi Интеграция"
            description="Зарабатывайте на временном размещении средств в DeFi протоколах."
          />
          <FeatureCard
            icon="🌍"
            title="Глобальный Охват"
            description="Доступ к недвижимости по всему миру с поддержкой 9 языков."
          />
          <FeatureCard
            icon="⚡"
            title="Мгновенные Платежи"
            description="Оплата криптовалютой ETH, DAI, A7A5 или фиатом через локальные системы."
          />
          <FeatureCard
            icon="🤖"
            title="AI Оптимизация"
            description="Умное ценообразование и персонализированные рекомендации."
          />
          <FeatureCard
            icon="📊"
            title="Прозрачность"
            description="Полная история транзакций в блокчейне с возможностью верификации."
          />
        </div>
      </section>

      {/* Supported Cryptocurrencies */}
      <section className="container mx-auto rounded-3xl bg-muted/50 px-4 py-20">
        <h2 className="mb-8 text-center text-3xl font-bold">Поддерживаемые криптовалюты</h2>
        <div className="flex flex-wrap justify-center gap-8">
          <CryptoBadge name="Ethereum" symbol="ETH" color="bg-blue-600" />
          <CryptoBadge name="DAI" symbol="DAI" color="bg-yellow-500" />
          <CryptoBadge name="A7A5" symbol="A7A5" color="bg-purple-600" />
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto mt-20 border-t px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <h3 className="mb-4 font-semibold">Компания</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <a href="#" className="hover:text-foreground">
                  О нас
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground">
                  Карьера
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground">
                  Пресса
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 font-semibold">Поддержка</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <a href="#" className="hover:text-foreground">
                  Помощь
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground">
                  Безопасность
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground">
                  Контакты
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 font-semibold">Правовая информация</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <a href="#" className="hover:text-foreground">
                  Условия
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground">
                  Конфиденциальность
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground">
                  Cookies
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 font-semibold">Языки</h3>
            <div className="flex flex-wrap gap-2">
              {['RU', 'EN', 'BG', 'UA', 'DE', 'FR', 'ES', 'PL', 'TR'].map((lang) => (
                <span
                  key={lang}
                  className="cursor-pointer text-sm text-muted-foreground hover:text-foreground"
                >
                  {lang}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-muted-foreground">
          <p>© 2026 OpenBooking. Все права защищены.</p>
        </div>
      </footer>
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-lg bg-card p-6 shadow-md transition-shadow hover:shadow-lg">
      <div className="mb-4 text-4xl">{icon}</div>
      <h3 className="mb-2 text-xl font-semibold">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}

function CryptoBadge({ name, symbol, color }: { name: string; symbol: string; color: string }) {
  return (
    <div className="flex items-center gap-3 rounded-full bg-card px-6 py-4 shadow-md">
      <div
        className={`h-10 w-10 ${color} flex items-center justify-center rounded-full text-sm font-bold text-white`}
      >
        {symbol[0]}
      </div>
      <div>
        <div className="font-semibold">{name}</div>
        <div className="text-sm text-muted-foreground">{symbol}</div>
      </div>
    </div>
  );
}
