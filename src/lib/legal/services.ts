// ============================================
// OPENBOOKING LEGAL ENGINE
// Multi-language legal documents with versioning
// ============================================

import type { legal_doc_type, Database } from '@/types/database'
import { createServerClient } from '@/lib/supabase/client'

// ============================================
// LEGAL DOCUMENT TYPES
// ============================================

export interface LegalDocument {
  id: string
  docType: legal_doc_type
  version: string
  language: string
  title: string
  content: string
  summary: string
  effectiveDate: string
  status: 'draft' | 'active' | 'archived'
  isRequired: boolean
  acceptanceRequiredFor: ('client' | 'host' | 'admin')[]
}

export interface DocumentAcceptance {
  documentId: string
  userId: string
  accepted: boolean
  acceptedAt: string
  documentVersion: string
  ipAddress: string
  userAgent: string
}

// ============================================
// LEGAL TEMPLATES
// ============================================

export const LEGAL_TEMPLATES: Record<legal_doc_type, Record<string, {
  title: string
  content: string
  summary: string
}>> = {
  terms_of_service: {
    en: {
      title: 'Terms of Service',
      summary: 'Rules and guidelines for using OpenBooking platform',
      content: `
# TERMS OF SERVICE

**Last Updated:** {effective_date}
**Version:** {version}

## 1. ACCEPTANCE OF TERMS

By accessing or using OpenBooking ("the Platform"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, do not use the Platform.

## 2. DESCRIPTION OF SERVICE

OpenBooking is a decentralized booking platform that connects property hosts with guests. The Platform facilitates:
- Property listings and bookings
- Secure payment processing via escrow
- Review and reputation system
- Web3 integration for crypto payments

## 3. USER ACCOUNTS

### 3.1 Account Creation
To use certain features, you must create an account. You agree to:
- Provide accurate and complete information
- Maintain the security of your account
- Notify us immediately of unauthorized access

### 3.2 Account Types
- **Guest**: Users who book properties
- **Host**: Users who list properties
- **Admin**: Platform administrators

## 4. BOOKING AND PAYMENT

### 4.1 Booking Process
1. Guest selects property and dates
2. Payment is locked in escrow smart contract
3. Host confirms booking
4. Upon check-in, funds remain locked
5. After completion, funds are released to host

### 4.2 Payment Methods
We accept:
- Cryptocurrencies: USDT, USDC, ETH, OBT Token
- Fiat: Various payment gateways by region

### 4.3 Escrow Protection
All payments are protected by our escrow system:
- Hosts cannot cancel after check-in
- Admins cannot withdraw funds arbitrarily
- Disputes are resolved through our protocol

## 5. CANCELLATION POLICY

### 5.1 Guest Cancellation
- Before check-in: Full refund minus service fee
- After check-in: No refund (host protection)

### 5.2 Host Cancellation
- Before check-in: Full refund to guest
- After check-in: Not permitted

## 6. PROHIBITED ACTIVITIES

Users may not:
- List properties they do not own or manage
- Discriminate against guests or hosts
- Use the platform for illegal activities
- Attempt to circumvent payment systems
- Harass or abuse other users

## 7. INTELLECTUAL PROPERTY

All content on the Platform is owned by OpenBooking or its licensors. Users may not:
- Copy, modify, or distribute Platform content
- Use automated systems to access the Platform
- Reverse engineer the Platform

## 8. DISCLAIMER OF WARRANTIES

THE PLATFORM IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED.

## 9. LIMITATION OF LIABILITY

OPENBOOKING'S TOTAL LIABILITY SHALL NOT EXCEED THE AMOUNT PAID BY YOU IN THE LAST 12 MONTHS.

## 10. INDEMNIFICATION

You agree to indemnify and hold harmless OpenBooking from any claims arising from your use of the Platform.

## 11. GOVERNING LAW

These Terms shall be governed by the laws of the jurisdiction where OpenBooking operates.

## 12. CHANGES TO TERMS

We may update these Terms at any time. Continued use constitutes acceptance of new Terms.

## 13. CONTACT

For questions, contact: legal@openbooking.com
`
    },
    ru: {
      title: 'Условия использования',
      summary: 'Правила и рекомендации по использованию платформы OpenBooking',
      content: `
# УСЛОВИЯ ИСПОЛЬЗОВАНИЯ

**Последнее обновление:** {effective_date}
**Версия:** {version}

## 1. ПРИНЯТИЕ УСЛОВИЙ

Используя платформу OpenBooking, вы соглашаетесь с данными Условиями.

## 2. ОПИСАНИЕ СЕРВИСА

OpenBooking — это децентрализованная платформа бронирования, соединяющая владельцев жилья с гостями.

## 3. УЧЕТНЫЕ ЗАПИСИ

### 3.1 Создание аккаунта
- Предоставляйте точную информацию
- Поддерживайте безопасность аккаунта

### 3.2 Типы аккаунтов
- **Гость**: Пользователи, бронирующие жилье
- **Хост**: Пользователи, размещающие жилье
- **Админ**: Администраторы платформы

## 4. БРОНИРОВАНИЕ И ОПЛАТА

### 4.1 Процесс бронирования
1. Гость выбирает жилье и даты
2. Оплата блокируется в смарт-контракте эскроу
3. Хост подтверждает бронирование
4. После заселения средства остаются заблокированными
5. После завершения средства переводятся хосту

## 5. ОТМЕНА БРОНИРОВАНИЯ

### 5.1 Отмена гостем
- До заселения: Полный возврат минус сервисный сбор
- После заселения: Без возврата

## 6. ЗАПРЕЩЕННАЯ ДЕЯТЕЛЬНОСТЬ

Запрещается:
- Размещать жилье, которым не владеете
- Дискриминировать пользователей
- Использовать платформу для незаконной деятельности

## 7. ИНТЕЛЛЕКТУАЛЬНАЯ СОБСТВЕННОСТЬ

Весь контент принадлежит OpenBooking или лицензиарам.

## 8. ОТКАЗ ОТ ГАРАНТИЙ

ПЛАТФОРМА ПРЕДОСТАВЛЯЕТСЯ "КАК ЕСТЬ" БЕЗ ГАРАНТИЙ.

## 9. ОГРАНИЧЕНИЕ ОТВЕТСТВЕННОСТИ

МАКСИМАЛЬНАЯ ОТВЕТСТВЕННОСТЬ НЕ ПРЕВЫШАЕТ СУММУ, УПЛАЧЕННУЮ ВАМИ ЗА 12 МЕСЯЦЕВ.

## 10. КОНТАКТЫ

Вопросы: legal@openbooking.com
`
    },
    es: {
      title: 'Términos de Servicio',
      summary: 'Reglas y pautas para usar OpenBooking',
      content: `
# TÉRMINOS DE SERVICIO

**Última actualización:** {effective_date}
**Versión:** {version}

## 1. ACEPTACIÓN DE TÉRMINOS

Al usar OpenBooking, aceptas estos Términos de Servicio.

## 2. DESCRIPCIÓN DEL SERVICIO

OpenBooking es una plataforma de reservas descentralizada.

## 3. CUENTAS DE USUARIO

### 3.1 Creación de Cuenta
- Proporciona información precisa
- Mantén la seguridad de tu cuenta

## 4. RESERVAS Y PAGOS

### 4.1 Proceso de Reserva
1. El huésped selecciona propiedad y fechas
2. El pago se bloquea en contrato de depósito en garantía
3. El anfitrión confirma
4. Los fondos se liberan después de completar

## 5. POLÍTICA DE CANCELACIÓN

### 5.1 Cancelación del Huésped
- Antes del check-in: Reembolso completo menos tarifa
- Después del check-in: Sin reembolso

## 6. ACTIVIDADES PROHIBIDAS

No se permite:
- Listar propiedades que no posees
- Discriminar usuarios
- Usar la plataforma para actividades ilegales

## 7. CONTACTO

Preguntas: legal@openbooking.com
`
    }
  },
  
  privacy_policy: {
    en: {
      title: 'Privacy Policy',
      summary: 'How we collect, use, and protect your personal data',
      content: `
# PRIVACY POLICY

**Last Updated:** {effective_date}
**Version:** {version}

## 1. INTRODUCTION

OpenBooking ("we", "us", "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your personal data.

## 2. DATA WE COLLECT

### 2.1 Information You Provide
- Account information (name, email, phone)
- Payment information
- Property details (for hosts)
- Reviews and ratings
- Communications with us

### 2.2 Information Collected Automatically
- Device information
- IP address and location
- Usage data
- Cookies and similar technologies

### 2.3 Web3 Data
- Wallet address
- Blockchain transaction history
- Smart contract interactions

## 3. HOW WE USE YOUR DATA

We use your data to:
- Provide and maintain the Platform
- Process bookings and payments
- Verify your identity (KYC/AML)
- Communicate with you
- Improve our services
- Detect and prevent fraud
- Comply with legal obligations

## 4. DATA SHARING

We share your data with:
- **Hosts/Guests**: As necessary for bookings
- **Payment Processors**: For transaction processing
- **Service Providers**: For platform operations
- **Legal Authorities**: When required by law

## 5. DATA RETENTION

We retain your data for:
- Active accounts: Indefinitely (until deletion request)
- Closed accounts: 7 years (legal requirement)
- Transaction data: 10 years (financial regulations)

## 6. YOUR RIGHTS

You have the right to:
- Access your data
- Correct inaccurate data
- Delete your data (with exceptions)
- Export your data (portability)
- Object to processing
- Withdraw consent

## 7. COOKIES

We use cookies for:
- Essential platform functionality
- Analytics (first-party, GDPR compliant)
- User preferences

You can manage cookie preferences in your browser settings.

## 8. DATA SECURITY

We implement:
- Encryption (in transit and at rest)
- Access controls
- Regular security audits
- Incident response procedures

## 9. INTERNATIONAL TRANSFERS

Your data may be transferred to:
- Countries where we operate
- Countries with adequate protection measures
- Countries with appropriate safeguards (SCCs)

## 10. CHILDREN'S PRIVACY

Our services are not intended for children under 18. We do not knowingly collect data from children.

## 11. CHANGES TO THIS POLICY

We may update this Privacy Policy. We will notify you of material changes.

## 12. CONTACT

For privacy questions: privacy@openbooking.com
Data Protection Officer: dpo@openbooking.com
`
    },
    ru: {
      title: 'Политика конфиденциальности',
      summary: 'Как мы собираем, используем и защищаем ваши персональные данные',
      content: `
# ПОЛИТИКА КОНФИДЕНЦИАЛЬНОСТИ

**Последнее обновление:** {effective_date}
**Версия:** {version}

## 1. ВВЕДЕНИЕ

OpenBooking обязуется защищать вашу конфиденциальность.

## 2. СОБИРАЕМЫЕ ДАННЫЕ

### 2.1 Предоставляемая информация
- Информация аккаунта (имя, email, телефон)
- Платежная информация
- Данные о жилье (для хостов)
- Отзывы и оценки

### 2.2 Автоматически собираемая информация
- Информация об устройстве
- IP-адрес и местоположение
- Данные использования
- Cookies

### 2.3 Web3 данные
- Адрес кошелька
- История транзакций в блокчейне

## 3. ИСПОЛЬЗОВАНИЕ ДАННЫХ

Мы используем данные для:
- Предоставления услуг
- Обработки бронирований и платежей
- Верификации личности (KYC/AML)
- Связи с вами
- Улучшения сервисов
- Предотвращения мошенничества

## 4. ПЕРЕДАЧА ДАННЫХ

Передаем данные:
- Хостам/Гостям: Для бронирований
- Платежным процессорам: Для транзакций
- Поставщикам услуг: Для операций
- Органам власти: По требованию закона

## 5. ХРАНЕНИЕ ДАННЫХ

- Активные аккаунты: Бессрочно
- Закрытые аккаунты: 7 лет
- Транзакции: 10 лет

## 6. ВАШИ ПРАВА

Вы имеете право:
- Доступ к данным
- Исправление данных
- Удаление данных
- Экспорт данных
- Возражение против обработки

## 7. COOKIES

Используем cookies для:
- Функциональности платформы
- Аналитики
- Предпочтений пользователя

## 8. БЕЗОПАСНОСТЬ ДАННЫХ

- Шифрование
- Контроль доступа
- Аудит безопасности

## 9. КОНТАКТЫ

privacy@openbooking.com
`
    }
  },
  
  host_agreement: {
    en: {
      title: 'Host Agreement',
      summary: 'Terms and conditions for property hosts',
      content: `
# HOST AGREEMENT

**Last Updated:** {effective_date}
**Version:** {version}

## 1. OVERVIEW

This Host Agreement governs your use of OpenBooking as a property host.

## 2. HOST RESPONSIBILITIES

### 2.1 Property Listing
- Provide accurate property information
- Upload genuine photos
- Keep calendar up to date
- Respond to inquiries within 24 hours

### 2.2 Guest Experience
- Provide clean and safe accommodation
- Honor confirmed bookings
- Respect guest privacy
- Address issues promptly

### 2.3 Compliance
- Comply with local laws and regulations
- Obtain necessary permits and licenses
- Pay applicable taxes
- Maintain insurance coverage

## 3. PRICING AND FEES

### 3.1 Setting Prices
- You set base price, cleaning fee, security deposit
- OpenBooking charges service fee (displayed to guests)
- Dynamic pricing tools available

### 3.2 Payment Schedule
- Payment released 24 hours after check-in
- Payout methods: Bank transfer, Crypto
- Processing time: 1-5 business days

## 4. CANCELLATIONS

### 4.1 Host Cancellations
- Strongly discouraged
- May result in penalties:
  - Fine for guest rebooking costs
  - Calendar blocked for cancelled dates
  - Account suspension for repeated cancellations

### 4.2 After Check-In
- Cancellation NOT permitted
- Escrow protects guest stay

## 5. REVIEWS

- Leave honest reviews for guests
- Reviews are public and permanent
- Retaliation reviews prohibited

## 6. NON-DISCRIMINATION

You may not discriminate based on:
- Race, ethnicity, national origin
- Religion, sexual orientation, gender identity
- Age, disability, family status

## 7. TERMINATION

We may suspend or terminate your account for:
- Violating this Agreement
- Fraudulent activity
- Consistent poor performance
- Legal requirements

## 8. INDEMNIFICATION

You agree to indemnify OpenBooking from claims arising from:
- Your property
- Your actions or omissions
- Guest injuries or damages

## 9. CONTACT

Host support: hosts@openbooking.com
`
    }
  },
  
  guest_agreement: {
    en: {
      title: 'Guest Agreement',
      summary: 'Terms and conditions for guests',
      content: `
# GUEST AGREEMENT

**Last Updated:** {effective_date}
**Version:** {version}

## 1. OVERVIEW

This Guest Agreement governs your use of OpenBooking as a guest.

## 2. GUEST RESPONSIBILITIES

### 2.1 Booking
- Provide accurate information
- Read property details carefully
- Respect house rules
- Communicate with host

### 2.2 During Stay
- Treat property with respect
- Follow check-in/check-out procedures
- Report issues to host immediately
- No unauthorized parties or events

### 2.3 After Stay
- Leave property in good condition
- Submit honest review
- Report any damages

## 3. PAYMENT

### 3.1 Payment Security
- All payments held in escrow
- Funds released after check-in
- Protected against fraud

### 3.2 Accepted Methods
- Crypto: USDT, USDC, ETH, OBT
- Fiat: Various by region

## 4. CANCELLATION AND REFUNDS

### 4.1 Guest Cancellation
- Before check-in: Full refund minus service fee
- After check-in: No refund (escrow protection)

### 4.2 Host Cancellation
- Full refund to guest
- Additional compensation may apply

## 5. PROHIBITED ACTIVITIES

Guests may not:
- Use property for illegal activities
- Exceed maximum occupancy
- Smoke in non-smoking properties
- Bring pets without approval
- Sublet without permission

## 6. DAMAGE POLICY

- Report damages to host immediately
- Security deposit may be withheld
- Additional charges may apply
- Disputes resolved through platform

## 7. CONTACT

Guest support: guests@openbooking.com
`
    }
  },
  
  offer_contract: {
    en: {
      title: 'Offer Contract',
      summary: 'Legal contract between host and guest',
      content: `
# OFFER CONTRACT

**Contract ID:** {booking_id}
**Date:** {created_at}

## PARTIES

**Host:** {host_name}
**Guest:** {guest_name}

## PROPERTY

**Address:** {property_address}
**Type:** {property_type}

## STAY DETAILS

**Check-in:** {check_in_date}
**Check-out:** {check_out_date}
**Nights:** {nights}
**Guests:** {guests_count}

## PAYMENT

**Subtotal:** {subtotal}
**Cleaning Fee:** {cleaning_fee}
**Service Fee:** {service_fee}
**Total:** {total_amount}

## TERMS

1. Host agrees to provide accommodation as described
2. Guest agrees to follow house rules
3. Payment held in escrow until check-in
4. Cancellation policy applies
5. Both parties agree to platform Terms of Service

## ELECTRONIC SIGNATURE

By completing this booking, both parties agree to these terms.

**Booking ID:** {booking_id}
**Blockchain Hash:** {blockchain_tx_hash}
`
    }
  },
  
  cancellation_policy: {
    en: {
      title: 'Cancellation Policy',
      summary: 'Rules for booking cancellations and refunds',
      content: `
# CANCELLATION POLICY

**Last Updated:** {effective_date}

## 1. GUEST CANCELLATION

### 1.1 Before Check-In
- Full refund of accommodation cost
- Service fee non-refundable
- Request cancellation through platform

### 1.2 After Check-In
- No refund available
- Escrow protection in effect
- Early departure does not qualify for refund

## 2. HOST CANCELLATION

### 2.1 Before Check-In
- Full refund to guest
- Host may be penalized
- Platform will assist with rebooking

### 2.2 After Check-In
- NOT PERMITTED
- Escrow prevents host cancellation
- Guest stay protected

## 3. EXTENUATING CIRCUMSTANCES

Full refund available for:
- Natural disasters
- Government travel restrictions
- Serious illness (documentation required)
- Death in family

## 4. DISPUTE RESOLUTION

If cancellation dispute arises:
1. Contact host/guest directly
2. Escalate to platform support
3. Provide documentation
4. Platform makes final decision

## 5. REFUND PROCESSING

- Refunds processed within 5-10 business days
- Original payment method used
- Crypto refunds in same token
`
    }
  },
  
  data_processing_agreement: {
    en: {
      title: 'Data Processing Agreement',
      summary: 'GDPR-compliant data processing terms',
      content: `
# DATA PROCESSING AGREEMENT

**Effective Date:** {effective_date}

## 1. PARTIES

**Data Controller:** User (Guest/Host)
**Data Processor:** OpenBooking

## 2. PURPOSE

Personal data processed for:
- Booking facilitation
- Payment processing
- Identity verification
- Customer support
- Legal compliance

## 3. DATA CATEGORIES

Processed data includes:
- Identity data (name, email, phone)
- Financial data (payment info)
- Transaction data (bookings, reviews)
- Technical data (device, IP, cookies)
- Web3 data (wallet address, transactions)

## 4. PROCESSING PRINCIPLES

OpenBooking commits to:
- Lawful, fair, transparent processing
- Purpose limitation
- Data minimization
- Accuracy
- Storage limitation
- Integrity and confidentiality

## 5. SUB-PROCESSORS

OpenBooking engages:
- Cloud hosting providers
- Payment processors
- Identity verification services
- Communication platforms

## 6. INTERNATIONAL TRANSFERS

Data may be transferred with:
- Adequacy decisions
- Standard Contractual Clauses
- Binding Corporate Rules

## 7. DATA SUBJECT RIGHTS

Supported rights:
- Access (Article 15)
- Rectification (Article 16)
- Erasure (Article 17)
- Portability (Article 20)
- Objection (Article 21)

## 8. SECURITY MEASURES

Technical measures:
- Encryption (TLS, AES-256)
- Access controls
- Pseudonymization
- Regular testing

Organizational measures:
- Staff training
- Confidentiality agreements
- Incident response plan

## 9. DATA BREACH

In case of breach:
- Notify within 72 hours
- Document breach details
- Cooperate with investigation
- Implement remediation

## 10. TERM AND TERMINATION

Agreement effective while using platform.
Data retained per retention policy after termination.
`
    }
  }
}

