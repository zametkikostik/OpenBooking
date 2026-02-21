import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Карьера | OpenBooking',
  description: 'Работа в OpenBooking — присоединяйтесь к команде',
};

export default function CareersPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto space-y-8">
          <div>
            <h1 className="text-4xl font-bold mb-4">Карьера</h1>
            <p className="text-xl text-muted-foreground">
              Присоединяйтесь к нашей команде
            </p>
          </div>

          <div className="prose dark:prose-invert max-w-none">
            <p>
              Мы постоянно ищем талантливых разработчиков для улучшения платформы OpenBooking.
            </p>
            
            <h2>Открытые вакансии</h2>
            <ul>
              <li>Senior Frontend Developer (Next.js, React)</li>
              <li>Backend Developer (Node.js, PostgreSQL)</li>
              <li>Web3 Developer (Solidity, ethers.js)</li>
              <li>DevOps Engineer (Kubernetes, Docker)</li>
            </ul>

            <h2>Что мы предлагаем</h2>
            <ul>
              <li>Удалённая работа</li>
              <li>Конкурентная зарплата в криптовалюте</li>
              <li>Участие в развитии Web3 проекта</li>
              <li>Гибкий график</li>
            </ul>

            <p>
              Отправляйте резюме на: <a href="mailto:careers@openbooking.com" className="text-primary hover:underline">careers@openbooking.com</a>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
