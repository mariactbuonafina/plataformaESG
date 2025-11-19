-- 1. CRIAÇÃO DO BANCO DE DADOS (somente se for executado fora do banco principal)
-- ao usar Docker Compose com POSTGRES_DB=plataformaESG,
-- o banco já é criado automaticamente pelo container.
-- então, esta parte é opcional e pode ser omitida no Docker.

-- ============================================================
-- CREATE DATABASE "plataformaESG"
--     WITH
--     OWNER = postgres
--     ENCODING = 'UTF8'
--     LC_COLLATE = 'pt_BR.UTF-8'
--     LC_CTYPE = 'pt_BR.UTF-8'
--     TABLESPACE = pg_default
--     CONNECTION LIMIT = -1
--     IS_TEMPLATE = False;
-- ============================================================

-- Conecta ao banco principal (caso necessário)
-- \connect plataformaESG;


-- 2. TABELA DE USUÁRIOS

CREATE TABLE IF NOT EXISTS public.usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100),
    senha_hash TEXT NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    email_encrypted BYTEA,
    cpf_encrypted BYTEA
);

ALTER TABLE public.usuarios OWNER TO CURRENT_USER;

-- 3. TABELA DE INDICADORES SOCIAIS

CREATE TABLE IF NOT EXISTS public.indicadores_sociais (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES public.usuarios (id) ON DELETE NO ACTION ON UPDATE NO ACTION,
    diversidade_funcional NUMERIC(5,2),
    horas_treinamento NUMERIC(10,2),
    projetos_comunitarios TEXT,
    periodo DATE
);

ALTER TABLE public.indicadores_sociais OWNER TO CURRENT_USER;

-- 4. TABELA DE INDICADORES DE GOVERNANÇA

CREATE TABLE IF NOT EXISTS public.indicadores_governanca (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES public.usuarios (id) ON DELETE NO ACTION ON UPDATE NO ACTION,
    politicas_anticorrupcao BOOLEAN,
    transparencia_relatorios BOOLEAN,
    conselho_diverso BOOLEAN,
    periodo DATE
);

ALTER TABLE public.indicadores_governanca OWNER TO CURRENT_USER;

-- 5. TABELA DE INDICADORES AMBIENTAIS

CREATE TABLE IF NOT EXISTS public.indicadores_ambientais (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES public.usuarios (id) ON DELETE NO ACTION ON UPDATE NO ACTION,
    emissao_co2 NUMERIC(10,2),
    consumo_agua NUMERIC(10,2),
    energia_renovavel NUMERIC(5,2),
    periodo DATE
);

ALTER TABLE public.indicadores_ambientais OWNER TO CURRENT_USER;

-- 6. INSERÇÃO OPCIONAL DE DADOS INICIAIS (para teste)

INSERT INTO public.usuarios (nome, senha_hash)
VALUES
('Administrador ESG', 'hash_teste_123'),
('Usuário Exemplo', 'hash_teste_456')
ON CONFLICT DO NOTHING;