// ============================================
// LEGAL SERVICE
// ============================================

export class LegalService {
  private supabase
  
  constructor() {
    this.supabase = null as any
  }
  
  async init() {
    this.supabase = await createServerClient()
  }
  
  /**
   * Get active legal document by type and language
   */
  async getDocument(
    docType: legal_doc_type,
    language: string = 'en'
  ): Promise<LegalDocument | null> {
    await this.init()
    
    const { data } = await this.supabase
      .from('legal_documents')
      .select('*')
      .eq('doc_type', docType)
      .eq('language', language)
      .eq('status', 'active')
      .order('version', { ascending: false })
      .limit(1)
      .single()
    
    if (!data) {
      // Return template if no document in DB
      return this.getTemplate(docType, language)
    }
    
    return this.mapDocument(data)
  }
  
  /**
   * Get document template
   */
  getTemplate(
    docType: legal_doc_type,
    language: string = 'en'
  ): LegalDocument | null {
    const template = LEGAL_TEMPLATES[docType]?.[language]
    
    if (!template) {
      // Fallback to English
      const fallback = LEGAL_TEMPLATES[docType]?.['en']
      if (!fallback) return null
      
      return {
        id: '',
        docType,
        version: '1.0.0',
        language: 'en',
        title: fallback.title,
        content: fallback.content,
        summary: fallback.summary,
        effectiveDate: new Date().toISOString(),
        status: 'active',
        isRequired: true,
        acceptanceRequiredFor: ['client', 'host']
      }
    }
    
    return {
      id: '',
      docType,
      version: '1.0.0',
      language,
      title: template.title,
      content: template.content,
      summary: template.summary,
      effectiveDate: new Date().toISOString(),
      status: 'active',
      isRequired: true,
      acceptanceRequiredFor: ['client', 'host']
    }
  }
  
