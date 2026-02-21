'use client';

import { useTranslations } from '@/lib/i18n/useTranslations';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AboutPage() {
  const { t } = useTranslations();

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
            {t('about.title')}
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            {t('about.subtitle')}
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="container mx-auto px-4 py-12">
        <Card className="max-w-4xl mx-auto bg-gradient-to-br from-blue-900/50 to-purple-900/50 border-blue-700/50">
          <CardHeader>
            <CardTitle className="text-3xl flex items-center gap-3">
              <span>🎯</span> {t('about.mission')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg text-slate-200 leading-relaxed">
              {t('about.missionText')}
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Advantages */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center mb-8">{t('about.advantages')}</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <AdvantageCard icon="🔒" title={t('about.escrowTitle')} desc={t('about.escrowDesc')} color="from-blue-500 to-blue-600" />
          <AdvantageCard icon="💎" title={t('about.defiTitle')} desc={t('about.defiDesc')} color="from-purple-500 to-purple-600" />
          <AdvantageCard icon="🌍" title={t('about.globalTitle')} desc={t('about.globalDesc')} color="from-green-500 to-emerald-600" />
          <AdvantageCard icon="⚡" title={t('about.instantTitle')} desc={t('about.instantDesc')} color="from-yellow-500 to-orange-600" />
          <AdvantageCard icon="🤖" title={t('about.aiTitle')} desc={t('about.aiDesc')} color="from-pink-500 to-rose-600" />
          <AdvantageCard icon="📊" title={t('about.transparentTitle')} desc={t('about.transparentDesc')} color="from-cyan-500 to-blue-600" />
        </div>
      </section>

      {/* Cryptocurrencies */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center mb-8">{t('about.crypto')}</h2>
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <CryptoCard name={t('about.ethName')} symbol="ETH" color="from-blue-500 to-blue-600" desc={t('about.ethDesc')} />
          <CryptoCard name={t('about.daiName')} symbol="DAI" color="from-yellow-500 to-orange-600" desc={t('about.daiDesc')} />
          <CryptoCard name={t('about.a7a5Name')} symbol="A7A5" color="from-purple-500 to-pink-600" desc={t('about.a7a5Desc')} />
        </div>
      </section>

      {/* Stats */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center mb-8">{t('about.stats')}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          <StatCard value="47" label={t('about.bookings')} />
          <StatCard value="234" label={t('about.users')} />
          <StatCard value="$8.2M" label={t('about.tvl')} />
          <StatCard value="9" label={t('about.languages')} />
        </div>
      </section>

      {/* Contact */}
      <section className="container mx-auto px-4 py-12 pb-20">
        <Card className="max-w-2xl mx-auto bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-3">📬 {t('about.contact')}</CardTitle>
            <CardDescription className="text-slate-400">{t('about.contactDesc')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ContactItem icon="📧" label={t('about.email')} value="support@openbooking.com" href="mailto:support@openbooking.com" />
            <ContactItem icon="🐙" label={t('about.github')} value="github.com/zametkikostik/OpenBooking" href="https://github.com/zametkikostik/OpenBooking" external />
            <ContactItem icon="📍" label={t('about.office')} value={t('about.officeValue')} />
          </CardContent>
        </Card>
      </section>
    </main>
  );
}

function AdvantageCard({ icon, title, desc, color }: { icon: string; title: string; desc: string; color: string }) {
  return (
    <Card className="bg-slate-800/50 border-slate-700 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 hover:-translate-y-1">
      <CardHeader>
        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-2xl mb-4 shadow-lg`}>{icon}</div>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-slate-400">{desc}</p>
      </CardContent>
    </Card>
  );
}

function CryptoCard({ name, symbol, color, desc }: { name: string; symbol: string; color: string; desc: string }) {
  return (
    <Card className="bg-slate-800/50 border-slate-700 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20">
      <CardHeader>
        <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${color} flex items-center justify-center text-white font-bold text-2xl mb-4 shadow-lg`}>{symbol[0]}</div>
        <CardTitle>{name}</CardTitle>
        <CardDescription className="text-slate-400">{symbol}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-slate-400">{desc}</p>
      </CardContent>
    </Card>
  );
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <Card className="bg-slate-800/50 border-slate-700 text-center">
      <CardContent className="pt-6">
        <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">{value}</div>
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
    return <a href={href} target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined} className="block">{content}</a>;
  }
  return content;
}
