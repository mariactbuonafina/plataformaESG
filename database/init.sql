-- 1) tabela users
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2) responses (respostas do questionário por usuário)
CREATE TABLE IF NOT EXISTS responses (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  question_key VARCHAR(200) NOT NULL,
  answer TEXT,
  score NUMERIC(8,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3) evidences (metadados; arquivos em storage no host/container)
CREATE TABLE IF NOT EXISTS evidences (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  filename VARCHAR(512) NOT NULL,
  filepath TEXT NOT NULL,
  mimetype VARCHAR(200),
  description TEXT,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4) seals (resultado / selo do usuário)
CREATE TABLE IF NOT EXISTS seals (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  score_total NUMERIC(10,2) DEFAULT 0,
  level VARCHAR(50),
  certificate_path TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5) empresas (tabela para armazenar empresas)
CREATE TABLE IF NOT EXISTS empresas (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  cnpj VARCHAR(14) UNIQUE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6) esg_responses (respostas do formulário ESG)
CREATE TABLE IF NOT EXISTS esg_responses (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  empresa_id INTEGER NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  respostas JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, empresa_id)
);

-- 7) esg_evidencias (upload de evidências ESG)
CREATE TABLE IF NOT EXISTS esg_evidencias (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  empresa_id INTEGER NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  file_path VARCHAR(512) NOT NULL,
  file_name VARCHAR(512) NOT NULL,
  file_size INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8) esg_calculations (cálculos do score ESG)
CREATE TABLE IF NOT EXISTS esg_calculations (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  empresa_id INTEGER NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  score INTEGER,
  seal VARCHAR(50),
  details JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, empresa_id)
);

-- índices
CREATE INDEX IF NOT EXISTS idx_responses_user ON responses(user_id);
CREATE INDEX IF NOT EXISTS idx_evidences_user ON evidences(user_id);
CREATE INDEX IF NOT EXISTS idx_seals_user ON seals(user_id);
CREATE INDEX IF NOT EXISTS idx_esg_responses_user_empresa ON esg_responses(user_id, empresa_id);
CREATE INDEX IF NOT EXISTS idx_esg_evidencias_empresa ON esg_evidencias(empresa_id);
CREATE INDEX IF NOT EXISTS idx_esg_calculations_user_empresa ON esg_calculations(user_id, empresa_id);

-- admin inicial (hash gerado com bcrypt rounds=10)
-- Senha de exemplo: digital@123 (hash abaixo corresponde à essa senha)
INSERT INTO users (name, email, password, role)
VALUES
('Admin', 'admin@empresa.com', '$2b$10$PlM3/sZppbprAqI5IusykOjFlYvLnW6u5TUc0cpY.bgNJ3q4fstBW', 'admin')
ON CONFLICT (email) DO NOTHING;

-- empresa de teste
INSERT INTO empresas (nome, cnpj, user_id)
SELECT 'Empresa Teste', '12345678000190', id FROM users WHERE email = 'admin@empresa.com'
ON CONFLICT (cnpj) DO NOTHING;

