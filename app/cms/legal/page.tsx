import { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Юр. документы | CMS OpenBooking',
  description: 'Управление юридическими документами',
};

const mockDocuments = [
  { id: '1', title: 'Условия использования', type: 'terms', status: 'active', updated: '2026-02-20' },
  { id: '2', title: 'Политика конфиденциальности', type: 'privacy', status: 'active', updated: '2026-02-19' },
  { id: '3', title: 'Политика Cookies', type: 'cookies', status: 'active', updated: '2026-02-18' },
  { id: '4', title: 'Договор аренды', type: 'contract', status: 'draft', updated: '2026-02-21' },
];

export default function CMSLegalPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">⚖️ Юридические документы</h1>
            <p className="text-muted-foreground">Условия, политики и договоры</p>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link href="/cms">← CMS</Link>
            </Button>
            <Button>+ Добавить документ</Button>
          </div>
        </div>

        {/* Documents List */}
        <Card>
          <CardHeader>
            <CardTitle>Все документы</CardTitle>
            <CardDescription>4 документа</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockDocuments.map((doc) => (
                <DocumentItem key={doc.id} document={doc} />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Info */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>ℹ️ Информация</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Юридические документы требуют обязательного согласования перед публикацией.
              Все изменения сохраняются с версионированием.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function DocumentItem({ document }: { document: any }) {
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className={`px-2 py-0.5 rounded text-xs font-medium ${
            document.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
          }`}>
            {document.status === 'active' ? 'Активен' : 'Черновик'}
          </span>
          <span className="text-xs text-muted-foreground">{document.updated}</span>
        </div>
        <div className="font-semibold text-lg">{document.title}</div>
        <div className="text-sm text-muted-foreground">Тип: {document.type}</div>
      </div>
      <div className="flex gap-2">
        <Button size="sm" variant="outline">Ред.</Button>
        <Button size="sm">Опубликовать</Button>
      </div>
    </div>
  );
}
