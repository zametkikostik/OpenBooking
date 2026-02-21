'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface LegalDocument {
  documentType: string;
  title: string;
  version: string;
  content: string;
  effectiveDate: string;
  accepted: boolean;
}

interface LegalDocumentsProps {
  locale: string;
  userId?: string;
}

export function LegalDocuments({ locale, userId }: LegalDocumentsProps) {
  const [documents, setDocuments] = useState<LegalDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoc, setSelectedDoc] = useState<LegalDocument | null>(null);

  useEffect(() => {
    loadDocuments();
  }, [locale]);

  async function loadDocuments() {
    try {
      const response = await fetch(`/api/legal/documents?locale=${locale}`);
      if (response.ok) {
        const data = await response.json();
        setDocuments(data);
      }
    } catch (error) {
      console.error('Error loading legal documents:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleAccept(document: LegalDocument) {
    try {
      const response = await fetch('/api/legal/accept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentType: document.documentType,
          version: document.version,
        }),
      });

      if (response.ok) {
        setDocuments((docs) =>
          docs.map((doc) =>
            doc.documentType === document.documentType ? { ...doc, accepted: true } : doc
          )
        );
      }
    } catch (error) {
      console.error('Error accepting document:', error);
    }
  }

  if (loading) {
    return <div className="space-y-4">Загрузка документов...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-2 text-2xl font-bold">Юридические документы</h2>
        <p className="text-muted-foreground">
          Пожалуйста, ознакомьтесь и примите наши юридические документы
        </p>
      </div>

      <div className="space-y-4">
        {documents.map((doc) => (
          <Card key={doc.documentType}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{doc.title}</CardTitle>
                  <CardDescription>
                    Версия {doc.version} • Вступает в силу с{' '}
                    {new Date(doc.effectiveDate).toLocaleDateString()}
                  </CardDescription>
                </div>
                {doc.accepted ? (
                  <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
                    Принято ✓
                  </span>
                ) : (
                  <Button size="sm" onClick={() => setSelectedDoc(doc)}>
                    Просмотреть и принять
                  </Button>
                )}
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* Document Modal */}
      {selectedDoc && (
        <DocumentModal
          document={selectedDoc}
          onAccept={() => handleAccept(selectedDoc)}
          onClose={() => setSelectedDoc(null)}
        />
      )}
    </div>
  );
}

function DocumentModal({
  document,
  onAccept,
  onClose,
}: {
  document: LegalDocument;
  onAccept: () => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="flex max-h-[80vh] w-full max-w-4xl flex-col overflow-hidden rounded-lg bg-card">
        <div className="border-b p-6">
          <h3 className="text-2xl font-bold">{document.title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Версия {document.version} • {new Date(document.effectiveDate).toLocaleDateString()}
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div
            className="prose dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: document.content.replace(/\n/g, '<br/>') }}
          />
        </div>

        <div className="flex justify-end gap-4 border-t p-6">
          <Button variant="outline" onClick={onClose}>
            Закрыть
          </Button>
          <Button onClick={onAccept}>Принять</Button>
        </div>
      </div>
    </div>
  );
}
