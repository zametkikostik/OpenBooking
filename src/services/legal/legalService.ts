import { createClient } from '@/lib/supabase'
import { LegalDocument, DocumentAcceptance } from '@/types/database'

// Legal Document Service
export class LegalService {
  private supabase: any

  constructor() {
    this.supabase = createClient()
  }

  // Get active legal documents by type
  async getActiveDocuments(params: {
    documentType?: string
    language?: string
  }): Promise<{ documents: LegalDocument[]; error?: any }> {
    let query = this.supabase
      .from('legal_documents')
      .select('*')
      .eq('is_active', true)

    if (params.documentType) {
      query = query.eq('document_type', params.documentType)
    }

    if (params.language) {
      query = query.eq('language', params.language)
    }

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) {
      return { documents: [], error }
    }

    return { documents: data || [] }
  }

  // Get document by ID
  async getDocument(id: string): Promise<{ document: LegalDocument | null; error?: any }> {
    const { data, error } = await this.supabase
      .from('legal_documents')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      return { document: null, error }
    }

    return { document: data }
  }

  // Get latest version of document by type
  async getLatestVersion(params: {
    documentType: string
    language: string
  }): Promise<{ document: LegalDocument | null; error?: any }> {
    const { data, error } = await this.supabase
      .from('legal_documents')
      .select('*')
      .eq('document_type', params.documentType)
      .eq('language', params.language)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows
      return { document: null, error }
    }

    return { document: data }
  }

  // Accept document (user agreement)
  async acceptDocument(params: {
    userId: string
    documentId: string
    ipAddress?: string
    userAgent?: string
  }): Promise<{ success: boolean; error?: any }> {
    // Check if already accepted
    const { data: existing } = await this.supabase
      .from('document_acceptances')
      .select('*')
      .eq('user_id', params.userId)
      .eq('document_id', params.documentId)
      .single()

    if (existing) {
      return { success: true } // Already accepted
    }

    // Create acceptance record
    const { error } = await this.supabase
      .from('document_acceptances')
      .insert({
        user_id: params.userId,
        document_id: params.documentId,
        ip_address: params.ipAddress,
        user_agent: params.userAgent,
      })

    if (error) {
      return { success: false, error }
    }

    return { success: true }
  }

  // Check if user has accepted required documents
  async getUserAcceptances(params: {
    userId: string
    documentTypes?: string[]
  }): Promise<{ acceptances: DocumentAcceptance[]; missing: string[]; error?: any }> {
    let query = this.supabase
      .from('document_acceptances')
      .select('*, legal_documents(document_type)')
      .eq('user_id', params.userId)

    if (params.documentTypes && params.documentTypes.length > 0) {
      query = query.in('document_id', params.documentTypes)
    }

    const { data, error } = await query

    if (error) {
      return { acceptances: [], missing: [], error }
    }

    // Find missing documents
    const acceptedTypes = data?.map((a: any) => (a.legal_documents as any)?.document_type) || []
    const missing = params.documentTypes
      ? params.documentTypes.filter((t: string) => !acceptedTypes.includes(t))
      : []

    return {
      acceptances: data || [],
      missing,
    }
  }

  // Create new document version (admin only)
  async createDocumentVersion(params: {
    documentType: string
    language: string
    title: string
    content: string
    version: string
    effectiveFrom?: string
    requiresAcceptance?: boolean
    metadata?: Record<string, any>
  }): Promise<{ document: LegalDocument | null; error?: any }> {
    // Deactivate previous versions
    await this.supabase
      .from('legal_documents')
      .update({ is_active: false })
      .eq('document_type', params.documentType)
      .eq('language', params.language)

    // Create new version
    const { data, error } = await this.supabase
      .from('legal_documents')
      .insert({
        document_type: params.documentType,
        language: params.language,
        title: params.title,
        content: params.content,
        version: params.version,
        is_active: true,
        effective_from: params.effectiveFrom,
        requires_acceptance: params.requiresAcceptance ?? true,
        metadata: params.metadata,
      })
      .select()
      .single()

    if (error) {
      return { document: null, error }
    }

    return { document: data }
  }

  // Get document version history
  async getVersionHistory(params: {
    documentType: string
    language: string
  }): Promise<{ versions: LegalDocument[]; error?: any }> {
    const { data, error } = await this.supabase
      .from('legal_documents')
      .select('*')
      .eq('document_type', params.documentType)
      .eq('language', params.language)
      .order('created_at', { ascending: false })

    if (error) {
      return { versions: [], error }
    }

    return { versions: data || [] }
  }

  // Get users who haven't accepted required document
  async getNonAcceptingUsers(params: {
    documentId: string
  }): Promise<{ userIds: string[]; error?: any }> {
    // Get all users who have accepted
    const { data: acceptances } = await this.supabase
      .from('document_acceptances')
      .select('user_id')
      .eq('document_id', params.documentId)

    const acceptedUserIds = new Set(acceptances?.map((a: any) => a.user_id) || [])

    // Get all users
    const { data: allUsers } = await this.supabase
      .from('profiles')
      .select('id')

    const nonAccepting = allUsers?.filter((u: any) => !acceptedUserIds.has(u.id)) || []

    return { userIds: nonAccepting.map((u: any) => u.id) }
  }

  // Bulk notify users about new terms
  async notifyUsersAboutDocument(params: {
    documentId: string
    userIds: string[]
    notificationTitle: string
    notificationMessage: string
  }): Promise<{ success: boolean; error?: any }> {
    const notifications = params.userIds.map(userId => ({
      user_id: userId,
      type: 'legal_update',
      title: params.notificationTitle,
      message: params.notificationMessage,
      data: { document_id: params.documentId },
      channel: ['in_app', 'email'],
    }))

    const { error } = await this.supabase
      .from('notifications')
      .insert(notifications)

    if (error) {
      return { success: false, error }
    }

    return { success: true }
  }

  // Export acceptances for compliance
  async exportAcceptances(params: {
    documentId: string
    startDate?: string
    endDate?: string
  }): Promise<{ data: any[]; error?: any }> {
    let query = this.supabase
      .from('document_acceptances')
      .select(`
        *,
        profiles (email, full_name, country)
      `)
      .eq('document_id', params.documentId)

    if (params.startDate) {
      query = query.gte('accepted_at', params.startDate)
    }

    if (params.endDate) {
      query = query.lte('accepted_at', params.endDate)
    }

    const { data, error } = await query.order('accepted_at', { ascending: false })

    if (error) {
      return { data: [], error }
    }

    return { data: data || [] }
  }
}

