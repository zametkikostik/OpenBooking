'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { LegalService, DOCUMENT_TYPES } from '@/services/legal/legalService'
import { LegalDocument } from '@/types/database'
import { Button } from '@/components/ui/button'
import { Check, AlertCircle, FileText, Languages } from 'lucide-react'
import { supportedLanguages, LanguageCode } from '@/i18n/config'

export default function LegalDocumentsPage() {
  const { profile } = useAuth()
  const [documents, setDocuments] = useState<LegalDocument[]>([])
  const [selectedDoc, setSelectedDoc] = useState<LegalDocument | null>(null)
  const [language, setLanguage] = useState<LanguageCode>('en')
  const [accepting, setAccepting] = useState<string | null>(null)
  const [acceptedDocs, setAcceptedDocs] = useState<Set<string>>(new Set())

  const loadDocuments = useCallback(async () => {
    const service = new LegalService()
    const { documents, error } = await service.getActiveDocuments({ language })
    
    if (!error) {
      setDocuments(documents)
    }
  }, [language])

  const loadAcceptedDocuments = useCallback(async () => {
    if (!profile) return
    
    const service = new LegalService()
    const { acceptances } = await service.getUserAcceptances({ userId: profile.id })
    
    const accepted = new Set(acceptances.map(a => a.document_id))
    setAcceptedDocs(accepted)
  }, [profile])

  useEffect(() => {
    loadDocuments()
    loadAcceptedDocuments()
  }, [loadDocuments, loadAcceptedDocuments, language])

  const handleAccept = async (documentId: string) => {
    if (!profile) return
    
    setAccepting(documentId)
    const service = new LegalService()
    const { success } = await service.acceptDocument({
      userId: profile.id,
      documentId,
    })

    if (success) {
      setAcceptedDocs(prev => new Set(prev).add(documentId))
    }
    setAccepting(null)
  }

  const requiredDocs = [DOCUMENT_TYPES.TERMS, DOCUMENT_TYPES.PRIVACY]

  const missingDocs = documents.filter(
    doc => requiredDocs.includes(doc.document_type as any) && !acceptedDocs.has(doc.id)
  )

  return (
    <div className="container px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Legal Documents</h1>
        <p className="text-muted-foreground">
          Review and accept our terms and policies
        </p>
      </div>

      {/* Language Selector */}
      <div className="flex items-center gap-2 mb-6">
        <Languages className="h-5 w-5 text-muted-foreground" />
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value as LanguageCode)}
          className="px-4 py-2 rounded-lg border bg-background"
        >
          {supportedLanguages.map(lang => (
            <option key={lang.code} value={lang.code}>
              {lang.flag} {lang.name}
            </option>
          ))}
        </select>
      </div>

      {/* Required Documents Alert */}
      {missingDocs.length > 0 && profile && (
        <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
          <div>
            <h3 className="font-semibold text-yellow-800">Action Required</h3>
            <p className="text-sm text-yellow-700">
              Please review and accept the following documents to continue using our services:
            </p>
            <ul className="mt-2 space-y-1 text-sm text-yellow-700">
              {missingDocs.map(doc => (
                <li key={doc.id}>• {doc.title}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Documents Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {documents.map((doc) => {
          const isAccepted = acceptedDocs.has(doc.id)
          const isRequired = requiredDocs.includes(doc.document_type as any)
          
          return (
            <div
              key={doc.id}
              className={`border rounded-xl p-4 ${
                isRequired && !isAccepted ? 'border-yellow-300 bg-yellow-50' : ''
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">{doc.title}</h3>
                </div>
                {isAccepted && (
                  <Check className="h-5 w-5 text-green-600" />
                )}
              </div>
              
              <div className="text-sm text-muted-foreground mb-4">
                <div>Version: {doc.version}</div>
                <div>Effective: {doc.effective_from}</div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => setSelectedDoc(doc)}
                >
                  Read
                </Button>
                {isRequired && !isAccepted && (
                  <Button
                    size="sm"
                    className="flex-1"
                    onClick={() => handleAccept(doc.id)}
                    disabled={accepting === doc.id}
                  >
                    {accepting === doc.id ? 'Accepting...' : 'Accept'}
                  </Button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Document Viewer Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl max-w-3xl w-full max-h-[80vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">{selectedDoc.title}</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedDoc(null)}
                >
                  Close
                </Button>
              </div>
              <div className="text-sm text-muted-foreground mt-2">
                Version {selectedDoc.version} • Effective {selectedDoc.effective_from}
              </div>
            </div>
            
            <div 
              className="flex-1 overflow-auto p-6 prose dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: selectedDoc.content }}
            />
            
            <div className="p-6 border-t">
              {!acceptedDocs.has(selectedDoc.id) && requiredDocs.includes(selectedDoc.document_type as any) && (
                <Button
                  className="w-full"
                  onClick={() => handleAccept(selectedDoc.id)}
                  disabled={accepting === selectedDoc.id}
                >
                  {accepting === selectedDoc.id ? 'Accepting...' : 'Accept & Continue'}
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
