import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Контакты | OpenBooking',
  description: 'Связаться с OpenBooking',
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto space-y-8">
          <div>
            <h1 className="text-4xl font-bold mb-4">Контакты</h1>
            <p className="text-xl text-muted-foreground">
              Свяжитесь с нами любым удобным способом
            </p>
          </div>

          <div className="prose dark:prose-invert max-w-none">
            <h2>Отделы</h2>
            <ul>
              <li>
                <strong>Поддержка</strong>:{' '}
                <a href="mailto:support@openbooking.com" className="text-primary hover:underline">
                  support@openbooking.com
                </a>
              </li>
              <li>
                <strong>Пресса</strong>:{' '}
                <a href="mailto:press@openbooking.com" className="text-primary hover:underline">
                  press@openbooking.com
                </a>
              </li>
              <li>
                <strong>Безопасность</strong>:{' '}
                <a href="mailto:security@openbooking.com" className="text-primary hover:underline">
                  security@openbooking.com
                </a>
              </li>
              <li>
                <strong>Партнёрство</strong>:{' '}
                <a href="mailto:partnerships@openbooking.com" className="text-primary hover:underline">
                  partnerships@openbooking.com
                </a>
              </li>
            </ul>

            <h2>Социальные сети</h2>
            <ul>
              <li>GitHub: <a href="https://github.com/zametkikostik/OpenBooking" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">github.com/zametkikostik/OpenBooking</a></li>
            </ul>

            <h2>Офис</h2>
            <p>
              Remote-first компания<br />
              Работаем по всему миру
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
