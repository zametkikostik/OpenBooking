# 👑 OpenBooking — Trust Economy Protocol

> Global decentralized booking infrastructure combining Finance + AI Growth + Travel Economy + Reputation Protocol

[![CI/CD](https://github.com/zametkikostik/OpenBooking/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/zametkikostik/OpenBooking/actions/workflows/ci-cd.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     OPENBOOKING PLATFORM                         │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │   Web App   │  │  Mobile App │  │   API/GraphQL│             │
│  │  (Next.js)  │  │  (React Nat.)│  │   (Edge Fn) │             │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘             │
│         │                │                │                     │
│         └────────────────┴────────────────┘                     │
│                          │                                      │
│              ┌───────────▼───────────┐                         │
│              │   Supabase (Postgres) │                         │
│              │   + Auth + Storage    │                         │
│              └───────────┬───────────┘                         │
│                          │                                      │
│         ┌────────────────┼────────────────┐                    │
│         │                │                │                    │
│  ┌──────▼──────┐  ┌──────▼──────┐  ┌──────▼──────┐            │
│  │   Web3      │  │    AI       │  │   Payment   │            │
│  │  (Ethers)   │  │  Services   │  │   Adapter   │            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
└─────────────────────────────────────────────────────────────────┘
```

## ✨ Features

### 🔒 Escrow Financial Protocol
- **State Machine**: `pending` → `payment_locked` → `confirmed` → `checked_in` → `completed` → `settled`
- **Protection**: After check-in, hosts cannot cancel, admins cannot withdraw
- **Blockchain**: Smart contract logs all events on-chain

### 💰 Multi-Currency Payments
| Crypto | Fiat (Russia) | Fiat (EU) | Bulgaria |
|--------|--------------|-----------|----------|
| USDT | SBP | SEPA | Borica |
| USDC | Mir | Adyen | ePay.bg |
| ETH | YooKassa | Klarna | — |
| OBT Token | — | — | — |

### 🤖 AI Autonomous System
- **Marketing AI**: Auto-generates ads, SEO pages, travel guides
- **Growth AI**: Optimizes CAC, LTV, funnel conversion
- **SEO AI**: Creates city/district pages with Schema.org markup
- **Dynamic Pricing**: AI-powered price optimization

### 🏦 DeFi Safe Vault Economy
- **Yield Generation**: Integrate with Aave
- **APY Tracking**: Real-time yield monitoring
- **Risk Scores**: Built-in risk assessment

### 🌍 Internationalization
- **9 Languages**: EN, RU, BG, UA, DE, FR, ES, PL, TR
- **Local Payment Methods**: Region-specific gateways
- **Multi-Currency**: USD, EUR, RUB, BGN, etc.

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- npm or yarn
- Supabase CLI
- Docker (optional)

### 1. Clone Repository
```bash
git clone https://github.com/zametkikostik/OpenBooking.git
cd OpenBooking
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment
```bash
cp .env.local.example .env.local
# Edit .env.local with your credentials
```

### 4. Start Local Supabase
```bash
npx supabase start
```

### 5. Run Migrations
```bash
npx supabase migration up
```

### 6. Seed Database (Optional)
```bash
npm run db:seed
```

### 7. Start Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
OpenBooking/
├── src/
│   ├── app/              # Next.js App Router
│   ├── components/       # React Components
│   ├── lib/              # Core Libraries
│   │   ├── supabase/     # Supabase client
│   │   ├── web3/         # Web3 integration
│   │   ├── payments/     # Payment adapters
│   │   ├── ai/           # AI services
│   │   ├── legal/        # Legal engine
│   │   ├── i18n/         # Internationalization
│   │   └── monitoring/   # Real-time metrics
│   ├── types/            # TypeScript types
│   └── hooks/            # React hooks
├── supabase/
│   ├── migrations/       # Database migrations
│   ├── functions/        # Edge functions
│   └── templates/        # Email templates
├── scripts/              # Utility scripts
├── k8s/                  # Kubernetes configs
├── .github/
│   └── workflows/        # CI/CD pipelines
└── docker-compose.yml    # Docker setup
```

## 🗄 Database Schema

### Core Tables
- **profiles**: User profiles with RBAC
- **host_profiles**: Host-specific data
- **properties**: Property listings
- **bookings**: Booking state machine
- **payments**: Payment records
- **safe_vaults**: DeFi positions
- **reviews**: Review system
- **ai_content**: AI-generated content
- **seo_pages**: SEO-optimized pages
- **legal_documents**: Versioned legal docs

### Key Features
- Row Level Security (RLS)
- Real-time subscriptions
- Automatic triggers
- Full-text search

## 🔐 Security

### Authentication
- Supabase Auth (Email, OAuth, Wallet)
- JWT tokens
- Session management

### Authorization
- RBAC (Client, Host, Admin, Super Admin)
- Row Level Security policies
- API rate limiting

### Data Protection
- Encryption at rest (AES-256)
- Encryption in transit (TLS 1.3)
- GDPR compliance
- Cookie consent

## 📊 Monitoring

### Real-time Metrics
- Active bookings
- Online users
- Total Value Locked (TVL)
- Revenue tracking

### Stack
- Prometheus (metrics)
- Grafana (dashboards)
- Loki (logs)
- Redis (caching)

## 🚢 Deployment

### Local Development
```bash
docker-compose up
```

### Production (Kubernetes)
```bash
kubectl apply -f k8s/deployment.yaml
```

### CI/CD
- GitHub Actions
- Automated testing
- Security scanning
- Auto-deployment

## 🧪 Testing

```bash
# Unit tests
npm test

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e
```

## 📖 API Documentation

### REST Endpoints
- `GET /api/properties` - List properties
- `POST /api/bookings` - Create booking
- `GET /api/bookings/:id` - Get booking details
- `POST /api/payments` - Process payment

### GraphQL (Coming Soon)
- Queries for data fetching
- Mutations for state changes
- Subscriptions for real-time updates

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🌟 Vision

OpenBooking = **Trust Economy Protocol** + **AI Growth Company** + **Web3 Finance Infrastructure** + **Reputation Network** + **Global Travel OS**

---

<p align="center">
  <strong>Built with ❤️ by OpenBooking Team</strong>
</p>
