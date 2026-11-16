-- Esquema do Matipó + (PostgreSQL)
-- Executado automaticamente na inicialização do servidor (idempotente).

CREATE TABLE IF NOT EXISTS categories (
  id         SERIAL PRIMARY KEY,
  category   TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS accounts (
  id            SERIAL PRIMARY KEY,
  name          TEXT NOT NULL,
  email         TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS business (
  id                   SERIAL PRIMARY KEY,
  business_photo       TEXT,
  business_name        TEXT NOT NULL,
  business_location    TEXT NOT NULL,
  business_description TEXT,
  business_contact     JSONB NOT NULL DEFAULT '{}'::jsonb,
  opening_time         TEXT,
  closing_time         TEXT,
  operating_days       TEXT[] NOT NULL DEFAULT '{}',
  business_map_html    TEXT,
  status               TEXT,
  category_name        TEXT,
  category_id          INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS health (
  id                   SERIAL PRIMARY KEY,
  health_photo         TEXT,
  health_name          TEXT NOT NULL,
  health_location      TEXT NOT NULL,
  health_description   TEXT,
  health_contact_infos JSONB NOT NULL DEFAULT '{}'::jsonb,
  opening_time         TEXT,
  closing_time         TEXT,
  operating_days       TEXT[] NOT NULL DEFAULT '{}',
  days_on_duty         TEXT[] NOT NULL DEFAULT '{}',
  health_html_map      TEXT,
  status               TEXT,
  date_publish         TEXT,
  publisher            TEXT,
  category_name        TEXT,
  category_id          INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS housing (
  id                    SERIAL PRIMARY KEY,
  housing_photo         TEXT,
  housing_name          TEXT NOT NULL,
  housing_location      TEXT NOT NULL,
  housing_description   TEXT,
  housing_contact_infos JSONB NOT NULL DEFAULT '{}'::jsonb,
  rooms_qtd             INTEGER,
  bathrooms_qtd         INTEGER,
  housing_html_map      TEXT,
  status                TEXT,
  date_publish          TEXT,
  publisher             TEXT,
  category_name         TEXT,
  category_id           INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS jobs (
  id              SERIAL PRIMARY KEY,
  job_photo       TEXT,
  job_name        TEXT NOT NULL,
  job_location    TEXT NOT NULL,
  job_description TEXT,
  job_contact     JSONB NOT NULL DEFAULT '{}'::jsonb,
  opening_time    TEXT,
  closing_time    TEXT,
  operating_days  TEXT[] NOT NULL DEFAULT '{}',
  job_map_html    TEXT,
  status          TEXT,
  business_name   TEXT,
  date_publish    TEXT,
  publisher       TEXT,
  category_name   TEXT,
  category_id     INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Categorias iniciais (os formulários do painel exigem uma categoria)
INSERT INTO categories (category) VALUES
  ('Alimentação'), ('Mercado'), ('Vestuário'), ('Serviços'), ('Beleza'),
  ('Farmácia'), ('Clínica'), ('Hospital'), ('Posto de Saúde'),
  ('Moradia'), ('Hospedagem'),
  ('Emprego'), ('Estágio')
ON CONFLICT (category) DO NOTHING;

-- ---------------------------------------------------------
-- v2: destaque, visualizações, auditoria e mensagens
-- ---------------------------------------------------------
ALTER TABLE business ADD COLUMN IF NOT EXISTS date_publish TEXT;
ALTER TABLE business ADD COLUMN IF NOT EXISTS publisher TEXT;

ALTER TABLE business ADD COLUMN IF NOT EXISTS featured BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE health   ADD COLUMN IF NOT EXISTS featured BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE housing  ADD COLUMN IF NOT EXISTS featured BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE jobs     ADD COLUMN IF NOT EXISTS featured BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE business ADD COLUMN IF NOT EXISTS views INTEGER NOT NULL DEFAULT 0;
ALTER TABLE health   ADD COLUMN IF NOT EXISTS views INTEGER NOT NULL DEFAULT 0;
ALTER TABLE housing  ADD COLUMN IF NOT EXISTS views INTEGER NOT NULL DEFAULT 0;
ALTER TABLE jobs     ADD COLUMN IF NOT EXISTS views INTEGER NOT NULL DEFAULT 0;

ALTER TABLE business ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();
ALTER TABLE health   ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();
ALTER TABLE housing  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();
ALTER TABLE jobs     ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();

-- Histórico de alterações feitas no painel
CREATE TABLE IF NOT EXISTS activity_log (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER REFERENCES accounts(id) ON DELETE SET NULL,
  user_name   TEXT,
  action      TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id   INTEGER,
  entity_name TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_activity_created ON activity_log (created_at DESC);

-- Mensagens enviadas pelos cidadãos (sugestões, correções, dúvidas)
CREATE TABLE IF NOT EXISTS messages (
  id         SERIAL PRIMARY KEY,
  kind       TEXT NOT NULL DEFAULT 'sugestao',
  name       TEXT NOT NULL,
  email      TEXT,
  phone      TEXT,
  subject    TEXT,
  body       TEXT NOT NULL,
  ref_type   TEXT,
  ref_id     INTEGER,
  ref_name   TEXT,
  status     TEXT NOT NULL DEFAULT 'novo',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_messages_status ON messages (status, created_at DESC);
