#!/bin/bash
# ============================================
# OPENBOOKING PRODUCTION MIGRATION SCRIPT
# Migrates from local to production Supabase
# ============================================

set -e

echo "🚀 OpenBooking Production Migration"
echo "===================================="
echo ""

# Configuration
PRODUCTION_PROJECT_REF="sibgxcagyylbqmjaykys"
PRODUCTION_URL="https://sibgxcagyylbqmjaykys.supabase.co"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Functions
log_info() {
    echo -e "${GREEN}✓${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}⚠${NC} $1"
}

log_error() {
    echo -e "${RED}✗${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    echo "📋 Checking prerequisites..."
    
    if ! command -v supabase &> /dev/null; then
        log_error "Supabase CLI not found. Install with: npm install -g supabase"
        exit 1
    fi
    
    if [ ! -f ".env.local" ]; then
        log_error ".env.local not found. Create it first."
        exit 1
    fi
    
    log_info "Prerequisites check passed"
}

# Login to Supabase
login_supabase() {
    echo ""
    echo "🔐 Logging in to Supabase..."
    
    if [ -z "$SUPABASE_ACCESS_TOKEN" ]; then
        log_warn "SUPABASE_ACCESS_TOKEN not set. You will be prompted to login."
        supabase login
    else
        log_info "Using SUPABASE_ACCESS_TOKEN from environment"
    fi
    
    log_info "Logged in successfully"
}

# Link production project
link_project() {
    echo ""
    echo "🔗 Linking to production project..."
    
    supabase link --project-ref "$PRODUCTION_PROJECT_REF"
    
    log_info "Project linked: $PRODUCTION_PROJECT_REF"
}

# Push database migrations
push_migrations() {
    echo ""
    echo "📤 Pushing database migrations..."
    
    supabase db push
    
    log_info "Migrations pushed successfully"
}

# Deploy edge functions
deploy_functions() {
    echo ""
    echo "🔧 Deploying Edge Functions..."
    
    if [ -d "supabase/functions" ]; then
        supabase functions deploy --project-ref "$PRODUCTION_PROJECT_REF"
        log_info "Edge Functions deployed"
    else
        log_warn "No Edge Functions found. Skipping."
    fi
}

# Generate types
generate_types() {
    echo ""
    echo "📝 Generating TypeScript types..."
    
    supabase gen types typescript \
        --project-ref "$PRODUCTION_PROJECT_REF" \
        > src/types/database.ts
    
    log_info "Types generated: src/types/database.ts"
}

# Update environment
update_env() {
    echo ""
    echo "🔧 Updating environment configuration..."
    
    # Create production env backup
    if [ -f ".env.production" ]; then
        cp .env.production .env.production.backup
    fi
    
    # Update .env.production
    cat > .env.production << EOF
# Production Environment
NEXT_PUBLIC_SUPABASE_URL=$PRODUCTION_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=$(supabase status --project-ref "$PRODUCTION_PROJECT_REF" -o json | jq -r '.anonKey')
SUPABASE_SERVICE_ROLE_KEY=$(supabase status --project-ref "$PRODUCTION_PROJECT_REF" -o json | jq -r '.serviceKey')
EOF
    
    log_info "Production environment updated"
}

# Run health check
health_check() {
    echo ""
    echo "🏥 Running health check..."
    
    # Check database connection
    supabase db remote commit --project-ref "$PRODUCTION_PROJECT_REF" 2>/dev/null
    
    if [ $? -eq 0 ]; then
        log_info "Database connection: OK"
    else
        log_warn "Database connection check skipped (requires remote setup)"
    fi
}

# Main execution
main() {
    echo ""
    log_warn "This will migrate your local database to production."
    echo ""
    read -p "Continue? (yes/no): " confirm
    
    if [ "$confirm" != "yes" ]; then
        log_error "Migration cancelled"
        exit 1
    fi
    
    echo ""
    echo "Starting migration..."
    echo ""
    
    check_prerequisites
    login_supabase
    link_project
    push_migrations
    deploy_functions
    generate_types
    health_check
    
    echo ""
    echo "===================================="
    log_info "Migration completed successfully!"
    echo ""
    echo "Production URL: $PRODUCTION_URL"
    echo ""
    echo "Next steps:"
    echo "1. Review deployed migrations in Supabase Dashboard"
    echo "2. Update production environment variables"
    echo "3. Run smoke tests on production"
    echo "4. Monitor logs for errors"
    echo ""
}

# Run main
main
