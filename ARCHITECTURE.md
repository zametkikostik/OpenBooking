# OpenBooking Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT LAYER                                        │
│                                                                                  │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────────────────┐   │
│  │   Next.js 14     │  │   Wagmi + viem   │  │   Tailwind CSS + Radix UI    │   │
│  │   App Router     │  │   Web3 Hooks     │  │   Component Library          │   │
│  │   SSR/SSG        │  │   WalletConnect  │  │   Responsive Design          │   │
│  └──────────────────┘  └──────────────────┘  └──────────────────────────────┘   │
│                                                                                  │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────────────────┐   │
│  │   React Query    │  │   Zustand        │  │   i18next                    │   │
│  │   Data Fetching  │  │   State Mgmt     │  │   9 Languages                │   │
│  └──────────────────┘  └──────────────────┘  └──────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ HTTPS / WebSocket
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              API LAYER                                           │
│                                                                                  │
│  ┌──────────────────────────────────────────────────────────────────────────┐   │
│  │                        Next.js API Routes                                 │   │
│  │  /api/auth/*        - Authentication endpoints                           │   │
│  │  /api/bookings/*    - Booking management                                 │   │
│  │  /api/properties/*  - Property CRUD                                      │   │
│  │  /api/payments/*    - Payment processing                                 │   │
│  │  /api/vault/*       - DeFi vault operations                              │   │
│  │  /api/metrics       - Real-time metrics                                  │   │
│  │  /webhook/*         - External webhooks (payments, blockchain)           │   │
│  └──────────────────────────────────────────────────────────────────────────┘   │
│                                                                                  │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────────────────┐   │
│  │   Rate Limiting  │  │   CORS Policy    │  │   Security Headers           │   │
│  │   100 req/min    │  │   Strict         │  │   HSTS, CSP, XSS             │   │
│  └──────────────────┘  └──────────────────┘  └──────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ Business Logic
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           SERVICES LAYER                                         │
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │                        Escrow Service                                    │    │
│  │  • State Machine: PENDING → PAYMENT_LOCKED → CHECKED_IN → SETTLED       │    │
│  │  • Transaction logging to escrow_ledger                                 │    │
│  │  • Blockchain RPC verification                                          │    │
│  │  • Automatic release after checkout                                     │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │                      Payment Service                                     │    │
│  │  • Adapter Pattern for multiple providers                               │    │
│  │  • Crypto: ETH, DAI, A7A5 (via RPC)                                     │    │
│  │  • Fiat: SBP, SEPA, Cards (via gateways)                                │    │
│  │  • AML validation & compliance logging                                  │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │                       Vault Service                                      │    │
│  │  • Aave Protocol integration                                            │    │
│  │  • Yield optimization strategies                                        │    │
│  │  • Risk assessment & allocation                                         │    │
│  │  • Position tracking & reporting                                        │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │                      AI Content Service                                  │    │
│  │  • SEO page generation                                                  │    │
│  │  • Travel guides & descriptions                                         │    │
│  │  • Dynamic pricing optimization                                         │    │
│  │  • Multi-language support                                               │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │                   Compliance Service                                     │    │
│  │  • AML/KYC validation                                                   │    │
│  │  • Risk scoring                                                         │    │
│  │  • Audit logging                                                        │    │
│  │  • Regulatory reporting                                                 │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ Data Access
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                            DATA LAYER                                            │
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │                    Supabase (PostgreSQL 15)                              │    │
│  │                                                                          │    │
│  │  Core Tables:                                                            │    │
│  │  • profiles           - User accounts & roles                           │    │
│  │  • properties         - Property listings                               │    │
│  │  • bookings           - Reservation records                             │    │
│  │  • escrow_ledger      - Escrow transactions                             │    │
│  │  • payment_transactions - Payment history                               │    │
│  │  • reviews            - User reviews & ratings                          │    │
│  │  • ai_generated_content - AI content storage                            │    │
│  │  • traffic_events     - Analytics events                                │    │
│  │  • compliance_logs    - Compliance audit trail                          │    │
│  │  • vault_positions    - DeFi positions                                   │    │
│  │  • vault_pools        - DeFi pools                                       │    │
│  │  • real_time_metrics  - Dashboard metrics                               │    │
│  │                                                                          │    │
│  │  Features:                                                               │    │
│  │  • Row Level Security (RLS)                                              │    │
│  │  • Real-time subscriptions                                               │    │
│  │  • Full-text search                                                      │    │
│  │  • Geographic queries (PostGIS)                                          │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                                                                  │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────────────────┐   │
│  │   Supabase Auth  │  │   Supabase       │  │   Supabase Storage           │   │
│  │   JWT + RLS      │  │   Realtime       │  │   Property Photos            │   │
│  └──────────────────┘  └──────────────────┘  └──────────────────────────────┘   │
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │                    Blockchain Layer                                      │    │
│  │                                                                          │    │
│  │  • Ethereum Mainnet (ETH, DAI, A7A5)                                    │    │
│  │  • RPC Providers: Infura, Alchemy, LlamaRPC                             │    │
│  │  • Transaction verification & confirmation tracking                     │    │
│  │  • Smart Contract: Aave Protocol (no custom contracts)                  │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                                                                  │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────────────────┐   │
│  │   Redis Cache    │  │   IPFS           │  │   External APIs              │   │
│  │   Sessions       │  │   Metadata       │  │   Aave, Price Feeds          │   │
│  └──────────────────┘  └──────────────────┘  └──────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## Data Flow

### Booking Flow

```
┌─────────┐     ┌─────────┐     ┌──────────┐     ┌─────────┐     ┌──────────┐     ┌─────────┐
│  Client │     │   API   │     │  Escrow  │     │Payment  │     │Blockchain│     │Supabase │
│         │     │         │     │  Service │     │Service  │     │   RPC    │     │   DB    │
└────┬────┘     └────┬────┘     └────┬─────┘     └────┬────┘     └────┬─────┘     └────┬────┘
     │               │                │                │                │                │
     │ CREATE BOOKING│                │                │                │                │
     │──────────────>│                │                │                │                │
     │               │                │                │                │                │
     │               │ CREATE ESCROW  │                │                │                │
     │               │───────────────>│                │                │                │
     │               │                │                │                │                │
     │               │                │ INSERT LEDGER  │                │                │
     │               │                │─────────────────────────────────────────────────>│
     │               │                │                │                │                │
     │               │ PAYMENT REQUEST│                │                │                │
     │               │────────────────────────────────>│                │                │
     │               │                │                │                │                │
     │ CONNECT WALLET│                │                │                │                │
     │─────────────────────────────────────────────────────────────────>│                │
     │               │                │                │                │                │
     │ SIGN TX       │                │                │                │                │
     │─────────────────────────────────────────────────────────────────>│                │
     │               │                │                │                │                │
     │               │                │                │ VERIFY TX      │                │
     │               │                │                │───────────────>│                │
     │               │                │                │                │                │
     │               │                │                │ TX CONFIRMED   │                │
     │               │                │                │<───────────────│                │
     │               │                │                │                │                │
     │               │                │ UPDATE STATUS  │                │                │
     │               │                │<─────────────────────────────────────────────────│
     │               │                │                │                │                │
     │ BOOKING PAID  │                │                │                │                │
     │<──────────────────────────────│                │                │                │
     │               │                │                │                │                │
```

### Vault Deposit Flow

```
┌─────────┐     ┌─────────┐     ┌──────────┐     ┌─────────┐     ┌──────────┐
│  Client │     │   API   │     │  Vault   │     │  Aave   │     │Supabase │
│         │     │         │     │  Service │     │Protocol │     │   DB    │
└────┬────┘     └────┬────┘     └────┬─────┘     └────┬────┘     └────┬────┘
     │               │                │                │                │
     │ DEPOSIT REQ   │                │                │                │
     │──────────────>│                │                │                │
     │               │                │                │                │
     │               │ CREATE POSITION│                │                │
     │               │───────────────>│                │                │
     │               │                │                │                │
     │               │                │ INSERT POSITION│                │
     │               │                │────────────────────────────────>│
     │               │                │                │                │
     │ APPROVE TOKEN │                │                │                │
     │────────────────────────────────────────────────>│                │
     │               │                │                │                │
     │ DEPOSIT TO    │                │                │                │
     │ AAVE POOL     │                │                │                │
     │────────────────────────────────────────────────>│                │
     │               │                │                │                │
     │               │                │                │ aTOKEN MINTED  │
     │               │                │                │<───────────────│
     │               │                │                │                │
     │               │                │ UPDATE POSITION│                │
     │               │                │<────────────────────────────────│
     │               │                │                │                │
     │ DEPOSIT DONE  │                │                │                │
     │<──────────────│                │                │                │
```

## Security Architecture

### Authentication & Authorization

```
┌─────────────────────────────────────────────────────────────┐
│                    Authentication Flow                       │
│                                                              │
│  User ──> Supabase Auth ──> JWT ──> RLS Policies ──> Data   │
│                                                              │
│  • Email/Password or OAuth                                   │
│  • JWT stored in httpOnly cookie                            │
│  • RLS enforces row-level access                            │
│  • Role-based permissions (Client/Host/Admin)               │
└─────────────────────────────────────────────────────────────┘
```

### Escrow Security

```
┌─────────────────────────────────────────────────────────────┐
│                    Escrow Security Model                     │
│                                                              │
│  State Transitions:                                          │
│  PENDING ──[Payment]──> PAYMENT_LOCKED                       │
│  PAYMENT_LOCKED ──[Check-in]──> CHECKED_IN                   │
│  CHECKED_IN ──[Complete]──> COMPLETED ──[Release]──> SETTLED │
│                                                              │
│  Security Rules:                                             │
│  ✓ Host cannot cancel after CHECKED_IN                       │
│  ✓ Admin cannot withdraw after CHECKED_IN                    │
│  ✓ All transitions logged in compliance_logs                 │
│  ✓ Transaction hash verified via RPC                         │
│  ✓ Minimum confirmations required (12 for ETH)               │
└─────────────────────────────────────────────────────────────┘
```

## Deployment Architecture

### Production Infrastructure

```
┌─────────────────────────────────────────────────────────────────┐
│                      Kubernetes Cluster                          │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                    Ingress Controller                     │    │
│  │  • NGINX Ingress                                          │    │
│  │  • TLS Termination (Let's Encrypt)                        │    │
│  │  • Rate Limiting                                          │    │
│  │  • WAF Integration                                        │    │
│  └─────────────────────────────────────────────────────────┘    │
│                              │                                   │
│              ┌───────────────┼───────────────┐                   │
│              │               │               │                   │
│       ┌──────▼──────┐ ┌──────▼──────┐ ┌──────▼──────┐           │
│       │   Pod 1     │ │   Pod 2     │ │   Pod 3     │           │
│       │  Next.js    │ │  Next.js    │ │  Next.js    │           │
│       │  (3000)     │ │  (3000)     │ │  (3000)     │           │
│       └──────┬──────┘ └──────┬──────┘ └──────┬──────┘           │
│              │               │               │                   │
│              └───────────────┼───────────────┘                   │
│                              │                                   │
│                    ┌─────────▼─────────┐                         │
│                    │   ClusterIP Svc   │                         │
│                    │   (Load Balance)  │                         │
│                    └─────────┬─────────┘                         │
│                              │                                   │
│         ┌────────────────────┼────────────────────┐              │
│         │                    │                    │              │
│  ┌──────▼──────┐     ┌──────▼──────┐     ┌──────▼──────┐        │
│  │  Supabase   │     │   Redis     │     │  External   │        │
│  │  Cloud      │     │   Cache     │     │   APIs      │        │
│  │  (Postgres) │     │             │     │  (Aave)     │        │
│  └─────────────┘     └─────────────┘     └─────────────┘        │
└─────────────────────────────────────────────────────────────────┘
```

## Monitoring & Observability

```
┌─────────────────────────────────────────────────────────────┐
│                   Monitoring Stack                            │
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │  Prometheus  │  │    Grafana   │  │    Sentry    │        │
│  │   Metrics    │  │  Dashboards  │  │   Errors     │        │
│  └──────────────┘  └──────────────┘  └──────────────┘        │
│                                                               │
│  Metrics Tracked:                                             │
│  • API Response Times                                         │
│  • Database Query Performance                                 │
│  • Blockchain RPC Latency                                     │
│  • Active Bookings                                            │
│  • TVL (Total Value Locked)                                   │
│  • User Sessions                                              │
│  • Error Rates                                                │
└─────────────────────────────────────────────────────────────┘
```

## Technology Decisions

| Component | Technology | Rationale |
|-----------|------------|-----------|
| **Framework** | Next.js 14 | SSR/SSG, App Router, React Server Components |
| **Database** | Supabase (PostgreSQL) | Built-in Auth, Realtime, RLS, easy scaling |
| **Web3** | Wagmi + viem | Type-safe, lightweight, React hooks |
| **Styling** | Tailwind CSS | Utility-first, consistent design system |
| **Components** | Radix UI + shadcn/ui | Accessible, customizable, no vendor lock-in |
| **State** | Zustand + React Query | Simple global state + server state caching |
| **Validation** | Zod | Runtime type safety, schema validation |
| **i18n** | next-i18next | Server-side i18n, SEO-friendly |
| **Deployment** | Kubernetes | Scalability, self-healing, rolling updates |
| **Blockchain** | Ethereum Mainnet | Security, liquidity, ecosystem |
