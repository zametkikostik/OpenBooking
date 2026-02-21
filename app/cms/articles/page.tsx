'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Article {
  id: string;
  title: string;
  content: string;
  author: string;
  status: 'draft' | 'published' | 'archived';
  createdAt: string;
}

const mockArticles: Article[] = [
  {
    id: '1',
    title: 'Как забронировать недвижимость через OpenBooking',
    content: 'Пошаговое руководство по бронированию...',
    author: 'Admin',
    status: 'published',
    createdAt: '2026-02-20',
  },
  {
    id: '2',
    title: 'Новые возможности DeFi Vault',
    content: 'Представляем обновлённые пулы...',
    author: 'Admin',
    status: 'published',
    createdAt: '2026-02-19',
  },
  {
    id: '3',
    title: 'Безопасность платежей в 2026',
    content: 'Обзор новых функций безопасности...',
    author: 'Admin',
    status: 'draft',
    createdAt: '2026-02-21',
  },
];

export default function ArticlesCMS() {
  const [articles, setArticles] = useState<Article[]>(mockArticles);
  const [showEditor, setShowEditor] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Partial<Article>>({});

  const handleSave = () => {
    if (editingArticle.id) {
      // Update existing
      setArticles(articles.map(a => a.id === editingArticle.id ? { ...a, ...editingArticle } as Article : a));
    } else {
      // Create new
      const newArticle: Article = {
        id: String(Date.now()),
        title: editingArticle.title || '',
        content: editingArticle.content || '',
        author: 'Admin',
        status: 'draft',
        createdAt: new Date().toISOString().split('T')[0],
      };
      setArticles([newArticle, ...articles]);
    }
    setShowEditor(false);
    setEditingArticle({});
  };

  const handleDelete = (id: string) => {
    setArticles(articles.filter(a => a.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">📝 CMS Статьи</h1>
            <p className="text-muted-foreground">
              Управление контентом сайта
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button asChild>
              <a href="/dashboard/admin">← Назад в админку</a>
            </Button>
            <Button onClick={() => setShowEditor(true)}>
              + Новая статья
            </Button>
          </div>
        </div>

        {/* Articles List */}
        <div className="space-y-4">
          {articles.map((article) => (
            <Card key={article.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        article.status === 'published' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {article.status === 'published' ? 'Опубликовано' : 'Черновик'}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {article.createdAt}
                      </span>
                    </div>
                    <CardTitle className="text-xl">{article.title}</CardTitle>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingArticle(article);
                        setShowEditor(true);
                      }}
                    >
                      Редактировать
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(article.id)}
                    >
                      Удалить
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{article.content.slice(0, 200)}...</p>
                <p className="text-xs text-muted-foreground mt-2">
                  Автор: {article.author}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Editor Modal */}
        {showEditor && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
              <CardHeader>
                <CardTitle>
                  {editingArticle.id ? 'Редактировать статью' : 'Новая статья'}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Заголовок</label>
                  <Input
                    value={editingArticle.title || ''}
                    onChange={(e) => setEditingArticle({ ...editingArticle, title: e.target.value })}
                    placeholder="Введите заголовок"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Содержание</label>
                  <textarea
                    value={editingArticle.content || ''}
                    onChange={(e) => setEditingArticle({ ...editingArticle, content: e.target.value })}
                    className="w-full min-h-[300px] p-3 border rounded-md"
                    placeholder="Введите текст статьи..."
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Статус</label>
                  <select
                    value={editingArticle.status || 'draft'}
                    onChange={(e) => setEditingArticle({ ...editingArticle, status: e.target.value as Article['status'] })}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="draft">Черновик</option>
                    <option value="published">Опубликовано</option>
                    <option value="archived">Архив</option>
                  </select>
                </div>
              </CardContent>
              <div className="p-6 border-t flex gap-4 justify-end">
                <Button variant="outline" onClick={() => setShowEditor(false)}>
                  Отмена
                </Button>
                <Button onClick={handleSave}>
                  Сохранить
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
