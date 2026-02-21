# 🚀 Production Deployment Guide

## ✅ Pre-Deployment Checklist

### Code Quality
- [x] TypeScript type checking passes
- [x] ESLint passes (warnings only)
- [x] Build successful
- [x] All pages return 200 OK

### Features Ready
- [x] Homepage with active buttons
- [x] Authentication (Login/Signup)
- [x] Admin Dashboard
- [x] Client Dashboard
- [x] Host Dashboard
- [x] CMS System
- [x] i18n (4 languages)
- [x] Real-time metrics
- [x] DeFi Vault
- [x] Escrow Protocol

### Security
- [x] Environment variables configured
- [x] No secrets in code
- [x] RLS enabled on database
- [x] Security headers configured

---

## 📦 Deployment Options

### Option 1: Vercel (Recommended)

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Login
vercel login

# 3. Deploy
vercel --prod
```

**Auto-deploy on push:**
- Connect GitHub repo to Vercel
- Auto-deploy on every push to main

---

### Option 2: Docker + VPS

```bash
# Build Docker image
docker build -t openbooking .

# Run container
docker run -p 3000:3000 \
  --env-file .env.local \
  openbooking
```

**docker-compose.yml:**
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    restart: unless-stopped
```

---

### Option 3: Kubernetes

```bash
# Apply Kubernetes manifests
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
kubectl apply -f k8s/ingress.yaml
```

---

## 🔧 Environment Variables (Production)

Create `.env.production`:

```env
# Supabase Production
NEXT_PUBLIC_SUPABASE_URL=https://sibgxcagyylbqmjaykys.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# Ethereum RPC
ETH_RPC_URL=https://eth.llamarpc.com

# App Configuration
NEXT_PUBLIC_APP_URL=https://yourdomain.com

# Feature Flags
NEXT_PUBLIC_FEATURE_CRYPTO_PAYMENTS=true
NEXT_PUBLIC_FEATURE_FIAT_PAYMENTS=true
NEXT_PUBLIC_FEATURE_VAULT=true
NEXT_PUBLIC_FEATURE_AI_CONTENT=true
```

---

## 📊 Post-Deployment Checks

### 1. Check all pages
```bash
# Homepage
curl https://yourdomain.com

# Auth
curl https://yourdomain.com/auth/login
curl https://yourdomain.com/auth/signup

# Dashboard
curl https://yourdomain.com/dashboard/admin
curl https://yourdomain.com/dashboard/client
curl https://yourdomain.com/dashboard/host

# CMS
curl https://yourdomain.com/cms
curl https://yourdomain.com/cms/articles
```

### 2. Test authentication
- Register new user
- Login
- Quick admin login

### 3. Test dashboards
- Admin panel
- Client dashboard
- Host dashboard

### 4. Test CMS
- Create article
- Edit property
- Manage users

---

## 🎯 Production URLs

| Section | URL |
|---------|-----|
| **Homepage** | https://yourdomain.com |
| **Properties** | https://yourdomain.com/properties |
| **Vault** | https://yourdomain.com/vault |
| **About** | https://yourdomain.com/about |
| **Login** | https://yourdomain.com/auth/login |
| **Signup** | https://yourdomain.com/auth/signup |
| **Admin** | https://yourdomain.com/dashboard/admin |
| **CMS** | https://yourdomain.com/cms |

---

## 📝 Content Management

### Edit Content via CMS:
1. Login as admin (quick login button)
2. Go to /cms
3. Choose section:
   - **Articles** - Edit blog posts
   - **Properties** - Manage listings
   - **Users** - Manage users
   - **Legal** - Edit legal docs

### Edit Content via Code:
- Homepage: `app/page.tsx`
- About: `app/about/page.tsx`
- Footer: `components/layout/Footer.tsx`
- Header: `components/layout/Header.tsx`

---

## 🔒 Security Notes

### Production Security:
1. Use environment variables for secrets
2. Enable HTTPS
3. Configure CORS
4. Set up rate limiting
5. Enable monitoring (Sentry, etc.)
6. Regular backups

### Database Security:
- RLS enabled on all tables
- Only authenticated users can access data
- Admin role has elevated permissions

---

## 📞 Support

**Issues?**
- Check logs: `docker logs openbooking`
- Check Vercel dashboard
- Check GitHub Actions

**Contact:**
- Email: support@openbooking.com
- GitHub: https://github.com/zametkikostik/OpenBooking

---

**Ready for Production!** 🚀
