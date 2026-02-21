'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

const translations = {
  ru: {
    title: 'Регистрация',
    desc: 'Создайте аккаунт для использования платформы',
    fullName: 'ФИО',
    fullNamePlaceholder: 'Иван Иванов',
    email: 'Email',
    emailPlaceholder: 'you@example.com',
    password: 'Пароль',
    passwordPlaceholder: '••••••••',
    confirmPassword: 'Подтвердите пароль',
    confirmPasswordPlaceholder: '••••••••',
    agree: 'Регистрируясь, вы соглашаетесь с:',
    terms: 'Условиями использования',
    privacy: 'Политикой конфиденциальности',
    create: 'Создать аккаунт',
    creating: 'Создание...',
    haveAccount: 'Уже есть аккаунт?',
    login: 'Войти',
  },
  en: {
    title: 'Sign Up',
    desc: 'Create an account to use the platform',
    fullName: 'Full Name',
    fullNamePlaceholder: 'John Doe',
    email: 'Email',
    emailPlaceholder: 'you@example.com',
    password: 'Password',
    passwordPlaceholder: '••••••••',
    confirmPassword: 'Confirm Password',
    confirmPasswordPlaceholder: '••••••••',
    agree: 'By registering, you agree to our:',
    terms: 'Terms of Service',
    privacy: 'Privacy Policy',
    create: 'Create Account',
    creating: 'Creating...',
    haveAccount: 'Already have an account?',
    login: 'Login',
  },
  bg: {
    title: 'Регистрация',
    desc: 'Създайте акаунт за да използвате платформата',
    fullName: 'Име',
    fullNamePlaceholder: 'Иван Иванов',
    email: 'Email',
    emailPlaceholder: 'vie@primer.com',
    password: 'Парола',
    passwordPlaceholder: '••••••••',
    confirmPassword: 'Потвърдете паролата',
    confirmPasswordPlaceholder: '••••••••',
    agree: 'С регистрацията се съгласявате с:',
    terms: 'Условията за ползване',
    privacy: 'Политиката за поверителност',
    create: 'Създай акаунт',
    creating: 'Създаване...',
    haveAccount: 'Вече имате акаунт?',
    login: 'Вход',
  },
  ua: {
    title: 'Реєстрація',
    desc: 'Створіть акаунт для використання платформи',
    fullName: "ПІБ",
    fullNamePlaceholder: 'Іван Іваненко',
    email: 'Email',
    emailPlaceholder: 'you@example.com',
    password: 'Пароль',
    passwordPlaceholder: '••••••••',
    confirmPassword: 'Підтвердіть пароль',
    confirmPasswordPlaceholder: '••••••••',
    agree: 'Реєструючись, ви погоджуєтесь з:',
    terms: 'Умовами використання',
    privacy: 'Політикою конфіденційності',
    create: 'Створити акаунт',
    creating: 'Створення...',
    haveAccount: 'Вже є акаунт?',
    login: 'Увійти',
  },
};

export default function SignupPage() {
  const router = useRouter();
  const [currentLang, setCurrentLang] = useState('ru');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
  });
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
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          full_name: formData.fullName,
        }),
      });

      if (response.ok) {
        router.push('/auth/login?registered=true');
      } else {
        const err = await response.json();
        setError(err.message || 'Registration failed');
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
              <label className="text-sm font-medium" htmlFor="fullName">
                {t.fullName}
              </label>
              <Input
                id="fullName"
                type="text"
                placeholder={t.fullNamePlaceholder}
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="email">
                {t.email}
              </label>
              <Input
                id="email"
                type="email"
                placeholder={t.emailPlaceholder}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="confirmPassword">
                {t.confirmPassword}
              </label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder={t.confirmPasswordPlaceholder}
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
              />
            </div>

            <div className="text-xs text-muted-foreground">
              <p>{t.agree}</p>
              <Link href="/terms" className="text-primary hover:underline">
                {t.terms}
              </Link>
              {' '}і{' '}
              <Link href="/privacy" className="text-primary hover:underline">
                {t.privacy}
              </Link>
            </div>

            <Button type="submit" className="w-full" loading={loading}>
              {loading ? t.creating : t.create}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              {t.haveAccount}{' '}
              <Link href="/auth/login" className="text-primary hover:underline">
                {t.login}
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
