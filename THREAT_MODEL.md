# Threat Model - OpenBooking

## Overview

This document outlines the threat model for the OpenBooking platform, identifying potential security threats and mitigation strategies.

## System Components

1. **Client Application** (Next.js SPA)
2. **API Layer** (Next.js API Routes)
3. **Database** (Supabase PostgreSQL)
4. **Blockchain** (Ethereum Mainnet)
5. **External Services** (Aave, Payment Gateways)

## Trust Boundaries

```
┌─────────────────────────────────────────────────────────────┐
│                      Untrusted Zone                          │
│  ┌─────────────┐                                            │
│  │   Internet  │                                            │
│  └──────┬──────┘                                            │
│         │                                                    │
│         ▼                                                    │
│  ┌─────────────┐     Trust Boundary #1                       │
│  │   Client    │─────────────────────────────────┐          │
│  │  (Browser)  │                                  │          │
│  └──────┬──────┘                                  │          │
│         │                                         ▼          │
│  ┌──────┴──────────────────────────────────┐   ┌──────────┐ │
│  │           Trust Boundary #2              │   │  WAF     │ │
│  │                                          ▼   │          │ │
│  │  ┌─────────────┐     ┌─────────────┐   ┌───┴──┴──────┐ │ │
│  │  │  API Layer  │────▶│  Services   │──▶│  Database   │ │ │
│  │  │             │     │             │   │  (Supabase) │ │ │
│  │  └─────────────┘     └──────┬──────┘   └─────────────┘ │ │
│  │                             │                            │ │
│  │         Trust Boundary #3   │                            │ │
│  │                             ▼                            │ │
│  │  ┌───────────────────────────────────────────────────┐   │ │
│  │  │              External Services                     │   │ │
│  │  │  ┌─────────┐  ┌─────────┐  ┌─────────────────┐    │   │ │
│  │  │  │Blockchain│  │  Aave  │  │ Payment Gateways │    │   │ │
│  │  │  └─────────┘  └─────────┘  └─────────────────┘    │   │ │
│  │  └───────────────────────────────────────────────────┘   │ │
│  └──────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## STRIDE Analysis

### 1. Spoofing

| Threat | Description | Mitigation |
|--------|-------------|------------|
| Credential Theft | Attacker steals user credentials | - Supabase Auth with secure JWT<br>- HttpOnly cookies<br>- Rate limiting on login |
| Session Hijacking | Attacker steals session token | - Short JWT expiry (1h)<br>- Refresh token rotation<br>- Secure cookie flags |
| Wallet Impersonation | Attacker uses stolen wallet | - User must sign messages<br>- Nonce-based verification<br>- Transaction confirmation |

### 2. Tampering

| Threat | Description | Mitigation |
|--------|-------------|------------|
| Database Manipulation | Unauthorized data modification | - Row Level Security (RLS)<br>- Prepared statements<br>- Audit logging |
| Transaction Tampering | Modifying payment transactions | - Blockchain verification<br>- Transaction hash validation<br>- Confirmation requirements |
| Parameter Tampering | Modifying API request parameters | - Input validation (Zod)<br>- Server-side validation<br>- Idempotency keys |

### 3. Repudiation

| Threat | Description | Mitigation |
|--------|-------------|------------|
| Transaction Denial | User denies making transaction | - Blockchain immutable record<br>- Transaction receipts<br>- Comprehensive logging |
| Action Denial | User denies performing action | - Audit trail in compliance_logs<br>- IP address logging<br>- User agent tracking |

### 4. Information Disclosure

| Threat | Description | Mitigation |
|--------|-------------|------------|
| Data Breach | Unauthorized data access | - RLS policies<br>- Encryption at rest<br>- Minimal data collection |
| API Data Leak | API exposes sensitive data | - Least privilege access<br>- Field-level permissions<br>- No sensitive data in logs |
| Blockchain Privacy | On-chain data analysis | - Minimal on-chain data<br>- Privacy-focused design<br>- No PII in transactions |

### 5. Denial of Service

| Threat | Description | Mitigation |
|--------|-------------|------------|
| API Flood | Excessive API requests | - Rate limiting (100 req/min)<br>- Request throttling<br>- CDN caching |
| Database Exhaustion | Resource-intensive queries | - Query limits<br>- Connection pooling<br>- Read replicas |
| Blockchain Congestion | Network congestion | - Gas price optimization<br>- Transaction batching<br>- Fallback RPC providers |

### 6. Elevation of Privilege

| Threat | Description | Mitigation |
|--------|-------------|------------|
| Role Escalation | User escalates to higher role | - Server-side role validation<br>- RLS policies<br>- Admin action logging |
| Host Privilege | Host accesses other hosts' data | - Host-specific RLS<br>- Property ownership validation<br>- Booking isolation |
| Admin Abuse | Admin misuses privileges | - Admin action logging<br>- Multi-sig for critical ops<br>- Audit trail |

## Attack Vectors

### External Attacks

```
┌─────────────────────────────────────────────────────────────┐
│                    External Attack Vectors                   │
│                                                              │
│  1. SQL Injection                                           │
│     Vector: API parameters                                   │
│     Mitigation: Parameterized queries (Supabase)             │
│                                                              │
│  2. XSS (Cross-Site Scripting)                              │
│     Vector: User input fields                                │
│     Mitigation: React escaping, CSP headers                  │
│                                                              │
│  3. CSRF (Cross-Site Request Forgery)                       │
│     Vector: Malicious websites                               │
│     Mitigation: CSRF tokens, SameSite cookies                │
│                                                              │
│  4. Man-in-the-Middle                                       │
│     Vector: Network traffic                                  │
│     Mitigation: HTTPS/TLS, HSTS                              │
│                                                              │
│  5. DDoS                                                    │
│     Vector: High volume requests                             │
│     Mitigation: Rate limiting, WAF, CDN                      │
└─────────────────────────────────────────────────────────────┘
```

### Internal Attacks

```
┌─────────────────────────────────────────────────────────────┐
│                    Internal Attack Vectors                   │
│                                                              │
│  1. Privileged User Abuse                                   │
│     Vector: Admin/Host access                               │
│     Mitigation: Audit logging, least privilege               │
│                                                              │
│  2. Data Exfiltration                                       │
│     Vector: Database access                                  │
│     Mitigation: RLS, data masking, monitoring                │
│                                                              │
│  3. Credential Misuse                                       │
│     Vector: Stolen credentials                               │
│     Mitigation: MFA, session management                      │
└─────────────────────────────────────────────────────────────┘
```

## Risk Assessment

| Risk | Likelihood | Impact | Risk Level | Priority |
|------|------------|--------|------------|----------|
| Credential Theft | Medium | High | High | P1 |
| SQL Injection | Low | High | Medium | P2 |
| XSS Attack | Medium | Medium | Medium | P2 |
| DDoS Attack | High | Medium | High | P1 |
| Data Breach | Low | High | Medium | P2 |
| Privilege Escalation | Low | High | Medium | P2 |
| Blockchain Attack | Low | High | Medium | P2 |

## Security Controls

### Preventive Controls

- Input validation (Zod)
- Authentication (Supabase Auth)
- Authorization (RLS + RBAC)
- Encryption (TLS, at-rest)
- Rate limiting
- WAF

### Detective Controls

- Audit logging
- Compliance logs
- Error tracking (Sentry)
- Real-time monitoring
- Anomaly detection

### Corrective Controls

- Incident response plan
- Backup and recovery
- Rollback procedures
- Security patches

## Security Recommendations

### Immediate (P1)

1. Enable RLS on all tables
2. Implement rate limiting
3. Configure security headers
4. Set up monitoring and alerting
5. Enable MFA for admin accounts

### Short-term (P2)

1. Implement comprehensive audit logging
2. Set up WAF rules
3. Configure DDoS protection
4. Implement backup strategy
5. Conduct penetration testing

### Long-term (P3)

1. Implement zero-trust architecture
2. Deploy SIEM solution
3. Automate security scanning
4. Establish bug bounty program
5. Regular security training

---

**Document Version**: 1.0
**Last Updated**: 2026-02-21
**Next Review**: 2026-05-21
