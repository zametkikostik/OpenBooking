'use client'

import { useState } from 'react'
import { useLocale } from 'next-intl'
import { supportedLanguages, LanguageCode } from '@/i18n/config'
import { Globe, ChevronDown, Check } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function LanguageSwitcher() {
  const locale = useLocale() as LanguageCode
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const currentLanguage = supportedLanguages.find(l => l.code === locale)

  const changeLanguage = (code: LanguageCode) => {
    // Set cookie for next-intl
    document.cookie = `NEXT_LOCALE=${code};path=/;max-age=31536000`
    
    // Reload page with new locale
    const path = window.location.pathname
    const newPath = path.replace(/^\/[a-z]{2}/, `/${code}`) || `/${code}`
    router.push(newPath)
    router.refresh()
    setOpen(false)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors"
      >
        <Globe className="h-4 w-4" />
        <span className="text-sm">{currentLanguage?.flag}</span>
        <ChevronDown className="h-3 w-3" />
      </button>

      {open && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-48 bg-popover border rounded-lg shadow-lg z-50 py-2 max-h-80 overflow-auto">
            {supportedLanguages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => changeLanguage(lang.code)}
                className={`w-full flex items-center justify-between px-4 py-2 text-sm hover:bg-muted transition-colors ${
                  locale === lang.code ? 'text-primary' : ''
                }`}
              >
                <span className="flex items-center gap-2">
                  <span>{lang.flag}</span>
                  <span>{lang.name}</span>
                </span>
                {locale === lang.code && (
                  <Check className="h-4 w-4" />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