// Document Types Configuration
export const DOCUMENT_TYPES = {
  TERMS: 'terms',
  PRIVACY: 'privacy',
  OFFER: 'offer',
  HOST_AGREEMENT: 'host_agreement',
  GDPR: 'gdpr',
  AML: 'aml_policy',
  COOKIE: 'cookie_policy',
} as const

export type DocumentType = typeof DOCUMENT_TYPES[keyof typeof DOCUMENT_TYPES]

// Multi-language Templates
export const LEGAL_TEMPLATES: Record<string, Record<string, string>> = {
  terms: {
    en: 'Terms of Service',
    ru: 'Условия использования',
    bg: 'Условия за ползване',
    ua: 'Умови використання',
    de: 'Nutzungsbedingungen',
    fr: 'Conditions d\'utilisation',
    es: 'Términos de servicio',
    pl: 'Warunki korzystania',
    tr: 'Hizmet Koşulları',
  },
  privacy: {
    en: 'Privacy Policy',
    ru: 'Политика конфиденциальности',
    bg: 'Политика за поверителност',
    ua: 'Політика конфіденційності',
    de: 'Datenschutzrichtlinie',
    fr: 'Politique de confidentialité',
    es: 'Política de privacidad',
    pl: 'Polityka prywatności',
    tr: 'Gizlilik Politikası',
  },
  offer: {
    en: 'Public Offer Agreement',
    ru: 'Публичная оферта',
    bg: 'Публична оферта',
    ua: 'Публічна оферта',
    de: 'Öffentliches Angebot',
    fr: 'Offre publique',
    es: 'Oferta pública',
    pl: 'Oferta publiczna',
    tr: 'Kamu Teklifi',
  },
  host_agreement: {
    en: 'Host Agreement',
    ru: 'Соглашение хоста',
    bg: 'Споразумение с домакин',
    ua: 'Угода хоста',
    de: 'Gastgeber-Vereinbarung',
    fr: 'Accord d\'hôte',
    es: 'Acuerdo de anfitrión',
    pl: 'Umowa gospodarza',
    tr: 'Ev Sahibi Sözleşmesi',
  },
  gdpr: {
    en: 'GDPR Policy',
    ru: 'Политика GDPR',
    bg: 'Политика на GDPR',
    ua: 'Політика GDPR',
    de: 'DSGVO-Richtlinie',
    fr: 'Politique RGPD',
    es: 'Política de GDPR',
    pl: 'Polityka RODO',
    tr: 'GDPR Politikası',
  },
  aml_policy: {
    en: 'AML/KYC Policy',
    ru: 'Политика AML/KYC',
    bg: 'Политика на AML/KYC',
    ua: 'Політика AML/KYC',
    de: 'AML/KYC-Richtlinie',
    fr: 'Politique LBC/KYC',
    es: 'Política de AML/KYC',
    pl: 'Polityka AML/KYC',
    tr: 'AML/KYC Politikası',
  },
  cookie_policy: {
    en: 'Cookie Policy',
    ru: 'Политика Cookie',
    bg: 'Политика на бисквитките',
    ua: 'Політика Cookie',
    de: 'Cookie-Richtlinie',
    fr: 'Politique des cookies',
    es: 'Política de cookies',
    pl: 'Polityka plików cookie',
    tr: 'Çerez Politikası',
  },
} as const

