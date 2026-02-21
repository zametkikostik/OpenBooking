import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cookies | OpenBooking',
  description: 'Политика использования cookies на OpenBooking',
};

export default function CookiesPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto space-y-8">
          <div>
            <h1 className="text-4xl font-bold mb-4">Политика cookies</h1>
            <p className="text-sm text-muted-foreground">
              Последнее обновление: 21 февраля 2026
            </p>
          </div>

          <div className="prose dark:prose-invert max-w-none">
            <h2>Что такое cookies?</h2>
            <p>
              Cookies — это небольшие текстовые файлы, которые сохраняются на вашем устройстве 
              при посещении сайта. Они помогают сайту запоминать ваши действия и предпочтения.
            </p>

            <h2>Какие cookies мы используем</h2>
            
            <h3>1. Необходимые cookies</h3>
            <p>Всегда активны. Необходимы для работы сайта:</p>
            <ul>
              <li>Аутентификация (JWT tokens)</li>
              <li>Безопасность (CSRF protection)</li>
              <li>Балансировка нагрузки</li>
            </ul>

            <h3>2. Аналитические cookies</h3>
            <p>Требуют согласия. Помогают понять использование сайта:</p>
            <ul>
              <li>Счётчики посещений</li>
              <li>Анализ поведения</li>
              <li>A/B тестирование</li>
            </ul>

            <h3>3. Функциональные cookies</h3>
            <p>Требуют согласия. Запоминают настройки:</p>
            <ul>
              <li>Выбранный язык</li>
              <li>Тема (светлая/тёмная)</li>
              <li>Валюта</li>
            </ul>

            <h2>Управление cookies</h2>
            <p>Вы можете управлять cookies через:</p>
            <ul>
              <li>Наш баннер согласия при первом посещении</li>
              <li>Настройки браузера</li>
              <li>Расширения для управления cookies</li>
            </ul>

            <h2>Third-party cookies</h2>
            <p>
              ❌ Мы <strong>не используем</strong> third-party cookies для отслеживания 
              или рекламы.
            </p>

            <h2>Срок действия cookies</h2>
            <ul>
              <li>Session cookies: удаляются при закрытии браузера</li>
              <li>Persistent cookies: от 1 часа до 1 года</li>
            </ul>

            <h2>Изменения политики</h2>
            <p>
              Мы можем обновлять политику cookies. Актуальная версия всегда доступна 
              на этой странице.
            </p>

            <h2>Контакты</h2>
            <p>
              Вопросы:{' '}
              <a href="mailto:privacy@openbooking.com" className="text-primary hover:underline">
                privacy@openbooking.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
