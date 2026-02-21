-- =====================================================
-- LEGAL ENGINE & ANALYTICS TABLES
-- =====================================================

-- Legal Documents Table
CREATE TABLE legal_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_type TEXT NOT NULL,
  locale TEXT NOT NULL DEFAULT 'ru',
  version TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  summary TEXT,
  effective_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  expiration_date TIMESTAMP WITH TIME ZONE,
  jurisdiction TEXT,
  metadata JSONB,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'archived', 'draft')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT unique_document_version UNIQUE (document_type, locale, version)
);

CREATE INDEX idx_legal_documents_type ON legal_documents(document_type);
CREATE INDEX idx_legal_documents_locale ON legal_documents(locale);
CREATE INDEX idx_legal_documents_status ON legal_documents(status);

-- Legal Templates Table
CREATE TABLE legal_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_type TEXT NOT NULL,
  locale TEXT NOT NULL DEFAULT 'ru',
  title TEXT NOT NULL,
  template TEXT NOT NULL,
  variables TEXT[] DEFAULT '{}',
  jurisdiction TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT unique_template UNIQUE (template_type, locale, jurisdiction)
);

CREATE INDEX idx_legal_templates_type ON legal_templates(template_type);
CREATE INDEX idx_legal_templates_locale ON legal_templates(locale);

-- Legal Acceptances Table
CREATE TABLE legal_acceptances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL,
  version TEXT NOT NULL,
  accepted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address TEXT,
  user_agent TEXT,
  metadata JSONB,
  
  CONSTRAINT unique_user_document UNIQUE (user_id, document_type)
);

CREATE INDEX idx_legal_acceptances_user ON legal_acceptances(user_id);
CREATE INDEX idx_legal_acceptances_document ON legal_acceptances(document_type);

-- Consent Records Table (GDPR)
CREATE TABLE consent_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  analytics_consent BOOLEAN DEFAULT FALSE,
  marketing_consent BOOLEAN DEFAULT FALSE,
  functional_consent BOOLEAN DEFAULT TRUE,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_hash TEXT,
  user_agent TEXT,
  metadata JSONB
);

CREATE INDEX idx_consent_records_session ON consent_records(session_id);
CREATE INDEX idx_consent_records_user ON consent_records(user_id);
CREATE INDEX idx_consent_records_recorded ON consent_records(recorded_at);

-- Update analytics table for GDPR compliance
ALTER TABLE traffic_events 
  ADD COLUMN IF NOT EXISTS ip_hash TEXT,
  ADD COLUMN IF NOT EXISTS consent_id UUID REFERENCES consent_records(id);

