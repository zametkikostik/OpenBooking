'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Article {
  id: string;
  title: string;
  author: string;
  status: 'published' | 'draft';
  date: string;
  views: number;
}

const mockArticles: Article[] = [
  { id: '1', title: 'Путеводитель по Сочи', author: 'Admin', status: 'published', date: '2026-02-20', views: 1234 },
  { id: '2', title: 'Новые возможности DeFi Vault', author: 'Admin', status: 'published', date: '2026-02-19', views: 856 },
  { id: '3', title: 'Как забронировать жильё', author: 'Editor', status: 'draft', date: '2026-02-21', views: 0 },
];

export default function CMSArticlesPage() {
  const [articles, setArticles] = useState<Article[]>(mockArticles);
  const [showEditor, setShowEditor] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">📰 Статьи и материалы</h1>
            <p className="text-muted-foreground">Управление контентом сайта</p>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link href="/cms">← CMS</Link>
            </Button>
            <Button onClick={() => setShowEditor(true)}>+ Новая статья</Button>
          </div>
        </div>

        {/* Articles List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Все статьи</CardTitle>
                <CardDescription>{articles.length} материалов</CardDescription>
              </div>
              <Input placeholder="Поиск..." className="max-w-sm" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {articles.map((article) => (
                <ArticleItem key={article.id} article={article} />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Editor Modal */}
        {showEditor && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
              <CardHeader>
                <CardTitle>Редактор статьи</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Заголовок</label>
                  <Input placeholder="Введите заголовок" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Содержание</label>
                  <textarea className="w-full min-h-[300px] p-3 border rounded-md" placeholder="Текст статьи..." />
                </div>
              </CardContent>
              <div className="p-6 border-t flex gap-4 justify-end">
                <Button variant="outline" onClick={() => setShowEditor(false)}>Отмена</Button>
                <Button>Опубликовать</Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

function ArticleItem({ article }: { article: Article }) {
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className={`px-2 py-0.5 rounded text-xs font-medium ${
            article.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
          }`}>
            {article.status === 'published' ? 'Опубликовано' : 'Черновик'}
          </span>
          <span className="text-xs text-muted-foreground">{article.date}</span>
        </div>
        <div className="font-semibold text-lg">{article.title}</div>
        <div className="text-sm text-muted-foreground">
          Автор: {article.author} • 👁️ {article.views.toLocaleString()}
        </div>
      </div>
      <div className="flex gap-2">
        <Button size="sm" variant="outline">Ред.</Button>
        <Button size="sm" variant="destructive">Удалить</Button>
      </div>
    </div>
  );
}