  /**
   * Create or update legal document
   */
  async saveDocument(doc: Partial<LegalDocument>): Promise<string> {
    await this.init()
    
    // Get previous version
    const { data: existing } = await this.supabase
      .from('legal_documents')
      .select('id')
      .eq('doc_type', doc.docType)
      .eq('language', doc.language)
      .eq('status', 'active')
      .single()
    
    const { data, error } = await this.supabase
      .from('legal_documents')
      .insert({
        doc_type: doc.docType,
        version: doc.version || '1.0.0',
        previous_version_id: existing?.id,
        language: doc.language || 'en',
        title: doc.title || '',
        content: doc.content || '',
        summary: doc.summary || '',
        effective_date: doc.effectiveDate,
        status: doc.status || 'draft',
        is_required: doc.isRequired ?? true,
        acceptance_required_for: doc.acceptanceRequiredFor || ['client', 'host']
      })
      .select('id')
      .single()
    
    if (error) throw error
    return data.id
  }
  
  /**
   * Record document acceptance
   */
  async recordAcceptance(
    documentId: string,
    userId: string,
    version: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<void> {
    await this.init()
    
    await this.supabase
      .from('document_acceptances')
      .insert({
        document_id: documentId,
        user_id: userId,
        accepted: true,
        document_version: version,
        ip_address: ipAddress,
        user_agent: userAgent
      })
  }
  
  /**
   * Check if user has accepted required documents
   */
  async checkRequiredAcceptance(
    userId: string,
    userRole: 'client' | 'host'
  ): Promise<{
    allAccepted: boolean
    pendingDocuments: legal_doc_type[]
  }> {
    await this.init()
    
    // Get required documents for role
    const { data: requiredDocs } = await this.supabase
      .from('legal_documents')
      .select('id, doc_type, version')
      .eq('status', 'active')
      .contains('acceptance_required_for', [userRole])
    
    if (!requiredDocs || requiredDocs.length === 0) {
      return { allAccepted: true, pendingDocuments: [] }
    }
    
    // Check acceptances
    const { data: acceptances } = await this.supabase
      .from('document_acceptances')
      .select('document_id, document_version')
      .eq('user_id', userId)
      .eq('accepted', true)
    
    const pendingDocuments: legal_doc_type[] = []
    
    for (const doc of requiredDocs) {
      const acceptance = acceptances?.find(
        a => a.document_id === doc.id && a.document_version === doc.version
      )
      
      if (!acceptance) {
        pendingDocuments.push(doc.doc_type as legal_doc_type)
      }
    }
    
    return {
      allAccepted: pendingDocuments.length === 0,
      pendingDocuments
    }
  }
  
  /**
   * Get all documents for CMS
   */
  async getAllDocuments(status?: string): Promise<LegalDocument[]> {
    await this.init()
    
    let query = this.supabase
      .from('legal_documents')
      .select('*')
      .order('doc_type')
      .order('version', { ascending: false })
    
    if (status) {
      query = query.eq('status', status)
    }
    
    const { data } = await query
    
    return data?.map(this.mapDocument) || []
  }
  
  private mapDocument(data: any): LegalDocument {
    return {
      id: data.id,
      docType: data.doc_type,
      version: data.version,
      language: data.language,
      title: data.title,
      content: data.content,
      summary: data.summary,
      effectiveDate: data.effective_date,
      status: data.status,
      isRequired: data.is_required,
      acceptanceRequiredFor: data.acceptance_required_for
    }
  }
  
  /**
   * Replace template variables
   */
  renderContent(content: string, variables: Record<string, string>): string {
    let rendered = content
    
    Object.entries(variables).forEach(([key, value]) => {
      rendered = rendered.replace(new RegExp(`\\{${key}\\}`, 'g'), value)
    })
    
    return rendered
  }
}

// ============================================
// LEGAL CMS SERVICE
// ============================================

export class LegalCMSService {
  private legalService: LegalService
  
