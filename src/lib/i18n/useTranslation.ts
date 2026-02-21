// ============================================
// OPENBOOKING I18N HOOK
// React hook for translations
// ============================================

'use client'

import { useState, useEffect, useCallback } from 'react'
import { LanguageCode, DEFAULT_LANGUAGE, getTranslation, getNestedTranslation } from './config'

// ============================================
// TYPES
// ============================================

type TranslationNamespace = keyof typeof import('./config').translations.en

interface UseTranslationReturn {
  t: <T extends string>(namespace: TranslationNamespace, key: T) => string
  language: LanguageCode
  setLanguage: (lang: LanguageCode) => void
  languages: readonly { code: LanguageCode; name: string; nativeName: string }[]
}

// ============================================
// STORAGE KEY
// ============================================

const LANGUAGE_STORAGE_KEY = 'openbooking_language'

// ============================================
// HOOK
// ============================================

export function useTranslation(defaultNamespace?: TranslationNamespace): UseTranslationReturn {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    // Check localStorage on client side
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY)
      if (stored) {
        return stored as LanguageCode
      }
      
      // Check browser language
      const browserLang = navigator.language.split('-')[0]
      const supportedLangs = ['en', 'ru', 'bg', 'ua', 'de', 'fr', 'es', 'pl', 'tr']
      if (supportedLangs.includes(browserLang)) {
        return browserLang as LanguageCode
      }
    }
    
    return DEFAULT_LANGUAGE
  })

  const setLanguage = useCallback((lang: LanguageCode) => {
    setLanguageState(lang)
    if (typeof window !== 'undefined') {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, lang)
      document.documentElement.lang = lang
    }
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.lang = language
    }
  }, [language])

  const t = useCallback(<T extends string>(
    namespaceOrKey: TranslationNamespace | T,
    key?: T
  ): string => {
    if (key !== undefined) {
      // Full namespace provided: t('common', 'loading')
      return getNestedTranslation(language, `${namespaceOrKey}.${key}`)
    }
    
    // Default namespace: t('loading')
    if (defaultNamespace) {
      return getNestedTranslation(language, `${defaultNamespace}.${namespaceOrKey}`)
    }
    
    return namespaceOrKey as string
  }, [language, defaultNamespace])

  const languages = [
    { code: 'en' as LanguageCode, name: 'English', nativeName: 'English' },
    { code: 'ru' as LanguageCode, name: 'Russian', nativeName: 'Русский' },
    { code: 'bg' as LanguageCode, name: 'Bulgarian', nativeName: 'Български' },
    { code: 'ua' as LanguageCode, name: 'Ukrainian', nativeName: 'Українська' },
    { code: 'de' as LanguageCode, name: 'German', nativeName: 'Deutsch' },
    { code: 'fr' as LanguageCode, name: 'French', nativeName: 'Français' },
    { code: 'es' as LanguageCode, name: 'Spanish', nativeName: 'Español' },
    { code: 'pl' as LanguageCode, name: 'Polish', nativeName: 'Polski' },
    { code: 'tr' as LanguageCode, name: 'Turkish', nativeName: 'Türkçe' }
  ] as const

  return {
    t,
    language,
    setLanguage,
    languages
  }
}

// ============================================
// LANGUAGE DETECTOR
// ============================================

export function detectLanguage(): LanguageCode {
  if (typeof window === 'undefined') {
    return DEFAULT_LANGUAGE
  }
  
  // Check stored preference
  const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY)
  if (stored && isValidLanguage(stored)) {
    return stored as LanguageCode
  }
  
  // Check browser language
  const browserLang = navigator.language.split('-')[0]
  if (isValidLanguage(browserLang)) {
    return browserLang as LanguageCode
  }
  
  // Check Accept-Language header (server-side)
  if (typeof document !== 'undefined' && document.documentElement) {
    const htmlLang = document.documentElement.lang
    if (isValidLanguage(htmlLang)) {
      return htmlLang as LanguageCode
    }
  }
  
  return DEFAULT_LANGUAGE
}

function isValidLanguage(lang: string): boolean {
  const supported = ['en', 'ru', 'bg', 'ua', 'de', 'fr', 'es', 'pl', 'tr']
  return supported.includes(lang)
}

// ============================================
// SERVER-SIDE I18N
// ============================================

export async function getServerLanguage(request?: Request): Promise<LanguageCode> {
  // Check cookies
  const cookies = request?.headers.get('cookie') || ''
  const langCookie = cookies.match(/openbooking_language=([a-z]+)/)
  
  if (langCookie && isValidLanguage(langCookie[1])) {
    return langCookie[1] as LanguageCode
  }
  
  // Check Accept-Language header
  const acceptLanguage = request?.headers.get('accept-language')
  if (acceptLanguage) {
    const browserLang = acceptLanguage.split(',')[0].split('-')[0]
    if (isValidLanguage(browserLang)) {
      return browserLang as LanguageCode
    }
  }
  
  return DEFAULT_LANGUAGE
}
