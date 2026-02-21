# 🏠 OpenBooking

**Децентрализованная платформа бронирования нового поколения**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase)](https://supabase.com/)

---

## 🌟 О проекте

**OpenBooking** — это глобальная инфраструктура бронирования, объединяющая:

- 🔒 **Escrow защита** — средства блокируются до момента заселения
- 💎 **DeFi интеграция** — доходность через Aave Protocol
- 🌍 **Мультиязычность** — 9 языков (RU, EN, BG, UA, DE, FR, ES, PL, TR)
- ⚡ **Crypto платежи** — ETH, DAI, A7A5 + фиат (SBP, SEPA, карты)
- 🤖 **AI оптимизация** — умное ценообразование и SEO
- 📊 **Real-time мониторинг** — метрики в реальном времени

---

## 🚀 Возможности

### 🔐 Аутентификация
- Регистрация / Вход
- Быстрый вход для тестовых аккаунтов
- RBAC (Client, Host, Admin)

### 👥 Личные кабинеты
- **Клиент** — бронирования, история, бонусы
- **Арендодатель** — объекты, доход, календарь
- **Администратор** — полная панель управления

### 📝 CMS (Content Management System)
- Управление статьями и блогом
- Модерация недвижимости
- Управление пользователями
- Юридические документы

### 💰 Платежи
- **Crypto**: ETH, DAI, A7A5
- **Fiat**: SBP, MIR, YooKassa, SEPA, Adyen
- Escrow защита средств
- AML валидация

### 🏦 DeFi Vault
- Aave Protocol интеграция
- APY доходность
- Управление пулами
- Risk assessment

---

## 🛠 Технологический стек

| Категория | Технологии |
|-----------|------------|
| **Frontend** | Next.js 14, React 18, TypeScript |
| **Styling** | Tailwind CSS, Radix UI, shadcn/ui |
| **State** | Zustand, TanStack Query |
| **Web3** | Wagmi, viem, ethers.js |
| **Backend** | Supabase (PostgreSQL, Auth, Realtime) |
| **Database** | PostgreSQL 15 |
| **Blockchain** | Ethereum Mainnet, Polygon, Arbitrum |
| **DeFi** | Aave Protocol |
| **DevOps** | Docker, Kubernetes, GitHub Actions |

---

## 📁 Структура проекта

```
OpenBooking/
├── app/                          # Next.js App Router
│   ├── page.tsx                 # Главная страница
│   ├── auth/                    # Аутентификация
│   │   ├── login/
│   │   └── signup/
│   ├── dashboard/               # Личные кабинеты
│   │   ├── admin/              # Админ-панель
│   │   ├── client/             # Кабинет клиента
│   │   └── host/               # Кабинет арендодателя
│   └── cms/                     # CMS
│       ├── articles/           # Статьи
│       ├── properties/         # Недвижимость
│       └── users/              # Пользователи
├── components/                  # React компоненты
│   ├── ui/                     # Base UI
│   ├── layout/                 # Header, Footer
│   ├── booking/                # Booking формы
│   └── vault/                  # Vault компоненты
├── lib/                         # Библиотеки
│   ├── supabase/               # Supabase клиент
│   ├── web3/                   # Web3 утилиты
│   ├── services/               # Бизнес-логика
│   └── i18n/                   # Интернационализация
├── supabase/                    # Supabase конфиг
│   └── migrations/             # Миграции БД
└── docs/                        # Документация
```

---

## 🚀 Быстрый старт

### Требования
- Node.js >= 20.0.0
- npm >= 10.0.0
- Supabase CLI (опционально)

### Установка

```bash
# Клонирование репозитория
git clone https://github.com/zametkikostik/OpenBooking.git
cd OpenBooking

# Установка зависимостей
npm install

# Запуск локального сервера
npm run dev
```

### Переменные окружения

Создайте `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=local-anon-key

# Ethereum RPC
ETH_RPC_URL=https://eth.llamarpc.com

# Token Addresses
A7A5_TOKEN_ADDRESS=0x6fA0BE17e4beA2fCfA22ef89BF8ac9aab0AB0fc9
DAI_TOKEN_ADDRESS=0x6B175474E89094C44Da98b954EedeAC495271d0F
```

### Тестовые аккаунты

| Роль | Email | Пароль |
|------|-------|--------|
| **Admin** | admin@openbooking.com | Admin123! |
| **Host** | host@openbooking.com | Host123! |
| **Client** | client@openbooking.com | Client123! |

---

## 📊 Скриншоты

### Главная страница
![Home](docs/screenshots/home.png)

### Админ-панель
![Admin Dashboard](docs/screenshots/admin.png)

### CMS
![CMS](docs/screenshots/cms.png)

---

## 📚 Документация

- [ARCHITECTURE.md](ARCHITECTURE.md) — Архитектура проекта
- [SECURITY.md](SECURITY.md) — Безопасность
- [COMPLIANCE.md](COMPLIANCE.md) — GDPR/CCPA compliance
- [GETTING_STARTED.md](GETTING_STARTED.md) — Быстрый старт

---

## 🤝 Вклад

Мы приветствуем вклад в развитие проекта!

1. Fork репозиторий
2. Создайте feature branch (`git checkout -b feature/amazing-feature`)
3. Commit изменения (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Откройте Pull Request

---

## 📝 Лицензия

Этот проект распространяется под лицензией MIT. См. файл [LICENSE](LICENSE) для деталей.

---

## 👥 Команда

- **Разработка**: OpenBooking Team
- **Репозиторий**: [github.com/zametkikostik/OpenBooking](https://github.com/zametkikostik/OpenBooking)

---

## 📞 Контакты

- **Email**: support@openbooking.com
- **GitHub**: [zametikostik](https://github.com/zametkikostik)

---

## 🙏 Благодарности

- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.com/)
- [Aave Protocol](https://aave.com/)
- [shadcn/ui](https://ui.shadcn.com/)

---

**OpenBooking** — Building the Future of Trust Economy 🚀
