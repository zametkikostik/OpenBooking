'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

const translations = {
  ru: {
    title: 'Вход',
    desc: 'Введите свои данные для входа в аккаунт',
    email: 'Email',
    emailPlaceholder: 'admin@openbooking.com',
    password: 'Пароль',
    passwordPlaceholder: '••••••••',
    forgot: 'Забыли пароль?',
    login: 'Войти',
    loggingIn: 'Вход...',
    or: 'Или',
    noAccount: 'Нет аккаунта?',
    signup: 'Зарегистрироваться',
    demo: 'Тестовые аккаунты:',
    admin: 'Admin:',
    host: 'Host:',
    client: 'Client:',
  },
  en: {
    title: 'Login',
    desc: 'Enter your credentials to access your account',
    email: 'Email',
    emailPlaceholder: 'admin@openbooking.com',
    password: 'Password',
    passwordPlaceholder: '••••••••',
    forgot: 'Forgot password?',
    login: 'Login',
    loggingIn: 'Logging in...',
    or: 'Or',
    noAccount: "No account?",
    signup: 'Sign up',
    demo: 'Demo accounts:',
    admin: 'Admin:',
    host: 'Host:',
    client: 'Client:',
  },
  bg: {
    title: 'Вход',
    desc: 'Въведете данните си за достъп',
    email: 'Email',
    emailPlaceholder: 'admin@openbooking.com',
    password: 'Парола',
    passwordPlaceholder: '••••••••',
    forgot: 'Забравена парола?',
    login: 'Вход',
    loggingIn: 'Влизане...',
    or: 'Или',
    noAccount: 'Нямате акаунт?',
    signup: 'Регистрация',
    demo: 'Демо акаунти:',
    admin: 'Admin:',
    host: 'Host:',
    client: 'Client:',
  },
  ua: {
    title: 'Вхід',
    desc: 'Введіть свої дані для входу',
    email: 'Email',
    emailPlaceholder: 'admin@openbooking.com',
    password: 'Пароль',
    passwordPlaceholder: '••••••••',
    forgot: 'Забули пароль?',
    login: 'Увійти',
    loggingIn: 'Вхід...',
    or: 'Або',
    noAccount: 'Немає акаунту?',
    signup: 'Зареєструватися',
    demo: 'Тестові акаунти:',
    admin: 'Admin:',
    host: 'Host:',
    client: 'Client:',
  },
};

export default function LoginPage() {
  const router = useRouter();
  const [currentLang, setCurrentLang] = useState('ru');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const savedLang = document.cookie
      .split('; ')
      .find(row => row.startsWith('NEXT_LOCALE='))
      ?.split('=')[1] || 'ru';
    setCurrentLang(savedLang);
  }, []);

  const t = translations[currentLang] || translations.ru;

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
          <CardTitle className="text-2xl font-bold">{t.title}</CardTitle>
          <CardDescription>{t.desc}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-red-500 bg-red-100 rounded-md">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="email">
                {t.email}
              </label>
              <Input
                id="email"
                type="email"
                placeholder={t.emailPlaceholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="password">
                {t.password}
              </label>
              <Input
                id="password"
                type="password"
                placeholder={t.passwordPlaceholder}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <Link href="/auth/forgot-password" className="text-sm text-primary hover:underline">
                {t.forgot}
              </Link>
            </div>

            <Button type="submit" className="w-full" loading={loading}>
              {loading ? t.loggingIn : t.login}
            </Button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">{t.or}</span>
              </div>
            </div>

            <p className="text-center text-sm text-muted-foreground">
              {t.noAccount}{' '}
              <Link href="/auth/signup" className="text-primary hover:underline">
                {t.signup}
              </Link>
            </p>

            <div className="mt-6 p-4 bg-muted rounded-lg">
              <p className="text-sm font-medium mb-2">{t.demo}</p>
              <div className="space-y-1 text-xs text-muted-foreground">
                <p><strong>{t.admin}</strong> admin@openbooking.com / Admin123!</p>
                <p><strong>{t.host}</strong> host@openbooking.com / Host123!</p>
                <p><strong>{t.client}</strong> client@openbooking.com / Client123!</p>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
