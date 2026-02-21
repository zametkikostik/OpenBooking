// ============================================
// OPENBOOKING I18N CONFIGURATION
// Multi-language support (9 languages)
// ============================================

export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский' },
  { code: 'bg', name: 'Bulgarian', nativeName: 'Български' },
  { code: 'ua', name: 'Ukrainian', nativeName: 'Українська' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'pl', name: 'Polish', nativeName: 'Polski' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe' }
] as const

export type LanguageCode = typeof SUPPORTED_LANGUAGES[number]['code']

export const DEFAULT_LANGUAGE: LanguageCode = 'en'

// ============================================
// TRANSLATION RESOURCES
// ============================================

export const translations = {
  en: {
    common: {
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      cancel: 'Cancel',
      confirm: 'Confirm',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
      search: 'Search',
      filter: 'Filter',
      sort: 'Sort',
      view: 'View',
      close: 'Close',
      back: 'Back',
      next: 'Next',
      previous: 'Previous',
      yes: 'Yes',
      no: 'No'
    },
    navigation: {
      home: 'Home',
      properties: 'Properties',
      bookings: 'Bookings',
      dashboard: 'Dashboard',
      messages: 'Messages',
      profile: 'Profile',
      settings: 'Settings',
      login: 'Login',
      signup: 'Sign Up',
      logout: 'Logout'
    },
    auth: {
      email: 'Email',
      password: 'Password',
      forgotPassword: 'Forgot Password?',
      resetPassword: 'Reset Password',
      noAccount: "Don't have an account?",
      hasAccount: 'Already have an account?',
      signIn: 'Sign In',
      signUp: 'Sign Up',
      signInWithGoogle: 'Sign in with Google',
      signInWithWallet: 'Connect Wallet'
    },
    property: {
      title: 'Title',
      description: 'Description',
      location: 'Location',
      price: 'Price',
      perNight: 'per night',
      guests: 'Guests',
      bedrooms: 'Bedrooms',
      beds: 'Beds',
      bathrooms: 'Bathrooms',
      amenities: 'Amenities',
      photos: 'Photos',
      reviews: 'Reviews',
      host: 'Host',
      bookNow: 'Book Now',
      checkIn: 'Check-in',
      checkOut: 'Check-out',
      addProperty: 'Add Property',
      editProperty: 'Edit Property'
    },
    booking: {
      status: {
        pending: 'Pending',
        payment_locked: 'Payment Secured',
        confirmed: 'Confirmed',
        checked_in: 'Checked In',
        completed: 'Completed',
        settled: 'Settled',
        cancelled: 'Cancelled',
        disputed: 'Disputed',
        refunded: 'Refunded'
      },
      total: 'Total',
      subtotal: 'Subtotal',
      cleaningFee: 'Cleaning Fee',
      serviceFee: 'Service Fee',
      taxes: 'Taxes',
      nights: 'nights',
      guest: 'Guest',
      myBookings: 'My Bookings',
      cancelBooking: 'Cancel Booking'
    },
    payment: {
      method: 'Payment Method',
      crypto: 'Cryptocurrency',
      fiat: 'Fiat Currency',
      methods: {
        usdt: 'USDT (Tether)',
        usdc: 'USDC',
        eth: 'Ethereum (ETH)',
        obt_token: 'OpenBooking Token (OBT)',
        sbp: 'SBP (Russia)',
        mir: 'Mir Card',
        yookassa: 'YooKassa',
        sepa: 'SEPA Transfer',
        adyen: 'Adyen',
        klarna: 'Klarna',
        visa: 'Visa',
        mastercard: 'Mastercard'
      },
      payNow: 'Pay Now',
      paymentSuccess: 'Payment Successful',
      paymentFailed: 'Payment Failed'
    },
    dashboard: {
      welcome: 'Welcome',
      stats: 'Statistics',
      activeBookings: 'Active Bookings',
      totalRevenue: 'Total Revenue',
      properties: 'Properties',
      reviews: 'Reviews',
      earnings: 'Earnings',
      payouts: 'Payouts'
    },
    footer: {
      activeBookings: 'Active Bookings',
      onlineUsers: 'Online Users',
      tvl: 'Total Value Locked',
      revenue: 'Revenue'
    },
    legal: {
      termsOfService: 'Terms of Service',
      privacyPolicy: 'Privacy Policy',
      hostAgreement: 'Host Agreement',
      guestAgreement: 'Guest Agreement',
      cancellationPolicy: 'Cancellation Policy',
      acceptTerms: 'I accept the Terms of Service',
      acceptPrivacy: 'I accept the Privacy Policy'
    }
  },
  ru: {
    common: {
      loading: 'Загрузка...',
      error: 'Ошибка',
      success: 'Успешно',
      cancel: 'Отмена',
      confirm: 'Подтвердить',
      save: 'Сохранить',
      delete: 'Удалить',
      edit: 'Редактировать',
      search: 'Поиск',
      filter: 'Фильтр',
      sort: 'Сортировать',
      view: 'Просмотр',
      close: 'Закрыть',
      back: 'Назад',
      next: 'Далее',
      previous: 'Назад',
      yes: 'Да',
      no: 'Нет'
    },
    navigation: {
      home: 'Главная',
      properties: 'Жилье',
      bookings: 'Бронирования',
      dashboard: 'Панель',
      messages: 'Сообщения',
      profile: 'Профиль',
      settings: 'Настройки',
      login: 'Войти',
      signup: 'Регистрация',
      logout: 'Выйти'
    },
    auth: {
      email: 'Email',
      password: 'Пароль',
      forgotPassword: 'Забыли пароль?',
      resetPassword: 'Сбросить пароль',
      noAccount: 'Нет аккаунта?',
      hasAccount: 'Уже есть аккаунт?',
      signIn: 'Войти',
      signUp: 'Зарегистрироваться',
      signInWithGoogle: 'Войти через Google',
      signInWithWallet: 'Подключить кошелек'
    },
    property: {
      title: 'Название',
      description: 'Описание',
      location: 'Расположение',
      price: 'Цена',
      perNight: 'за ночь',
      guests: 'Гостей',
      bedrooms: 'Спален',
      beds: 'Кроватей',
      bathrooms: 'Ванных',
      amenities: 'Удобства',
      photos: 'Фото',
      reviews: 'Отзывы',
      host: 'Хост',
      bookNow: 'Забронировать',
      checkIn: 'Заезд',
      checkOut: 'Выезд',
      addProperty: 'Добавить жилье',
      editProperty: 'Редактировать'
    },
    booking: {
      status: {
        pending: 'Ожидает',
        payment_locked: 'Оплата заблокирована',
        confirmed: 'Подтверждено',
        checked_in: 'Заселение',
        completed: 'Завершено',
        settled: 'Расчет',
        cancelled: 'Отменено',
        disputed: 'Спор',
        refunded: 'Возврат'
      },
      total: 'Итого',
      subtotal: 'Промежуточный итог',
      cleaningFee: 'Уборка',
      serviceFee: 'Сервисный сбор',
      taxes: 'Налоги',
      nights: 'ночей',
      guest: 'Гость',
      myBookings: 'Мои бронирования',
      cancelBooking: 'Отменить бронирование'
    },
    payment: {
      method: 'Способ оплаты',
      crypto: 'Криптовалюта',
      fiat: 'Фиатная валюта',
      methods: {
        usdt: 'USDT (Tether)',
        usdc: 'USDC',
        eth: 'Ethereum (ETH)',
        obt_token: 'OpenBooking Token (OBT)',
        sbp: 'СБП (Россия)',
        mir: 'Карта Мир',
        yookassa: 'ЮKassa',
        sepa: 'SEPA перевод',
        adyen: 'Adyen',
        klarna: 'Klarna',
        visa: 'Visa',
        mastercard: 'Mastercard'
      },
      payNow: 'Оплатить',
      paymentSuccess: 'Оплата успешна',
      paymentFailed: 'Ошибка оплаты'
    },
    dashboard: {
      welcome: 'Добро пожаловать',
      stats: 'Статистика',
      activeBookings: 'Активные бронирования',
      totalRevenue: 'Общий доход',
      properties: 'Объекты',
      reviews: 'Отзывы',
      earnings: 'Заработок',
      payouts: 'Выплаты'
    },
    footer: {
      activeBookings: 'Активных бронирований',
      onlineUsers: 'Пользователей онлайн',
      tvl: 'Всего заблокировано (TVL)',
      revenue: 'Доход'
    },
    legal: {
      termsOfService: 'Условия использования',
      privacyPolicy: 'Политика конфиденциальности',
      hostAgreement: 'Соглашение хоста',
      guestAgreement: 'Соглашение гостя',
      cancellationPolicy: 'Политика отмены',
      acceptTerms: 'Я принимаю Условия использования',
      acceptPrivacy: 'Я принимаю Политику конфиденциальности'
    }
  },
  bg: {
    common: {
      loading: 'Зареждане...',
      error: 'Грешка',
      success: 'Успех',
      cancel: 'Отказ',
      confirm: 'Потвърди',
      save: 'Запази',
      delete: 'Изтрий',
      edit: 'Редактирай',
      search: 'Търси',
      filter: 'Филтър',
      sort: 'Сортирай',
      view: 'Виж',
      close: 'Затвори',
      back: 'Назад',
      next: 'Напред',
      previous: 'Предишен',
      yes: 'Да',
      no: 'Не'
    },
    navigation: {
      home: 'Начало',
      properties: 'Имоти',
      bookings: 'Резервации',
      dashboard: 'Табло',
      messages: 'Съобщения',
      profile: 'Профил',
      settings: 'Настройки',
      login: 'Вход',
      signup: 'Регистрация',
      logout: 'Изход'
    },
    property: {
      title: 'Заглавие',
      description: 'Описание',
      location: 'Местоположение',
      price: 'Цена',
      perNight: 'на нощувка',
      guests: 'Гости',
      bedrooms: 'Спални',
      beds: 'Легла',
      bathrooms: 'Бани',
      bookNow: 'Резервирай'
    },
    legal: {
      termsOfService: 'Условия за ползване',
      privacyPolicy: 'Политика за поверителност',
      hostAgreement: 'Споразумение с домакин',
      guestAgreement: 'Споразумение с гост',
      cancellationPolicy: 'Политика за отмяна'
    }
  },
  ua: {
    common: {
      loading: 'Завантаження...',
      error: 'Помилка',
      success: 'Успішно',
      cancel: 'Скасувати',
      confirm: 'Підтвердити',
      save: 'Зберегти',
      delete: 'Видалити',
      edit: 'Редагувати',
      search: 'Пошук',
      filter: 'Фільтр',
      sort: 'Сортувати',
      view: 'Перегляд',
      close: 'Закрити',
      back: 'Назад',
      next: 'Далі',
      previous: 'Попередній',
      yes: 'Так',
      no: 'Ні'
    },
    navigation: {
      home: 'Головна',
      properties: 'Житло',
      bookings: 'Бронювання',
      dashboard: 'Панель',
      messages: 'Повідомлення',
      profile: 'Профіль',
      settings: 'Налаштування',
      login: 'Увійти',
      signup: 'Реєстрація',
      logout: 'Вийти'
    },
    property: {
      title: 'Назва',
      description: 'Опис',
      location: 'Розташування',
      price: 'Ціна',
      perNight: 'за ніч',
      guests: 'Гостей',
      bedrooms: 'Спалень',
      beds: 'Ліжок',
      bathrooms: 'Ванних',
      bookNow: 'Забронювати'
    },
    legal: {
      termsOfService: 'Умови використання',
      privacyPolicy: 'Політика конфіденційності',
      hostAgreement: 'Угода хоста',
      guestAgreement: 'Угода гостя',
      cancellationPolicy: 'Політика скасування'
    }
  },
  de: {
    common: {
      loading: 'Laden...',
      error: 'Fehler',
      success: 'Erfolg',
      cancel: 'Abbrechen',
      confirm: 'Bestätigen',
      save: 'Speichern',
      delete: 'Löschen',
      edit: 'Bearbeiten',
      search: 'Suchen',
      filter: 'Filter',
      sort: 'Sortieren',
      view: 'Ansehen',
      close: 'Schließen',
      back: 'Zurück',
      next: 'Weiter',
      previous: 'Zurück',
      yes: 'Ja',
      no: 'Nein'
    },
    navigation: {
      home: 'Startseite',
      properties: 'Unterkünfte',
      bookings: 'Buchungen',
      dashboard: 'Dashboard',
      messages: 'Nachrichten',
      profile: 'Profil',
      settings: 'Einstellungen',
      login: 'Anmelden',
      signup: 'Registrieren',
      logout: 'Abmelden'
    },
    property: {
      title: 'Titel',
      description: 'Beschreibung',
      location: 'Standort',
      price: 'Preis',
      perNight: 'pro Nacht',
      guests: 'Gäste',
      bedrooms: 'Schlafzimmer',
      beds: 'Betten',
      bathrooms: 'Badezimmer',
      bookNow: 'Jetzt buchen'
    },
    legal: {
      termsOfService: 'Nutzungsbedingungen',
      privacyPolicy: 'Datenschutzrichtlinie',
      hostAgreement: 'Gastgeber-Vereinbarung',
      guestAgreement: 'Gast-Vereinbarung',
      cancellationPolicy: 'Stornierungsrichtlinie'
    }
  },
  fr: {
    common: {
      loading: 'Chargement...',
      error: 'Erreur',
      success: 'Succès',
      cancel: 'Annuler',
      confirm: 'Confirmer',
      save: 'Enregistrer',
      delete: 'Supprimer',
      edit: 'Modifier',
      search: 'Rechercher',
      filter: 'Filtrer',
      sort: 'Trier',
      view: 'Voir',
      close: 'Fermer',
      back: 'Retour',
      next: 'Suivant',
      previous: 'Précédent',
      yes: 'Oui',
      no: 'Non'
    },
    navigation: {
      home: 'Accueil',
      properties: 'Propriétés',
      bookings: 'Réservations',
      dashboard: 'Tableau de bord',
      messages: 'Messages',
      profile: 'Profil',
      settings: 'Paramètres',
      login: 'Connexion',
      signup: "S'inscrire",
      logout: 'Déconnexion'
    },
    property: {
      title: 'Titre',
      description: 'Description',
      location: 'Emplacement',
      price: 'Prix',
      perNight: 'par nuit',
      guests: 'Voyageurs',
      bedrooms: 'Chambres',
      beds: 'Lits',
      bathrooms: 'Salles de bain',
      bookNow: 'Réserver'
    },
    legal: {
      termsOfService: "Conditions d'utilisation",
      privacyPolicy: 'Politique de confidentialité',
      hostAgreement: 'Accord hôte',
      guestAgreement: 'Accord voyageur',
      cancellationPolicy: "Politique d'annulation"
    }
  },
  es: {
    common: {
      loading: 'Cargando...',
      error: 'Error',
      success: 'Éxito',
      cancel: 'Cancelar',
      confirm: 'Confirmar',
      save: 'Guardar',
      delete: 'Eliminar',
      edit: 'Editar',
      search: 'Buscar',
      filter: 'Filtrar',
      sort: 'Ordenar',
      view: 'Ver',
      close: 'Cerrar',
      back: 'Atrás',
      next: 'Siguiente',
      previous: 'Anterior',
      yes: 'Sí',
      no: 'No'
    },
    navigation: {
      home: 'Inicio',
      properties: 'Propiedades',
      bookings: 'Reservas',
      dashboard: 'Panel',
      messages: 'Mensajes',
      profile: 'Perfil',
      settings: 'Configuración',
      login: 'Iniciar sesión',
      signup: 'Registrarse',
      logout: 'Cerrar sesión'
    },
    property: {
      title: 'Título',
      description: 'Descripción',
      location: 'Ubicación',
      price: 'Precio',
      perNight: 'por noche',
      guests: 'Huéspedes',
      bedrooms: 'Habitaciones',
      beds: 'Camas',
      bathrooms: 'Baños',
      bookNow: 'Reservar'
    },
    legal: {
      termsOfService: 'Términos de servicio',
      privacyPolicy: 'Política de privacidad',
      hostAgreement: 'Acuerdo del anfitrión',
      guestAgreement: 'Acuerdo del huésped',
      cancellationPolicy: 'Política de cancelación'
    }
  },
  pl: {
    common: {
      loading: 'Ładowanie...',
      error: 'Błąd',
      success: 'Sukces',
      cancel: 'Anuluj',
      confirm: 'Potwierdź',
      save: 'Zapisz',
      delete: 'Usuń',
      edit: 'Edytuj',
      search: 'Szukaj',
      filter: 'Filtr',
      sort: 'Sortuj',
      view: 'Zobacz',
      close: 'Zamknij',
      back: 'Wstecz',
      next: 'Dalej',
      previous: 'Poprzedni',
      yes: 'Tak',
      no: 'Nie'
    },
    navigation: {
      home: 'Strona główna',
      properties: 'Nieruchomości',
      bookings: 'Rezerwacje',
      dashboard: 'Panel',
      messages: 'Wiadomości',
      profile: 'Profil',
      settings: 'Ustawienia',
      login: 'Zaloguj się',
      signup: 'Zarejestruj się',
      logout: 'Wyloguj się'
    },
    property: {
      title: 'Tytuł',
      description: 'Opis',
      location: 'Lokalizacja',
      price: 'Cena',
      perNight: 'za noc',
      guests: 'Goście',
      bedrooms: 'Sypialnie',
      beds: 'Łóżka',
      bathrooms: 'Łazienki',
      bookNow: 'Zarezerwuj'
    },
    legal: {
      termsOfService: 'Warunki korzystania',
      privacyPolicy: 'Polityka prywatności',
      hostAgreement: 'Umowa gospodarza',
      guestAgreement: 'Umowa gościa',
      cancellationPolicy: 'Polityka anulowania'
    }
  },
  tr: {
    common: {
      loading: 'Yükleniyor...',
      error: 'Hata',
      success: 'Başarılı',
      cancel: 'İptal',
      confirm: 'Onayla',
      save: 'Kaydet',
      delete: 'Sil',
      edit: 'Düzenle',
      search: 'Ara',
      filter: 'Filtre',
      sort: 'Sırala',
      view: 'Görüntüle',
      close: 'Kapat',
      back: 'Geri',
      next: 'İleri',
      previous: 'Önceki',
      yes: 'Evet',
      no: 'Hayır'
    },
    navigation: {
      home: 'Ana Sayfa',
      properties: 'Konaklamalar',
      bookings: 'Rezervasyonlar',
      dashboard: 'Kontrol Paneli',
      messages: 'Mesajlar',
      profile: 'Profil',
      settings: 'Ayarlar',
      login: 'Giriş Yap',
      signup: 'Kaydol',
      logout: 'Çıkış Yap'
    },
    property: {
      title: 'Başlık',
      description: 'Açıklama',
      location: 'Konum',
      price: 'Fiyat',
      perNight: 'gece başı',
      guests: 'Misafirler',
      bedrooms: 'Yatak Odaları',
      beds: 'Yataklar',
      bathrooms: 'Banyolar',
      bookNow: 'Rezervasyon Yap'
    },
    legal: {
      termsOfService: 'Hizmet Koşulları',
      privacyPolicy: 'Gizlilik Politikası',
      hostAgreement: 'Ev Sahibi Sözleşmesi',
      guestAgreement: 'Misafir Sözleşmesi',
      cancellationPolicy: 'İptal Politikası'
    }
  }
} as const