  constructor() {
    this.legalService = new LegalService()
  }
  
  /**
   * Publish new version of document
   */
  async publishNewVersion(
    docType: legal_doc_type,
    language: string,
    content: string,
    title: string,
    summary: string
  ): Promise<string> {
    // Get current version
    const current = await this.legalService.getDocument(docType, language)
    
    // Increment version
    const currentVersion = current?.version || '1.0.0'
    const [major, minor, patch] = currentVersion.split('.').map(Number)
    const newVersion = `${major}.${minor}.${patch + 1}`
    
    // Archive current version
    if (current?.id) {
      await this.archiveDocument(current.id)
    }
    
    // Create new version
    return this.legalService.saveDocument({
      docType,
      language,
      version: newVersion,
      title,
      summary,
      content,
      status: 'active',
      effectiveDate: new Date().toISOString()
    })
  }
  
  /**
   * Archive document
   */
  async archiveDocument(documentId: string): Promise<void> {
    await this.legalService.init()
    
    await this.legalService.supabase
      .from('legal_documents')
      .update({ status: 'archived' })
      .eq('id', documentId)
  }
  
  /**
   * Compare versions
   */
  compareVersions(docId1: string, docId2: string): {
    changes: string[]
    added: string[]
    removed: string[]
  } {
    // In production, implement proper diff algorithm
    return {
      changes: [],
      added: [],
      removed: []
    }
  }
}
