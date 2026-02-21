import { NextRequest, NextResponse } from 'next/server';
import { legalService } from '@/lib/legal/services';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const locale = searchParams.get('locale') || 'ru';
    const documentType = searchParams.get('type');

    if (documentType) {
      // Get specific document
      const doc = await legalService.getLatestDocument(documentType, locale);
      if (!doc) {
        return NextResponse.json({ error: 'Document not found' }, { status: 404 });
      }
      return NextResponse.json(doc);
    }

    // Get all required documents
    const requiredTypes = ['terms_of_service', 'privacy_policy', 'cookie_policy'];
    const documents = [];

    for (const type of requiredTypes) {
      const doc = await legalService.getLatestDocument(type, locale);
      if (doc) {
        documents.push({
          documentType: doc.documentType,
          title: doc.title,
          version: doc.version,
          effectiveDate: doc.effectiveDate,
          accepted: false, // Will be updated by client based on user history
        });
      }
    }

    return NextResponse.json(documents);
  } catch (error) {
    console.error('Legal documents API error:', error);
    return NextResponse.json({ error: 'Failed to fetch legal documents' }, { status: 500 });
  }
}
