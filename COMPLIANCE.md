# Compliance Checklist

## GDPR Compliance (EU)

### Data Processing

- [ ] Lawful basis for processing documented
- [ ] Privacy policy published and accessible
- [ ] Data processing agreements with vendors
- [ ] Data minimization implemented
- [ ] Purpose limitation enforced
- [ ] Storage limitation policy defined

### Data Subject Rights

- [ ] Right to access implemented
- [ ] Right to rectification implemented
- [ ] Right to erasure ("right to be forgotten") implemented
- [ ] Right to data portability implemented
- [ ] Right to object implemented
- [ ] Right to restrict processing implemented

### Consent Management

- [ ] Cookie consent banner implemented
- [ ] Granular consent options
- [ ] Consent withdrawal mechanism
- [ ] Consent records maintained
- [ ] Regular consent renewal

### Data Protection

- [ ] Data encryption at rest
- [ ] Data encryption in transit (TLS)
- [ ] Pseudonymization where possible
- [ ] Access controls implemented
- [ ] Data breach notification procedure
- [ ] DPIA conducted for high-risk processing

### Documentation

- [ ] Record of processing activities (ROPA)
- [ ] Data protection policy
- [ ] Data retention schedule
- [ ] International transfer safeguards

---

## CCPA Compliance (California)

### Consumer Rights

- [ ] Right to know what data is collected
- [ ] Right to know if data is sold/disclosed
- [ ] Right to opt-out of sale
- [ ] Right to access personal information
- [ ] Right to deletion
- [ ] Right to non-discrimination

### Disclosure Requirements

- [ ] Privacy policy with CCPA disclosures
- [ ] Categories of personal information listed
- [ ] Sources of information disclosed
- [ ] Business purpose for collection stated
- [ ] Third-party sharing disclosed

### Implementation

- [ ] "Do Not Sell My Personal Information" link
- [ ] Verifiable consumer request process
- [ ] Response timeline (45 days)
- [ ] No discrimination for exercising rights

---

## PCI DSS Compliance (Payment Cards)

### Note: OpenBooking uses third-party payment processors

- [ ] No card data stored on our servers
- [ ] Payment processors are PCI DSS compliant
- [ ] Secure transmission of payment data
- [ ] Access controls on payment systems
- [ ] Regular security testing

---

## AML/KYC Compliance

### Anti-Money Laundering

- [ ] Transaction monitoring implemented
- [ ] Large transaction reporting (>€10,000)
- [ ] Suspicious activity reporting
- [ ] Customer due diligence (CDD)
- [ ] Enhanced due diligence (EDD) for high-risk
- [ ] Record keeping (5 years minimum)

### Know Your Customer

- [ ] Identity verification process
- [ ] Address verification
- [ ] Sanctions screening
- [ ] PEP (Politically Exposed Person) screening
- [ ] Ongoing monitoring

### Implementation

- [ ] Risk-based approach
- [ ] Automated screening tools
- [ ] Manual review process
- [ ] Compliance officer appointed
- [ ] Staff training conducted

---

## Travel Regulations Compliance

### Short-term Rental Regulations

- [ ] Local registration requirements met
- [ ] Occupancy tax collection
- [ ] Tourist tax collection where applicable
- [ ] Host verification
- [ ] Property listing accuracy

### Consumer Protection

- [ ] Clear pricing disclosure
- [ ] Cancellation policy transparency
- [ ] Refund process defined
- [ ] Dispute resolution mechanism
- [ ] Customer support available

---

## Blockchain/Crypto Compliance

### Cryptocurrency Regulations

- [ ] Token classification documented
- [ ] No securities offered (utility tokens only)
- [ ] Transaction reporting where required
- [ ] Tax reporting assistance
- [ ] Sanctions compliance (OFAC)

### Smart Contract Disclaimer

- [ ] No custom smart contracts deployed
- [ ] Using established protocols only (Aave)
- [ ] Risk disclosures provided
- [ ] No investment advice given

---

## Accessibility Compliance (WCAG 2.1)

### Level AA Requirements

- [ ] Text alternatives for non-text content
- [ ] Captions for video content
- [ ] Audio descriptions for video
- [ ] Meaningful sequence maintained
- [ ] Color not sole means of conveying information
- [ ] Keyboard accessible
- [ ] No keyboard traps
- [ ] Enough time to read and use content
- [ ] No content that causes seizures
- [ ] Navigable content
- [ ] Clear labels and instructions
- [ ] Error prevention and correction
- [ ] Compatible with assistive technologies

---

## Implementation Status

| Regulation | Status | Last Audit | Next Audit |
|------------|--------|------------|------------|
| GDPR | 🟡 In Progress | - | 2026-06-01 |
| CCPA | 🟡 In Progress | - | 2026-06-01 |
| PCI DSS | 🟢 Compliant* | - | 2026-12-01 |
| AML/KYC | 🟡 In Progress | - | 2026-06-01 |
| WCAG 2.1 | 🟡 In Progress | - | 2026-06-01 |

*Via third-party payment processors

---

## Action Items

### Immediate

1. [ ] Publish privacy policy
2. [ ] Implement cookie consent
3. [ ] Set up data export functionality
4. [ ] Create data deletion process

### Short-term

1. [ ] Conduct DPIA
2. [ ] Implement consent management platform
3. [ ] Set up AML screening
4. [ ] Accessibility audit

### Long-term

1. [ ] Third-party security audit
2. [ ] Privacy by design training
3. [ ] Regular compliance reviews
4. [ ] Automated compliance monitoring

---

**Compliance Officer**: [TBD]
**Last Updated**: 2026-02-21
**Next Review**: 2026-03-21
