'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { usei18n } from '@/lib/i18n/context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

export default function SignupPage() {
  const router = useRouter();
  const { t } = usei18n();
  const [formData, setFormData] = useState({ email: '', password: '', confirmPassword: '', fullName: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) { setError('Passwords do not match'); return; }
    if (formData.password.length < 8) { setError('Password must be at least 8 characters'); return; }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, password: formData.password, full_name: formData.fullName }),
      });

      if (response.ok) router.push('/auth/login?registered=true');
      else { const err = await response.json(); setError(err.message || 'Registration failed'); }
    } catch { setError('Connection error'); }
    finally { setLoading(false); }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">{t('signup.title')}</CardTitle>
          <CardDescription>{t('signup.desc')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="p-3 text-sm text-red-500 bg-red-100 rounded-md">{error}</div>}

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="fullName">{t('signup.fullName')}</label>
              <Input id="fullName" type="text" placeholder="John Doe" value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} required />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="email">{t('signup.email')}</label>
              <Input id="email" type="email" placeholder="you@example.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="password">{t('signup.password')}</label>
              <Input id="password" type="password" placeholder="••••••••" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="confirmPassword">{t('signup.confirmPassword')}</label>
              <Input id="confirmPassword" type="password" placeholder="••••••••" value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} required />
            </div>

            <div className="text-xs text-muted-foreground">
              <p>{t('signup.agree')}</p>
              <Link href="/terms" className="text-primary hover:underline">{t('signup.terms')}</Link>
              {' '}and{' '}
              <Link href="/privacy" className="text-primary hover:underline">{t('signup.privacy')}</Link>
            </div>

            <Button type="submit" className="w-full" loading={loading}>
              {loading ? t('signup.creating') : t('signup.button')}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              {t('signup.haveAccount')}{' '}
              <Link href="/auth/login" className="text-primary hover:underline">{t('signup.login')}</Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
