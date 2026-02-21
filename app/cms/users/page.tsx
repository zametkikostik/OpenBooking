'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'client' | 'host' | 'admin';
  status: 'active' | 'blocked' | 'pending';
  createdAt: string;
}

const mockUsers: User[] = [
  { id: '1', email: 'admin@openbooking.com', fullName: 'Admin User', role: 'admin', status: 'active', createdAt: '2026-01-01' },
  { id: '2', email: 'host@openbooking.com', fullName: 'Host User', role: 'host', status: 'active', createdAt: '2026-01-15' },
  { id: '3', email: 'client@openbooking.com', fullName: 'Client User', role: 'client', status: 'active', createdAt: '2026-02-01' },
];

export default function UsersCMS() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">👥 Пользователи</h1>
            <p className="text-muted-foreground">Управление пользователями платформы</p>
          </div>
          <div className="flex gap-4">
            <Button asChild><a href="/dashboard/admin">← Назад</a></Button>
            <Button>+ Добавить</Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex gap-4">
              <Input placeholder="Поиск по email..." className="max-w-sm" />
              <select className="px-3 py-2 border rounded-md">
                <option>Все роли</option>
                <option>Admin</option>
                <option>Host</option>
                <option>Client</option>
              </select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Email</th>
                    <th className="text-left py-3 px-4">Имя</th>
                    <th className="text-left py-3 px-4">Роль</th>
                    <th className="text-left py-3 px-4">Статус</th>
                    <th className="text-left py-3 px-4">Дата</th>
                    <th className="text-left py-3 px-4">Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {mockUsers.map((user) => (
                    <tr key={user.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4">{user.email}</td>
                      <td className="py-3 px-4">{user.fullName}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 rounded text-xs bg-primary/10 text-primary">
                          {user.role}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded text-xs ${
                          user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">{user.createdAt}</td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">Ред.</Button>
                          <Button variant="destructive" size="sm">Блок</Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