// Content generator for legal documents
export function generateLegalContent(
  type: string,
  language: string,
  effectiveDate: string
): string {
  const title = LEGAL_TEMPLATES[type]?.[language as keyof typeof LEGAL_TEMPLATES[typeof type]] || 
                LEGAL_TEMPLATES[type]?.en ||
                'Legal Document'

  // Simplified templates - in production, these would be full legal texts
  const templates: Record<string, string> = {
    terms: `<h1>${title}</h1>
<p>Effective Date: ${effectiveDate}</p>

<h2>1. Acceptance of Terms</h2>
<p>By accessing and using OpenBooking platform ("the Service"), you accept and agree to be bound by the terms and provision of this agreement.</p>

<h2>2. Use License</h2>
<p>Permission is granted to temporarily access the Service for personal, non-commercial transitory viewing only.</p>

<h2>3. Booking Terms</h2>
<p>All bookings are subject to host approval and payment confirmation. Escrow protection applies to all transactions.</p>

<h2>4. Cancellation Policy</h2>
<p>Cancellation terms vary by property. Please review the specific property's cancellation policy before booking.</p>

<h2>5. Limitations</h2>
<p>OpenBooking shall not be held liable for any damages arising from the use or inability to use the Service.</p>

<h2>6. Modifications</h2>
<p>OpenBooking may revise these terms at any time. By using the Service, you agree to be bound by the current version.</p>

<h2>7. Governing Law</h2>
<p>These terms shall be governed by and construed in accordance with applicable laws.</p>`,

    privacy: `<h1>${title}</h1>
<p>Effective Date: ${effectiveDate}</p>

<h2>1. Information We Collect</h2>
<p>We collect information you provide directly to us, including name, email, phone number, and payment information.</p>

<h2>2. How We Use Your Information</h2>
<p>We use the information we collect to provide, maintain, and improve our services, process transactions, and send communications.</p>

<h2>3. Information Sharing</h2>
<p>We do not sell your personal information. We share information with hosts as necessary to facilitate bookings.</p>

<h2>4. Data Security</h2>
<p>We implement appropriate technical and organizational measures to protect your personal information.</p>

<h2>5. Your Rights</h2>
<p>You have the right to access, correct, or delete your personal information. Contact us to exercise these rights.</p>

<h2>6. Cookies</h2>
<p>We use cookies and similar tracking technologies to enhance your experience and analyze traffic.</p>

<h2>7. International Data Transfers</h2>
<p>Your information may be transferred to and processed in countries other than your country of residence.</p>`,

    offer: `<h1>${title}</h1>
<p>Effective Date: ${effectiveDate}</p>

<h2>1. General Provisions</h2>
<p>This Public Offer Agreement governs the use of booking services provided by OpenBooking.</p>

<h2>2. Service Description</h2>
<p>OpenBooking provides a platform for hosts to list properties and guests to book accommodations.</p>

<h2>3. Payment Terms</h2>
<p>All payments are processed through secure escrow. Funds are released to hosts after guest check-in.</p>

<h2>4. User Obligations</h2>
<p>Users must provide accurate information and comply with all applicable laws and regulations.</p>

<h2>5. Liability</h2>
<p>OpenBooking acts as an intermediary and is not liable for the actions of hosts or guests.</p>`,

    host_agreement: `<h1>${title}</h1>
<p>Effective Date: ${effectiveDate}</p>

<h2>1. Host Responsibilities</h2>
<p>Hosts are responsible for accurate listings, timely communication, and providing the agreed-upon accommodation.</p>

<h2>2. Listing Requirements</h2>
<p>All listings must include accurate photos, descriptions, pricing, and availability information.</p>

<h2>3. Payment Processing</h2>
<p>Host payments are processed after guest check-in confirmation. Service fees apply.</p>

<h2>4. Cancellation by Host</h2>
<p>Host cancellations are discouraged and may result in penalties and reputation impact.</p>

<h2>5. Quality Standards</h2>
<p>Hosts must maintain clean, safe, and accurate accommodations as described in their listings.</p>`,

    gdpr: `<h1>GDPR Compliance Policy</h1>
<p>Effective Date: ${effectiveDate}</p>

<h2>1. Data Controller</h2>
<p>OpenBooking is the data controller for personal information processed through our platform.</p>

<h2>2. Legal Basis for Processing</h2>
<p>We process data based on consent, contract performance, legal obligations, and legitimate interests.</p>

<h2>3. Data Retention</h2>
<p>We retain personal data only as long as necessary for the purposes outlined in this policy.</p>`,

    aml: `<h1>AML/KYC Policy</h1>
<p>Effective Date: ${effectiveDate}</p>

<h2>1. Compliance Commitment</h2>
<p>OpenBooking is committed to preventing money laundering and terrorist financing.</p>

<h2>2. Identity Verification</h2>
<p>Users may be required to complete KYC verification for certain transactions.</p>

<h2>3. Transaction Monitoring</h2>
<p>We monitor transactions for suspicious activity and report as required by law.</p>`,

    cookie: `<h1>Cookie Policy</h1>
<p>Effective Date: ${effectiveDate}</p>

<h2>1. What Are Cookies</h2>
<p>Cookies are small text files stored on your device when you visit our website.</p>

<h2>2. Types of Cookies We Use</h2>
<p>We use essential, functional, analytics, and advertising cookies.</p>

<h2>3. Managing Cookies</h2>
<p>You can control cookie preferences through your browser settings.</p>`,
  }

  return templates[type] || templates.terms
}
