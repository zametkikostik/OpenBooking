'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const translations = {
  ru: {
    title: 'О нас',
    subtitle: 'OpenBooking — платформа бронирования нового поколения',
    mission: 'Наша миссия',
    missionText: 'Мы создаём децентрализованную платформу для аренды недвижимости с защитой средств через Escrow-протокол и интеграцией Web3 технологий.',
    advantages: 'Наши преимущества',
    escrowTitle: 'Escrow защита',
    escrowDesc: 'Средства блокируются до момента заселения. Никаких рисков, только гарантии.',
    defiTitle: 'DeFi интеграция',
    defiDesc: 'Зарабатывайте на временном размещении средств в DeFi протоколах (Aave).',
    globalTitle: 'Глобальный охват',
    globalDesc: '9 языков поддержки и недвижимость по всему миру.',
    instantTitle: 'Мгновенные платежи',
    instantDesc: 'Оплата криптовалютой ETH, DAI, A7A5 или фиатом через локальные системы.',
    aiTitle: 'AI оптимизация',
    aiDesc: 'Умное ценообразование и персонализированные рекомендации.',
    transparentTitle: 'Прозрачность',
    transparentDesc: 'Полная история транзакций в блокчейне с возможностью верификации.',
    crypto: 'Поддерживаемые криптовалюты',
    ethName: 'Ethereum',
    ethDesc: 'Основная криптовалюта для платежей',
    daiName: 'DAI',
    daiDesc: 'Стейблкоин, привязанный к USD',
    a7a5Name: 'A7A5',
    a7a5Desc: 'Токен платформы с доходностью',
    stats: 'Платформа в цифрах',
    bookings: 'Активных бронирований',
    users: 'Пользователей онлайн',
    tvl: 'TVL',
    languages: 'Языков поддержки',
    contact: 'Контакты',
    contactDesc: 'Свяжитесь с нами любым удобным способом',
    email: 'Email',
    github: 'GitHub',
    office: 'Офис',
    officeValue: 'Remote-first • Работаем по всему миру',
  },
  en: {
    title: 'About Us',
    subtitle: 'OpenBooking — next-generation booking platform',
    mission: 'Our Mission',
    missionText: 'We are building a decentralized platform for property rental with Escrow payment protection and Web3 technology integration.',
    advantages: 'Our Advantages',
    escrowTitle: 'Escrow Protection',
    escrowDesc: 'Funds are locked until check-in. No risks, only guarantees.',
    defiTitle: 'DeFi Integration',
    defiDesc: 'Earn yield on temporarily deposited funds in DeFi protocols (Aave).',
    globalTitle: 'Global Coverage',
    globalDesc: '9 languages supported and properties worldwide.',
    instantTitle: 'Instant Payments',
    instantDesc: 'Pay with crypto (ETH, DAI, A7A5) or fiat via local payment systems.',
    aiTitle: 'AI Optimization',
    aiDesc: 'Smart pricing and personalized recommendations.',
    transparentTitle: 'Transparency',
    transparentDesc: 'Complete transaction history on blockchain with verification.',
    crypto: 'Supported Cryptocurrencies',
    ethName: 'Ethereum',
    ethDesc: 'Main cryptocurrency for payments',
    daiName: 'DAI',
    daiDesc: 'USD-pegged stablecoin',
    a7a5Name: 'A7A5',
    a7a5Desc: 'Platform token with yield',
    stats: 'Platform in Numbers',
    bookings: 'Active Bookings',
    users: 'Users Online',
    languages: 'Languages Supported',
    contact: 'Contact Us',
    contactDesc: 'Get in touch using any convenient method',
    email: 'Email',
    github: 'GitHub',
    office: 'Office',
    officeValue: 'Remote-first • Working worldwide',
  },
  bg: {
    title: 'Относно нас',
    subtitle: 'OpenBooking — платформа за резервации от ново поколение',
    mission: 'Нашата мисия',
    missionText: 'Създаваме децентрализирана платформа за отдаване на имоти под наем със Escrow защита и Web3 интеграция.',
    advantages: 'Нашите предимства',
    escrowTitle: 'Escrow защита',
    escrowDesc: 'Средствата се заключват до настаняването. Без рискове, само гаранции.',
    defiTitle: 'DeFi интеграция',
    defiDesc: 'Печелете от временно депозиране на средства в DeFi протоколи (Aave).',
    globalTitle: 'Глобално покритие',
    globalDesc: '9 поддържани езика и имоти по целия свят.',
    instantTitle: 'Веднага плащания',
    instantDesc: 'Плащане с крипто (ETH, DAI, A7A5) или фиат чрез локални системи.',
    aiTitle: 'AI оптимизация',
    aiDesc: 'Умно ценообразуване и персонализирани препоръки.',
    transparentTitle: 'Прозрачност',
    transparentDesc: 'Пълна история на транзакциите в блокчейна с възможност за проверка.',
    crypto: 'Поддържани криптовалути',
    ethName: 'Ethereum',
    ethDesc: 'Основна криптовалута за плащания',
    daiName: 'DAI',
    daiDesc: 'Стейбълкойн, вързан към USD',
    a7a5Name: 'A7A5',
    a7a5Desc: 'Платформен токен с доходност',
    stats: 'Платформата в числа',
    bookings: 'Активни резервации',
    users: 'Потребители онлайн',
    languages: 'Поддържани езици',
    contact: 'Контакти',
    contactDesc: 'Свържете се с нас по всякакъв начин',
    email: 'Email',
    github: 'GitHub',
    office: 'Офис',
    officeValue: 'Remote-first • Работим по целия свят',
  },
  ua: {
    title: 'Про нас',
    subtitle: 'OpenBooking — платформа бронювання нового покоління',
    mission: 'Наша місія',
    missionText: 'Ми створюємо децентралізовану платформу для оренди нерухомості з захистом коштів через Escrow та інтеграцією Web3 технологій.',
    advantages: 'Наші переваги',
    escrowTitle: 'Escrow захист',
    escrowDesc: 'Кошти блокуються до моменту заселення. Ніяких ризиків, тільки гарантії.',
    defiTitle: 'DeFi інтеграція',
    defiDesc: 'Заробляйте на тимчасовому розміщенні коштів в DeFi протоколах (Aave).',
    globalTitle: 'Глобальне охоплення',
    globalDesc: '9 мов підтримки та нерухомість по всьому світу.',
    instantTitle: 'Миттєві платежі',
    instantDesc: 'Оплата криптовалютою (ETH, DAI, A7A5) або фіатом через локальні системи.',
    aiTitle: 'AI оптимізація',
    aiDesc: 'Розумне ціноутворення та персоналізовані рекомендації.',
    transparentTitle: 'Прозорість',
    transparentDesc: 'Повна історія транзакцій в блокчейні з можливістю перевірки.',
    crypto: 'Підтримувані криптовалюти',
    ethName: 'Ethereum',
    ethDesc: 'Основна криптовалюта для платежів',
    daiName: 'DAI',
    daiDesc: 'Стейблкоїн, прив\'язаний до USD',
    a7a5Name: 'A7A5',
    a7a5Desc: 'Токен платформи з дохідністю',
    stats: 'Платформа в цифрах',
    bookings: 'Активних бронювань',
    users: 'Користувачів онлайн',
    languages: 'Мов підтримки',
    contact: 'Контакти',
    contactDesc: 'Зв\'яжіться з нами будь-яким зручним способом',
    email: 'Email',
    github: 'GitHub',
    office: 'Офіс',
    officeValue: 'Remote-first • Працюємо по всьому світу',
  },
};

