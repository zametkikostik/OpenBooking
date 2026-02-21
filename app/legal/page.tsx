import { Metadata } from 'next';
import { LegalDocuments } from '@/components/legal/LegalDocuments';

export const metadata: Metadata = {
  title: 'Юридические документы | OpenBooking',
  description:
    'Условия использования, политика конфиденциальности и другие юридические документы OpenBooking',
};

export default function LegalPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-4xl space-y-8">
          <div>
            <h1 className="mb-4 text-4xl font-bold">Юридические документы</h1>
            <p className="text-xl text-muted-foreground">Наши юридические документы и соглашения</p>
          </div>

          {/* Document Categories */}
          <div className="grid gap-6 md:grid-cols-2">
            <LegalDocumentCard
              title="Условия использования"
              description="Правила использования платформы OpenBooking"
              href="/legal/terms"
            />
            <LegalDocumentCard
              title="Политика конфиденциальности"
              description="Как мы обрабатываем ваши персональные данные"
              href="/legal/privacy"
            />
            <LegalDocumentCard
              title="Политика cookie"
              description="Информация об использовании файлов cookie"
              href="/legal/cookies"
            />
            <LegalDocumentCard
              title="Договор аренды"
              description="Типовой договор аренды недвижимости"
              href="/legal/rental-agreement"
            />
            <LegalDocumentCard
              title="Политика отмены"
              description="Условия отмены бронирования и возврата средств"
              href="/legal/cancellation"
            />
            <LegalDocumentCard
              title="Безопасность"
              description="Как мы обеспечиваем безопасность ваших данных"
              href="/legal/security"
            />
          </div>

          {/* Acceptance Section */}
          <div className="rounded-lg border bg-card p-6">
            <h2 className="mb-4 text-2xl font-bold">Принятие документов</h2>
            <p className="mb-6 text-muted-foreground">
              Для использования платформы необходимо принять наши юридические документы
            </p>
            <LegalDocuments locale="ru" />
          </div>

          {/* Contact */}
          <div className="rounded-lg border bg-card p-6">
            <h2 className="mb-4 text-2xl font-bold">Вопросы?</h2>
            <p className="mb-4 text-muted-foreground">
              Если у вас есть вопросы по нашим юридическим документам, свяжитесь с нами:
            </p>
            <a href="mailto:legal@openbooking.com" className="text-primary hover:underline">
              legal@openbooking.com
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}

function LegalDocumentCard({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <a
      href={href}
      className="block rounded-lg border bg-card p-6 transition-shadow hover:shadow-md"
    >
      <h3 className="mb-2 text-lg font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
      <span className="mt-4 inline-block text-sm text-primary hover:underline">Читать →</span>
    </a>
  );
}
