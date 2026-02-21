#!/bin/bash

# OpenBooking Setup Script
# This script sets up the local development environment

set -e

echo "🏠 OpenBooking Setup Script"
echo "==========================="
echo ""

# Check Node.js version
echo "📦 Checking Node.js version..."
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
    echo "❌ Error: Node.js version must be 20 or higher"
    exit 1
fi
echo "✅ Node.js version: $(node -v)"

# Check npm version
echo "📦 Checking npm version..."
NPM_VERSION=$(npm -v | cut -d'.' -f1)
if [ "$NPM_VERSION" -lt 10 ]; then
    echo "⚠️  Warning: npm version should be 10 or higher"
fi
echo "✅ npm version: $(npm -v)"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

# Check if Supabase CLI is installed
echo ""
echo "🔍 Checking Supabase CLI..."
if ! command -v supabase &> /dev/null; then
    echo "⚠️  Supabase CLI not found. Installing..."
    npm install -g supabase
fi
echo "✅ Supabase CLI: $(supabase --version)"

# Initialize Supabase if not already done
echo ""
echo "🔧 Initializing Supabase..."
if [ ! -f "supabase/config.toml" ]; then
    supabase init
fi

# Start Supabase local stack
echo ""
echo "🚀 Starting Supabase local stack..."
echo "   This may take a few minutes on first run..."
supabase start

# Get local environment variables
echo ""
echo "📝 Setting up local environment..."
SUPABASE_URL=$(supabase status -o env | grep SUPABASE_URL | cut -d'=' -f2)
SUPABASE_ANON_KEY=$(supabase status -o env | grep SUPABASE_ANON_KEY | cut -d'=' -f2)
SUPABASE_SERVICE_ROLE_KEY=$(supabase status -o env | grep SUPABASE_SERVICE_ROLE_KEY | cut -d'=' -f2)

# Create .env.local if it doesn't exist
if [ ! -f ".env.local" ]; then
    cat > .env.local << EOF
# Supabase Local
NEXT_PUBLIC_SUPABASE_URL=$SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=$SUPABASE_SERVICE_ROLE_KEY

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

# Feature Flags
NEXT_PUBLIC_FEATURE_CRYPTO_PAYMENTS=true
NEXT_PUBLIC_FEATURE_FIAT_PAYMENTS=true
NEXT_PUBLIC_FEATURE_VAULT=true
NEXT_PUBLIC_FEATURE_AI_CONTENT=true
EOF
    echo "✅ Created .env.local"
else
    echo "✅ .env.local already exists"
fi

# Run database migrations
echo ""
echo "🗄️  Running database migrations..."
supabase migration up

# Generate TypeScript types
echo ""
echo "📝 Generating TypeScript types..."
npm run db:generate || echo "⚠️  Could not generate types (optional)"

# Create git hooks
echo ""
echo "🪝 Setting up git hooks..."
npm run prepare || echo "⚠️  Could not set up husky (optional)"

echo ""
echo "==========================================="
echo "✅ Setup complete!"
echo ""
echo "🚀 Next steps:"
echo "   1. Run 'npm run dev' to start the development server"
echo "   2. Open http://localhost:3000 in your browser"
echo "   3. Supabase Studio: http://localhost:54323"
echo ""
echo "📚 Useful commands:"
echo "   npm run dev       - Start development server"
echo "   npm run build     - Build for production"
echo "   npm run lint      - Run ESLint"
echo "   supabase status   - Check Supabase local status"
echo "   supabase stop     - Stop Supabase local stack"
echo ""
echo "==========================================="