// ============================================
// HELPER FUNCTIONS
// ============================================

export function getTranslation<T extends string>(
  language: LanguageCode,
  namespace: keyof typeof translations.en,
  key: T
): string {
  const langTranslations = translations[language] || translations.en
  const namespaceTranslations = langTranslations[namespace as keyof typeof langTranslations]
  
  if (!namespaceTranslations) {
    // Fallback to English
    const enNamespace = translations.en[namespace]
    return (enNamespace as any)[key] || key
  }
  
  return (namespaceTranslations as any)[key] || 
         (translations.en[namespace] as any)[key] || 
         key
}

export function getNestedTranslation(
  language: LanguageCode,
  path: string
): string {
  const keys = path.split('.')
  let value: any = translations[language] || translations.en
  
  for (const key of keys) {
    value = value?.[key]
    if (value === undefined) {
      // Fallback to English
      value = translations.en
      for (const k of keys) {
        value = value?.[k]
      }
      break
    }
  }
  
  return typeof value === 'string' ? value : path
}

export function getLanguageName(code: LanguageCode): string {
  const lang = SUPPORTED_LANGUAGES.find(l => l.code === code)
  return lang?.nativeName || lang?.name || code
}

export function isSupportedLanguage(code: string): code is LanguageCode {
  return SUPPORTED_LANGUAGES.some(l => l.code === code)
}
