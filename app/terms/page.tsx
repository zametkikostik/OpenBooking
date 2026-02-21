import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Условия использования | OpenBooking',
  description: 'Условия использования платформы OpenBooking',
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto space-y-8">
          <div>
            <h1 className="text-4xl font-bold mb-4">Условия использования</h1>
            <p className="text-sm text-muted-foreground">
              Последнее обновление: 21 февраля 2026
            </p>
          </div>

          <div className="prose dark:prose-invert max-w-none">
            <h2>1. Общие положения</h2>
            <p>
              Добро пожаловать на платформу OpenBooking. Используя наш сервис, вы соглашаетесь 
              с настоящими Условиями использования.
            </p>

            <h2>2. Регистрация и аккаунт</h2>
            <p>
              Для использования сервиса необходимо создать аккаунт, предоставив достоверную информацию. 
              Вы несёте ответственность за сохранность учётных данных.
            </p>

            <h2>3. Бронирование</h2>
            <p>
              Бронирование осуществляется через платформу с защитой средств через Escrow-протокол:
            </p>
            <ul>
              <li>Средства блокируются до момента заселения</li>
              <li>Host не может отменить после CHECKED_IN</li>
              <li>Гарантия возврата при несоответствии описанию</li>
            </ul>

            <h2>4. Оплата</h2>
            <p>Мы принимаем:</p>
            <ul>
              <li>Cryptocurrency: ETH, DAI, A7A5</li>
              <li>Fiat: SBP, SEPA, карты (через партнёров)</li>
            </ul>

            <h2>5. Комиссии</h2>
            <ul>
              <li>Сервисный сбор: 10% от стоимости бронирования</li>
              <li>Комиссия за уборку: устанавливается хостом</li>
            </ul>

            <h2>6. Отмена бронирования</h2>
            <p>Условия отмены зависят от политики объекта:</p>
            <ul>
              <li>Гибкая: полный возврат за 24 часа до заезда</li>
              <li>Умеренная: 50% возврат за 5 дней до заезда</li>
              <li>Строгая: без возврата</li>
            </ul>

            <h2>7. Ответственность</h2>
            <p>
              OpenBooking выступает посредником и не несёт ответственности за действия пользователей 
              или состояние недвижимости.
            </p>

            <h2>8. Изменения условий</h2>
            <p>
              Мы оставляем за собой право изменять условия с уведомлением пользователей за 30 дней.
            </p>

            <h2>9. Контакты</h2>
            <p>
              Email: <a href="mailto:legal@openbooking.com" className="text-primary hover:underline">legal@openbooking.com</a>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