export default function AboutPage() {
  const [currentLang, setCurrentLang] = useState('ru');

  useEffect(() => {
    const savedLang = document.cookie
      .split('; ')
      .find(row => row.startsWith('NEXT_LOCALE='))
      ?.split('=')[1] || 'ru';
    setCurrentLang(savedLang);
  }, []);

  const t = translations[currentLang] || translations.ru;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center space-y-6 max-w-4xl mx-auto">
          <div className="inline-block">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center text-5xl mx-auto mb-6 shadow-2xl shadow-blue-500/30">
              🏠
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            {t.title}
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            {t.subtitle}
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="container mx-auto px-4 py-12">
        <Card className="max-w-4xl mx-auto bg-gradient-to-br from-blue-900/50 to-purple-900/50 border-blue-700/50">
          <CardHeader>
            <CardTitle className="text-3xl flex items-center gap-3">
              <span>🎯</span> {t.mission}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg text-slate-200 leading-relaxed">
              {t.missionText}
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Advantages */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center mb-8">{t.advantages}</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <AdvantageCard icon="🔒" title={t.escrowTitle} description={t.escrowDesc} color="from-blue-500 to-blue-600" />
          <AdvantageCard icon="💎" title={t.defiTitle} description={t.defiDesc} color="from-purple-500 to-purple-600" />
          <AdvantageCard icon="🌍" title={t.globalTitle} description={t.globalDesc} color="from-green-500 to-emerald-600" />
          <AdvantageCard icon="⚡" title={t.instantTitle} description={t.instantDesc} color="from-yellow-500 to-orange-600" />
          <AdvantageCard icon="🤖" title={t.aiTitle} description={t.aiDesc} color="from-pink-500 to-rose-600" />
          <AdvantageCard icon="📊" title={t.transparentTitle} description={t.transparentDesc} color="from-cyan-500 to-blue-600" />
        </div>
      </section>

      {/* Cryptocurrencies */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center mb-8">{t.crypto}</h2>
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <CryptoCard name={t.ethName} symbol="ETH" color="from-blue-500 to-blue-600" description={t.ethDesc} />
          <CryptoCard name={t.daiName} symbol="DAI" color="from-yellow-500 to-orange-600" description={t.daiDesc} />
          <CryptoCard name={t.a7a5Name} symbol="A7A5" color="from-purple-500 to-pink-600" description={t.a7a5Desc} />
        </div>
      </section>

      {/* Stats */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center mb-8">{t.stats}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          <StatCard value="47" label={t.bookings} />
          <StatCard value="234" label={t.users} />
          <StatCard value="$8.2M" label={t.tvl} />
          <StatCard value="9" label={t.languages} />
        </div>
      </section>

      {/* Contact */}
      <section className="container mx-auto px-4 py-12 pb-20">
        <Card className="max-w-2xl mx-auto bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-3">📬 {t.contact}</CardTitle>
            <CardDescription className="text-slate-400">{t.contactDesc}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ContactItem icon="📧" label={t.email} value="support@openbooking.com" href="mailto:support@openbooking.com" />
            <ContactItem icon="🐙" label={t.github} value="github.com/zametkikostik/OpenBooking" href="https://github.com/zametkikostik/OpenBooking" external />
            <ContactItem icon="📍" label={t.office} value={t.officeValue} />
          </CardContent>
        </Card>
      </section>
    </main>
  );
}

function AdvantageCard({ icon, title, description, color }: { icon: string; title: string; description: string; color: string }) {
  return (
    <Card className="bg-slate-800/50 border-slate-700 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 hover:-translate-y-1">
      <CardHeader>
        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-2xl mb-4 shadow-lg`}>
          {icon}
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-slate-400">{description}</p>
      </CardContent>
    </Card>
  );
}

function CryptoCard({ name, symbol, color, description }: { name: string; symbol: string; color: string; description: string }) {
  return (
    <Card className="bg-slate-800/50 border-slate-700 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20">
      <CardHeader>
        <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${color} flex items-center justify-center text-white font-bold text-2xl mb-4 shadow-lg`}>
          {symbol[0]}
        </div>
        <CardTitle>{name}</CardTitle>
        <CardDescription className="text-slate-400">{symbol}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-slate-400">{description}</p>
      </CardContent>
    </Card>
  );
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <Card className="bg-slate-800/50 border-slate-700 text-center">
      <CardContent className="pt-6">
        <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
          {value}
        </div>
        <div className="text-sm text-slate-400">{label}</div>
      </CardContent>
    </Card>
  );
}

function ContactItem({ icon, label, value, href, external }: { icon: string; label: string; value: string; href?: string; external?: boolean }) {
  const content = (
    <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 transition-colors">
      <span className="text-2xl">{icon}</span>
      <div>
        <div className="text-sm text-slate-400">{label}</div>
        <div className="font-medium">{value}</div>
      </div>
    </div>
  );

  if (href) {
    return (
      <a href={href} target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined} className="block">
        {content}
      </a>
    );
  }

  return content;
}
