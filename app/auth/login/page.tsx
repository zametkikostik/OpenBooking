'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { usei18n } from '@/lib/i18n/context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const { t } = usei18n();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.role === 'admin') router.push('/dashboard/admin');
        else if (data.role === 'host') router.push('/dashboard/host');
        else router.push('/dashboard/client');
      } else {
        const err = await response.json();
        setError(err.message || 'Login failed');
      }
    } catch {
      setError('Connection error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">{t('login.title')}</CardTitle>
          <CardDescription>{t('login.desc')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-red-500 bg-red-100 rounded-md">{error}</div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="email">{t('login.email')}</label>
              <Input id="email" type="email" placeholder="admin@openbooking.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="password">{t('login.password')}</label>
              <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>

            <div className="flex items-center justify-between">
              <Link href="/auth/forgot-password" className="text-sm text-primary hover:underline">{t('login.forgot')}</Link>
            </div>

            <Button type="submit" className="w-full" loading={loading}>
              {loading ? t('login.loggingIn') : t('login.button')}
            </Button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t" /></div>
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">{t('login.or')}</span></div>
            </div>

            <p className="text-center text-sm text-muted-foreground">
              {t('login.noAccount')}{' '}
              <Link href="/auth/signup" className="text-primary hover:underline">{t('login.signup')}</Link>
            </p>

            <div className="mt-6 p-4 bg-muted rounded-lg">
              <p className="text-sm font-medium mb-2">{t('login.demo')}</p>
              <div className="space-y-1 text-xs text-muted-foreground">
                <p><strong>{t('login.admin')}</strong> admin@openbooking.com / Admin123!</p>
                <p><strong>{t('login.host')}</strong> host@openbooking.com / Host123!</p>
                <p><strong>{t('login.client')}</strong> client@openbooking.com / Client123!</p>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
