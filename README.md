# 👑 OpenBooking

> **Autonomous Trust Economy Platform**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61dafb?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss)](https://tailwindcss.com)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase)](https://supabase.com)

---

## 🎯 Vision

OpenBooking = **Trust Economy Protocol** + **AI Growth Company** + **Web3 Finance Infrastructure** + **Reputation Network** + **Global Travel OS**

## ✨ Key Features

| Feature | Description |
|---------|-------------|
| 🏦 **Escrow Protocol** | Secure payments with state machine protection |
| 💎 **DeFi Vault** | Earn yield on idle funds via Aave |
| 🌍 **Multi-Currency** | Crypto (USDT, ETH) + Fiat (SBP, SEPA, Mir) |
| 🤖 **AI System** | Auto-generate content, SEO, pricing |
| 📊 **Real-time** | Live metrics via WebSocket |
| 🧾 **Legal Engine** | Multi-language document CMS |
| 🌐 **i18n** | 9 languages supported |
| 🔐 **RBAC** | Client, Host, Admin roles |

## 🚀 Quick Start

```bash
# Clone repository
git clone https://github.com/zametkikostik/OpenBooking.git
cd OpenBooking

# Install dependencies
npm install

# Start local Supabase
supabase start

# Run development server
npm run dev
```

Open http://localhost:3000

## 📁 Project Structure

```
OpenBooking/
├── src/
│   ├── app/              # Next.js App Router
│   ├── components/       # React Components
│   ├── hooks/           # Custom Hooks
│   ├── i18n/            # Internationalization
│   ├── lib/             # Utilities
│   ├── services/        # Business Logic
│   └── types/           # TypeScript Types
├── supabase/            # Database Schema
└── .github/            # GitHub Templates
```

## 🗄️ Database Tables

- `profiles` — Users with RBAC
- `properties` — Listings
- `bookings` — Escrow state machine
- `payment_transactions` — Ledger
- `safe_vaults` — DeFi yield
- `reviews` — Ratings
- `legal_documents` — CMS
- `analytics_events` — GDPR-compliant tracking
- `notifications` — Real-time alerts
- `platform_metrics` — Live stats

## 🛠️ Tech Stack

**Frontend**
- Next.js 16 (App Router)
- React 19
- TypeScript 5
- Tailwind CSS 4
- Framer Motion
- next-intl

**Backend**
- Supabase (PostgreSQL + Auth)
- Row Level Security (RLS)
- Realtime subscriptions

**Web3**
- Viem
- Smart Contracts (Escrow)
- ERC20 Tokens

**Services**
- AI Content Generation
- DeFi (Aave)
- Payment Adapter
- Legal Engine

## 🌐 Supported Languages

🇺🇸 English · 🇷🇺 Русский · 🇧🇬 Български · 🇺🇦 Українська · 🇩🇪 Deutsch · 🇫🇷 Français · 🇪🇸 Español · 🇵🇱 Polski · 🇹🇷 Türkçe

## 📈 Roadmap

- [x] Core Platform
- [x] Escrow System
- [x] Multi-language
- [x] Legal Engine
- [ ] Mobile Apps
- [ ] NFT Marketplace
- [ ] DAO Governance

## 🤝 Contributing

We welcome contributions! See our [Contributing Guide](CONTRIBUTING.md) for details.

### Quick Start for Contributors

```bash
# Fork repository
# Clone your fork
git clone https://github.com/YOUR_USERNAME/OpenBooking.git

# Create feature branch
git checkout -b feature/amazing-feature

# Make changes and commit
git commit -m "feat: add amazing feature"

# Push and create PR
git push origin feature/amazing-feature
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

- **GitHub**: https://github.com/zametkikostik/OpenBooking
- **Email**: team@openbooking.io

---

<p align="center">
  <strong>Built with ❤️ for the decentralized future of travel</strong>
</p>
