# OpenBooking

**Enterprise Trust Economy Platform for Global Booking Infrastructure**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase)](https://supabase.com/)

## 🌟 Overview

OpenBooking — децентрализованная платформа бронирования нового поколения, объединяющая:

- **Trust Economy Protocol** — защита средств через Escrow
- **Web3 Finance Infrastructure** — интеграция с Ethereum, DAI, A7A5
- **DeFi Vault** — доходность через Aave и другие протоколы
- **AI-Powered Growth** — умное ценообразование и SEO
- **Multi-Language Support** — 9 языков (RU, EN, BG, UA, DE, FR, ES, PL, TR)

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Client Layer                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │   Next.js   │  │  Wagmi/viem │  │   Tailwind + Radix UI   │  │
│  │   App Router│  │  Web3 Hooks │  │   Components Library    │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        API Layer                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │   REST API  │  │  Webhooks   │  │   Real-time WebSocket   │  │
│  │   (Routes)  │  │  (Payments) │  │   (Supabase Realtime)   │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Services Layer                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │   Escrow    │  │   Payment   │  │      Compliance         │  │
│  │   Service   │  │   Adapter   │  │      Engine             │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │    Vault    │  │     AI      │  │      Analytics          │  │
│  │   Manager   │  │   Content   │  │      Tracker            │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Data Layer                                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │  Supabase   │  │  Blockchain │  │      External           │  │
│  │  PostgreSQL │  │    RPC      │  │      APIs (Aave, etc.)  │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## 🚀 Features

### Core Functionality

- ✅ **Escrow Payment Protection** — средства блокируются до момента заселения
- ✅ **Multi-Currency Support** — ETH, DAI, A7A5 + фиат (СБП, SEPA, карты)
- ✅ **DeFi Vault Integration** — доходность через Aave, Compound, Yearn
- ✅ **Booking State Machine** — PENDING → PAYMENT_LOCKED → CHECKED_IN → COMPLETED → SETTLED
- ✅ **RBAC System** — Client, Host, Admin роли с разграничением прав

### Technical Features

- ✅ **TypeScript** — полная типизация
- ✅ **Zod Validation** — runtime валидация данных
- ✅ **Supabase Auth** — аутентификация и авторизация
- ✅ **Real-time Updates** — WebSocket подписки
- ✅ **i18n** — 9 языков с middleware routing
- ✅ **SEO Optimized** — Schema.org, OpenGraph, hreflang

### Security

- ✅ **Row Level Security (RLS)** — защита на уровне БД
- ✅ **AML Validation** — проверка транзакций
- ✅ **Compliance Logging** — аудит всех действий
- ✅ **Rate Limiting** — защита от злоупотреблений
- ✅ **Security Headers** — HSTS, CSP, XSS protection

## 📦 Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 14, React 18, TypeScript |
| **Styling** | Tailwind CSS, Radix UI, shadcn/ui |
| **State** | Zustand, TanStack Query |
| **Web3** | Wagmi, viem, ethers.js |
| **Backend** | Supabase (PostgreSQL, Auth, Storage, Realtime) |
| **Database** | PostgreSQL 15 |
| **Blockchain** | Ethereum Mainnet, Polygon, Arbitrum |
| **DeFi** | Aave Protocol |
| **Payments** | Crypto (ETH/DAI/A7A5) + Fiat (SBP/SEPA/Cards) |
| **DevOps** | Docker, Kubernetes, GitHub Actions |
| **Monitoring** | Sentry, Google Analytics |

## 🛠 Development

### Prerequisites

- Node.js >= 20.0.0
- npm >= 10.0.0
- Supabase CLI

### Installation

```bash
# Clone repository
git clone https://github.com/zametkikostik/OpenBooking.git
cd OpenBooking

# Install dependencies
npm install

# Setup environment
cp .env.local.example .env.local
# Edit .env.local with your credentials

# Initialize Supabase locally
supabase init
supabase start

# Run database migrations
supabase migration up

# Start development server
npm run dev
```

### Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=local-anon-key
SUPABASE_SERVICE_ROLE_KEY=local-service-role

# Supabase Production
NEXT_PUBLIC_SUPABASE_PROD_URL=https://sibgxcagyylbqmjaykys.supabase.co
NEXT_PUBLIC_SUPABASE_PROD_ANON_KEY=

# Ethereum RPC
ETH_RPC_URL=https://eth.llamarpc.com
ETH_CHAIN_ID=1

# Token Addresses
A7A5_TOKEN_ADDRESS=0x6fA0BE17e4beA2fCfA22ef89BF8ac9aab0AB0fc9
DAI_TOKEN_ADDRESS=0x6B175474E89094C44Da98b954EedeAC495271d0F

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors
npm run type-check   # TypeScript type checking
npm run test         # Run tests
npm run test:e2e     # Run E2E tests
npm run db:generate  # Generate Supabase types
npm run db:migrate   # Run database migrations
```

## 📁 Project Structure

```
OpenBooking/
├── app/                          # Next.js App Router
│   ├── [lang]/                   # Localized routes
│   ├── api/                      # API routes
│   ├── vault/                    # Vault page
│   ├── properties/               # Properties pages
│   └── auth/                     # Authentication pages
├── components/                   # React components
│   ├── ui/                       # Base UI components
│   ├── layout/                   # Layout components
│   ├── booking/                  # Booking components
│   ├── property/                 # Property components
│   ├── payment/                  # Payment components
│   ├── vault/                    # Vault components
│   └── shared/                   # Shared components
├── lib/                          # Core libraries
│   ├── supabase/                 # Supabase client
│   ├── web3/                     # Web3 utilities
│   ├── services/                 # Business logic
│   ├── hooks/                    # React hooks
│   ├── validators/               # Zod schemas
│   └── utils/                    # Utilities
├── config/                       # Configuration files
├── types/                        # TypeScript types
├── public/                       # Static assets
│   └── locales/                  # i18n translations
├── styles/                       # Global styles
├── supabase/                     # Supabase config
│   ├── migrations/               # Database migrations
│   └── functions/                # Edge functions
└── scripts/                      # Utility scripts
```

## 🗄 Database Schema

### Core Tables

| Table | Description |
|-------|-------------|
| `profiles` | User profiles with roles |
| `properties` | Property listings |
| `bookings` | Booking records |
| `escrow_ledger` | Escrow transaction log |
| `payment_transactions` | Payment history |
| `reviews` | User reviews |
| `ai_generated_content` | AI-generated SEO content |
| `traffic_events` | Analytics events |
| `compliance_logs` | Compliance audit log |
| `vault_positions` | DeFi vault positions |
| `vault_pools` | DeFi vault pools |
| `real_time_metrics` | Dashboard metrics |

## 🔐 Security

### Escrow State Machine

```
PENDING ──→ PAYMENT_LOCKED ──→ CHECKED_IN ──→ COMPLETED ──→ SETTLED
    │              │
    └──→ CANCELLED ←┘
```

**Rules:**
- После `CHECKED_IN`: Host не может отменить
- После `CHECKED_IN`: Admin не может вывести средства
- Все транзакции логируются в `escrow_ledger`
- Проверка через blockchain RPC

### Payment Flow

1. **Client** создаёт бронирование → `PENDING`
2. **Client** оплачивает → `PAYMENT_LOCKED` (Escrow)
3. **Host** подтверждает заселение → `CHECKED_IN`
4. **Booking** завершается → `COMPLETED`
5. **Средства** переводятся Host → `SETTLED`

## 🌍 Supported Languages

- 🇷🇺 Russian (RU)
- 🇬🇧 English (EN)
- 🇧🇬 Bulgarian (BG)
- 🇺🇦 Ukrainian (UA)
- 🇩🇪 German (DE)
- 🇫🇷 French (FR)
- 🇪🇸 Spanish (ES)
- 🇵🇱 Polish (PL)
- 🇹🇷 Turkish (TR)

## 💰 Supported Payment Methods

### Cryptocurrency
- Ethereum (ETH)
- DAI Stablecoin
- A7A5 Token (`0x6fA0BE17e4beA2fCfA22ef89BF8ac9aab0AB0fc9`)

### Fiat (by Region)
- **Russia**: SBP, Mir, YooKassa
- **EU**: SEPA, Adyen, Klarna
- **Bulgaria**: Borica, ePay.bg

## 📊 Monitoring

### Real-time Metrics

- Active bookings
- Online users
- Total Value Locked (TVL)
- Revenue
- Total properties
- Total users

### Compliance

- AML validation
- Transaction monitoring
- Risk scoring
- Audit logging

## 🚀 Deployment

### Production Migration

```bash
# Login to Supabase
supabase login

# Link to production project
supabase link --project-ref sibgxcagyylbqmjaykys

# Push database migrations
supabase db push

# Deploy edge functions
supabase functions deploy

# Build Next.js
npm run build

# Start production server
npm run start
```

### Docker

```bash
# Build image
docker build -t openbooking .

# Run container
docker run -p 3000:3000 --env-file .env.local openbooking
```

## 📝 License

MIT License — see [LICENSE](LICENSE) for details.

## 👥 Team

- **Principal Architect**: OpenBooking Team
- **Repository**: [github.com/zametkikostik/OpenBooking](https://github.com/zametkikostik/OpenBooking)

## 📞 Support

- **Documentation**: [docs.openbooking.com](https://docs.openbooking.com)
- **Discord**: [discord.gg/openbooking](https://discord.gg/openbooking)
- **Email**: support@openbooking.com

---

**OpenBooking** — Building the Future of Trust Economy