-- Insert default legal documents (Russian)
INSERT INTO legal_documents (document_type, locale, version, title, content, status) VALUES
  ('terms_of_service', 'ru', '1.0.0', 'Условия использования', '
<h1>Условия использования OpenBooking</h1>

<h2>1. Общие положения</h2>
<p>Добро пожаловать на платформу OpenBooking. Используя наш сервис, вы соглашаетесь с настоящими Условиями использования.</p>

<h2>2. Регистрация и аккаунт</h2>
<p>Для использования сервиса необходимо создать аккаунт, предоставив достоверную информацию.</p>

<h2>3. Бронирование</h2>
<p>Бронирование осуществляется через платформу с защитой средств через Escrow-протокол.</p>

<h2>4. Оплата</h2>
<p>Мы принимаем криптовалюты (ETH, DAI, A7A5) и фиатные платежи через партнёров.</p>

<h2>5. Отмена бронирования</h2>
<p>Условия отмены зависят от политики конкретного объекта размещения.</p>

<h2>6. Ответственность</h2>
<p>OpenBooking выступает посредником и не несёт ответственности за действия пользователей.</p>

<h2>7. Изменения условий</h2>
<p>Мы оставляем за собой право изменять условия с уведомлением пользователей.</p>
  ', 'active'),
  
  ('privacy_policy', 'ru', '1.0.0', 'Политика конфиденциальности', '
<h1>Политика конфиденциальности OpenBooking</h1>

<h2>1. Сбор данных</h2>
<p>Мы собираем минимально необходимые данные для работы сервиса:</p>
<ul>
  <li>Email для регистрации</li>
  <li>Имя для бронирований</li>
  <li>Анонимизированные данные аналитики</li>
</ul>

<h2>2. Использование данных</h2>
<p>Ваши данные используются только для:</p>
<ul>
  <li>Обработки бронирований</li>
  <li>Улучшения сервиса</li>
  <li>Коммуникации с вами</li>
</ul>

<h2>3. Защита данных</h2>
<p>Мы применяем современные методы защиты:</p>
<ul>
  <li>Шифрование при передаче (TLS)</li>
  <li>Хранение в защищённых дата-центрах</li>
  <li>Регулярные аудиты безопасности</li>
</ul>

<h2>4. Права пользователей (GDPR)</h2>
<p>Вы имеете право на:</p>
<ul>
  <li>Доступ к вашим данным</li>
  <li>Исправление данных</li>
  <li>Удаление данных</li>
  <li>Экспорт данных</li>
  <li>Отзыв согласия</li>
</ul>

<h2>5. Cookies</h2>
<p>Мы используем только first-party cookies с вашего согласия.</p>

<h2>6. Контакты</h2>
<p>По вопросам конфиденциальности: privacy@openbooking.com</p>
  ', 'active'),
  
  ('cookie_policy', 'ru', '1.0.0', 'Политика использования cookies', '
<h1>Политика использования cookies</h1>

<h2>Что такое cookies?</h2>
<p>Cookies — это небольшие файлы, сохраняемые на вашем устройстве.</p>

<h2>Какие cookies мы используем</h2>
<ul>
  <li><strong>Необходимые</strong> — для работы сайта</li>
  <li><strong>Аналитические</strong> — для понимания использования сайта</li>
  <li><strong>Функциональные</strong> — для запоминания настроек</li>
</ul>

<h2>Управление cookies</h2>
<p>Вы можете управлять настройками cookies через браузер или наш баннер согласия.</p>

<h2>Third-party cookies</h2>
<p>Мы не используем third-party cookies для отслеживания.</p>
  ', 'active')

ON CONFLICT (document_type, locale, version) DO NOTHING;

-- Insert legal templates
INSERT INTO legal_templates (template_type, locale, title, template, variables) VALUES
  ('rental_agreement', 'ru', 'Договор аренды недвижимости', '
ДОГОВОР АРЕНДЫ НЕДВИЖИМОСТИ

г. {{city}}                                                                 "{{date}}"

{{hostName}} (именуемый "Арендодатель") и {{guestName}} (именуемый "Арендатор") заключили договор:

1. ПРЕДМЕТ ДОГОВОРА
1.1. Арендодатель предоставляет Арендатору недвижимость по адресу: {{propertyAddress}}
1.2. Срок аренды: с {{checkInDate}} по {{checkOutDate}}
1.3. Стоимость: {{totalAmount}} {{currency}}

2. ПРАВА И ОБЯЗАННОСТИ
2.1. Арендатор обязуется использовать недвижимость по назначению
2.2. Арендодатель обязуется предоставить недвижимость в надлежащем состоянии

3. ОТВЕТСТВЕННОСТЬ СТОРОН
3.1. Стороны несут ответственность согласно законодательству

4. РЕКВИЗИТЫ
Арендодатель: {{hostName}}, {{hostEmail}}
Арендатор: {{guestName}}, {{guestEmail}}
  ', ARRAY['city', 'date', 'hostName', 'guestName', 'propertyAddress', 'checkInDate', 'checkOutDate', 'totalAmount', 'currency', 'hostEmail', 'guestEmail'])

ON CONFLICT (template_type, locale) DO NOTHING;
