'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface ConsentPreferences {
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
}

interface CookieConsentBannerProps {
  onConsentChange?: (consent: ConsentPreferences) => void;
}

export function CookieConsentBanner({ onConsentChange }: CookieConsentBannerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [consent, setConsent] = useState<ConsentPreferences>({
    analytics: false,
    marketing: false,
    functional: true, // Always allowed
  });

  useEffect(() => {
    // Check if user has already made a choice
    const savedConsent = localStorage.getItem('cookie_consent');
    if (savedConsent) {
      const parsed = JSON.parse(savedConsent);
      setConsent(parsed);
      onConsentChange?.(parsed);
    } else {
      // Show banner after short delay
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [onConsentChange]);

  const handleAcceptAll = () => {
    const newConsent = {
      analytics: true,
      marketing: true,
      functional: true,
    };
    saveConsent(newConsent);
    onConsentChange?.(newConsent);
    setIsVisible(false);
  };

  const handleAcceptNecessary = () => {
    const newConsent = {
      analytics: false,
      marketing: false,
      functional: true,
    };
    saveConsent(newConsent);
    onConsentChange?.(newConsent);
    setIsVisible(false);
  };

  const handleSavePreferences = () => {
    saveConsent(consent);
    onConsentChange?.(consent);
    setIsVisible(false);
    setShowPreferences(false);
  };

  const saveConsent = (newConsent: ConsentPreferences) => {
    localStorage.setItem('cookie_consent', JSON.stringify(newConsent));
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-card shadow-lg">
        <div className="container mx-auto px-4 py-6">
          {!showPreferences ? (
            <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">🍪 Мы используем cookies</h3>
                <p className="max-w-2xl text-sm text-muted-foreground">
                  Мы используем файлы cookie для улучшения работы сайта, анализа трафика и
                  персонализации контента. Продолжая использовать сайт, вы соглашаетесь с нашей{' '}
                  <a href="/legal/privacy" className="text-primary hover:underline">
                    Политикой конфиденциальности
                  </a>
                  .
                </p>
              </div>
              <div className="flex flex-shrink-0 gap-2">
                <Button variant="outline" size="sm" onClick={() => setShowPreferences(true)}>
                  Настройки
                </Button>
                <Button variant="outline" size="sm" onClick={handleAcceptNecessary}>
                  Только необходимые
                </Button>
                <Button size="sm" onClick={handleAcceptAll}>
                  Принять все
                </Button>
              </div>
            </div>
          ) : (
            /* Preferences Panel */
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Настройки cookies</h3>
              <p className="text-sm text-muted-foreground">
                Выберите, какие типы cookies вы хотите разрешить:
              </p>

              <div className="space-y-3">
                <ConsentOption
                  title="Необходимые cookies"
                  description="Необходимы для работы сайта. Не могут быть отключены."
                  enabled={true}
                  disabled={true}
                  onChange={() => {}}
                />
                <ConsentOption
                  title="Аналитические cookies"
                  description="Помогают нам понять, как вы используете сайт (Google Analytics, Яндекс.Метрика)."
                  enabled={consent.analytics}
                  disabled={false}
                  onChange={(checked) => setConsent({ ...consent, analytics: checked })}
                />
                <ConsentOption
                  title="Маркетинговые cookies"
                  description="Используются для показа релевантной рекламы и отслеживания эффективности кампаний."
                  enabled={consent.marketing}
                  disabled={false}
                  onChange={(checked) => setConsent({ ...consent, marketing: checked })}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => setShowPreferences(false)}>
                  Назад
                </Button>
                <Button size="sm" onClick={handleSavePreferences}>
                  Сохранить настройки
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Backdrop */}
      {showPreferences && (
        <div className="fixed inset-0 z-40 bg-black/50" onClick={() => setShowPreferences(false)} />
      )}
    </>
  );
}

function ConsentOption({
  title,
  description,
  enabled,
  disabled,
  onChange,
}: {
  title: string;
  description: string;
  enabled: boolean;
  disabled: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors hover:bg-muted/50">
      <input
        type="checkbox"
        className="mt-1 h-4 w-4 rounded border-input"
        checked={enabled}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
      />
      <div className="flex-1">
        <div className="font-medium">{title}</div>
        <div className="text-sm text-muted-foreground">{description}</div>
      </div>
    </label>
  );
}
