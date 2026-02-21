import { NextRequest, NextResponse } from 'next/server';
import { legalService } from '@/lib/legal/services';
import { getSession } from '@/lib/supabase/auth';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { documentType, version } = body;

    if (!documentType || !version) {
      return NextResponse.json(
        { error: 'Document type and version are required' },
        { status: 400 }
      );
    }

    await legalService.acceptDocument(session.user.id, documentType, version);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Legal accept API error:', error);
    return NextResponse.json({ error: 'Failed to accept document' }, { status: 500 });
  }
}
