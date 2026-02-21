# Security Checklist for OpenBooking

## 🔐 Pre-Deployment Security Review

### Environment Variables

- [ ] `.env.local` added to `.gitignore`
- [ ] No hardcoded secrets in source code
- [ ] `SUPABASE_SERVICE_ROLE_KEY` not exposed to client
- [ ] Private keys stored in secure vault (not in repo)
- [ ] API keys rotated regularly

### Database Security

- [ ] Row Level Security (RLS) enabled on all tables
- [ ] Least privilege principle for database roles
- [ ] No direct database access from client
- [ ] Prepared statements used (Supabase handles this)
- [ ] Sensitive data encrypted at rest

### Authentication & Authorization

- [ ] JWT expiry set appropriately (1 hour default)
- [ ] Refresh token rotation enabled
- [ ] Password requirements enforced (min 8 chars, mixed case, numbers)
- [ ] Rate limiting on auth endpoints
- [ ] RBAC properly implemented (Client/Host/Admin)

### API Security

- [ ] Input validation with Zod schemas
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS prevention (React escapes by default)
- [ ] CSRF protection (Supabase handles this)
- [ ] Rate limiting enabled (100 req/min)
- [ ] CORS properly configured
- [ ] Security headers set (HSTS, CSP, X-Frame-Options)

### Payment Security

- [ ] Transaction hashes verified on-chain
- [ ] Minimum confirmations required (12 for ETH)
- [ ] Escrow state machine validated
- [ ] Host cannot cancel after CHECKED_IN
- [ ] Admin cannot withdraw after CHECKED_IN
- [ ] All transactions logged in `escrow_ledger`
- [ ] AML validation for large transactions

### Blockchain Security

- [ ] RPC endpoints validated
- [ ] Contract addresses verified (A7A5: `0x6fA0BE17e4beA2fCfA22ef89BF8ac9aab0AB0fc9`)
- [ ] Transaction replay protection
- [ ] Gas estimation before sending
- [ ] Slippage tolerance configured

### Infrastructure Security

- [ ] Docker containers run as non-root
- [ ] Kubernetes security contexts configured
- [ ] Network policies restrict pod communication
- [ ] Secrets managed via Kubernetes Secrets or external vault
- [ ] TLS enabled for all external communication
- [ ] WAF configured for DDoS protection

### Monitoring & Logging

- [ ] All auth events logged
- [ ] Payment events logged
- [ ] State transitions logged
- [ ] Compliance events logged
- [ ] Error tracking enabled (Sentry)
- [ ] No sensitive data in logs
- [ ] Log retention policy defined

### GDPR Compliance

- [ ] Cookie consent implemented
- [ ] Privacy policy available
- [ ] Data export functionality
- [ ] Right to be forgotten implemented
- [ ] Data minimization practiced
- [ ] First-party analytics preferred

### Code Quality

- [ ] ESLint passes with no errors
- [ ] TypeScript type checking passes
- [ ] No `any` types in critical code
- [ ] All functions have return types
- [ ] Error handling implemented
- [ ] Unit tests for critical functions
- [ ] E2E tests for critical flows

### Dependencies

- [ ] `npm audit` passes
- [ ] Dependencies up to date
- [ ] No known vulnerabilities
- [ ] License compliance checked

## 🚨 Critical Security Rules

### NEVER

1. Never commit `.env` files
2. Never commit private keys or secrets
3. Never expose `SUPABASE_SERVICE_ROLE_KEY` to client
4. Never disable RLS policies
5. Never skip transaction verification
6. Never log sensitive user data
7. Never use `eval()` or `dangerouslySetInnerHTML` with user input
8. Never trust client-side validation only

### ALWAYS

1. Always validate input server-side
2. Always use parameterized queries
3. Always verify blockchain transactions
4. Always log security events
5. Always use HTTPS in production
6. Always keep dependencies updated
7. Always review PRs for security issues
8. Always test with security mindset

## 📋 Security Testing

### Manual Testing

```bash
# Check for exposed secrets
grep -r "SK_" . --exclude-dir=node_modules --exclude-dir=.git
grep -r "private.*key" . --exclude-dir=node_modules --exclude-dir=.git
grep -r "password.*=" . --exclude-dir=node_modules --exclude-dir=.git

# Check .gitignore
cat .gitignore | grep -E "^\.env"

# Run security audit
npm audit

# Check for TypeScript errors
npm run type-check

# Run ESLint
npm run lint
```

### Automated Testing

- [ ] SAST scan (GitHub CodeQL)
- [ ] DAST scan (OWASP ZAP)
- [ ] Dependency scan (Snyk)
- [ ] Container scan (Trivy)

## 📞 Incident Response

### If Security Breach Detected

1. **Contain**: Isolate affected systems
2. **Assess**: Determine scope and impact
3. **Notify**: Alert security team
4. **Remediate**: Fix vulnerability
5. **Review**: Post-mortem analysis
6. **Document**: Update security procedures

### Contact

- Security Team: security@openbooking.com
- Emergency: +1-XXX-XXX-XXXX

---

**Last Updated**: 2026-02-21
**Next Review**: 2026-03-21
