import { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'О нас | OpenBooking',
  description: 'OpenBooking — децентрализованная платформа бронирования нового поколения',
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center space-y-6 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            О нас
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground">
            OpenBooking — платформа бронирования нового поколения
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="container mx-auto px-4 py-12">
        <Card className="max-w-4xl mx-auto bg-gradient-to-br from-primary/10 to-purple-500/10 border-primary/20">
          <CardHeader>
            <CardTitle className="text-3xl">🎯 Наша миссия</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Мы создаём <strong>децентрализованную платформу</strong> для аренды недвижимости 
              с защитой средств через <strong>Escrow-протокол</strong> и интеграцией 
              <strong> Web3 технологий</strong>. Наша цель — сделать бронирование безопасным, 
              прозрачным и доступным для всех.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Advantages */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center mb-8">Наши преимущества</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <AdvantageCard
            icon="🔒"
            title="Escrow защита"
            description="Средства блокируются до момента заселения. Никаких рисков, только гарантии."
          />
          <AdvantageCard
            icon="💎"
            title="DeFi интеграция"
            description="Зарабатывайте на временном размещении средств в DeFi протоколах (Aave)."
          />
          <AdvantageCard
            icon="🌍"
            title="Глобальный охват"
            description="9 языков поддержки и недвижимость по всему миру."
          />
          <AdvantageCard
            icon="⚡"
            title="Мгновенные платежи"
            description="Оплата криптовалютой ETH, DAI, A7A5 или фиатом через локальные системы."
          />
          <AdvantageCard
            icon="🤖"
            title="AI оптимизация"
            description="Умное ценообразование и персонализированные рекомендации."
          />
          <AdvantageCard
            icon="📊"
            title="Прозрачность"
            description="Полная история транзакций в блокчейне с возможностью верификации."
          />
        </div>
      </section>

      {/* Cryptocurrencies */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center mb-8">Поддерживаемые криптовалюты</h2>
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <CryptoCard
            name="Ethereum"
            symbol="ETH"
            color="from-blue-500 to-blue-600"
            description="Основная криптовалюта для платежей"
          />
          <CryptoCard
            name="DAI"
            symbol="DAI"
            color="from-yellow-500 to-yellow-600"
            description="Стейблкоин, привязанный к USD"
          />
          <CryptoCard
            name="A7A5"
            symbol="A7A5"
            color="from-purple-500 to-purple-600"
            description="Токен платформы с доходностью"
          />
        </div>
      </section>

      {/* Stats */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center mb-8">Платформа в цифрах</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          <StatCard value="47" label="Активных бронирований" />
          <StatCard value="234" label="Пользователей онлайн" />
          <StatCard value="$8.2M" label="TVL" />
          <StatCard value="9" label="Языков поддержки" />
        </div>
      </section>

      {/* Contact */}
      <section className="container mx-auto px-4 py-12">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">📬 Контакты</CardTitle>
            <CardDescription>Свяжитесь с нами любым удобным способом</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ContactItem
              icon="📧"
              label="Email"
              value="support@openbooking.com"
              href="mailto:support@openbooking.com"
            />
            <ContactItem
              icon="💼"
              label="GitHub"
              value="github.com/zametkikostik/OpenBooking"
              href="https://github.com/zametkikostik/OpenBooking"
              external
            />
            <ContactItem
              icon="📍"
              label="Офис"
              value="Remote-first • Работаем по всему миру"
            />
          </CardContent>
        </Card>
      </section>
    </main>
  );
}

function AdvantageCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="text-4xl mb-2">{icon}</div>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

function CryptoCard({ 
  name, 
  symbol, 
  color,
  description 
}: { 
  name: string; 
  symbol: string; 
  color: string;
  description: string;
}) {
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${color} flex items-center justify-center text-white font-bold text-2xl mb-4`}>
          {symbol[0]}
        </div>
        <CardTitle>{name}</CardTitle>
        <CardDescription>{symbol}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <Card className="text-center">
      <CardContent className="pt-6">
        <div className="text-4xl font-bold text-primary mb-2">{value}</div>
        <div className="text-sm text-muted-foreground">{label}</div>
      </CardContent>
    </Card>
  );
}

function ContactItem({ 
  icon, 
  label, 
  value, 
  href,
  external 
}: { 
  icon: string; 
  label: string; 
  value: string;
  href?: string;
  external?: boolean;
}) {
  const content = (
    <div className="flex items-center gap-3">
      <span className="text-2xl">{icon}</span>
      <div>
        <div className="text-sm text-muted-foreground">{label}</div>
        <div className="font-medium">{value}</div>
      </div>
    </div>
  );

  if (href) {
    return (
      <a 
        href={href} 
        className="block p-4 rounded-lg border hover:bg-muted transition-colors"
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
      >
        {content}
      </a>
    );
  }

  return (
    <div className="p-4 rounded-lg border">
      {content}
    </div>
  );
}
