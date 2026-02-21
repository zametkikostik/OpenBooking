import { createClient } from '@supabase/supabase-js';

/**
 * Legal Engine CMS Service (Client-safe version)
 *
 * Manages multilingual legal documents with version control.
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export interface LegalDocument {
  id: string;
  documentType: string;
  locale: string;
  version: string;
  title: string;
  content: string;
  summary?: string;
  effectiveDate: string;
  accepted?: boolean;
}

export class LegalService {
  /**
   * Get latest version of legal document
   */
  async getLatestDocument(documentType: string, locale: string): Promise<LegalDocument | null> {
    const { data, error } = await supabase
      .from('legal_documents')
      .select('*')
      .eq('document_type', documentType)
      .eq('locale', locale)
      .eq('status', 'active')
      .order('version', { ascending: false })
      .limit(1)
      .single();

    if (error || !data) {
      return null;
    }

    return {
      id: data.id,
      documentType: data.document_type,
      locale: data.locale,
      version: data.version,
      title: data.title,
      content: data.content,
      summary: data.summary,
      effectiveDate: data.effective_date,
    };
  }

  /**
   * Get all required documents
   */
  async getRequiredDocuments(locale: string): Promise<LegalDocument[]> {
    const requiredTypes = ['terms_of_service', 'privacy_policy', 'cookie_policy'];
    const documents: LegalDocument[] = [];

    for (const type of requiredTypes) {
      const doc = await this.getLatestDocument(type, locale);
      if (doc) {
        documents.push({ ...doc, accepted: false });
      }
    }

    return documents;
  }

  /**
   * Accept legal document
   */
  async acceptDocument(userId: string, documentType: string, version: string): Promise<void> {
    await supabase.from('legal_acceptances').insert({
      user_id: userId,
      document_type: documentType,
      version,
      accepted_at: new Date().toISOString(),
    });
  }

  /**
   * Check if user has accepted document
   */
  async hasUserAccepted(userId: string, documentType: string): Promise<boolean> {
    const { data } = await supabase
      .from('legal_acceptances')
      .select('*')
      .eq('user_id', userId)
      .eq('document_type', documentType)
      .single();

    return !!data;
  }
}

// Export singleton instance
export const legalService = new LegalService();
