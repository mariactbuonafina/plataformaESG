--  sequences
CREATE SEQUENCE IF NOT EXISTS public.empresas_id_seq INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;
ALTER SEQUENCE public.empresas_id_seq OWNER TO CURRENT_USER;

CREATE SEQUENCE IF NOT EXISTS public.usuarios_id_seq INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;
ALTER SEQUENCE public.usuarios_id_seq OWNER TO CURRENT_USER;

CREATE SEQUENCE IF NOT EXISTS public.indicadores_sociais_id_seq INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;
ALTER SEQUENCE public.indicadores_sociais_id_seq OWNER TO CURRENT_USER;

CREATE SEQUENCE IF NOT EXISTS public.indicadores_ambientais_id_seq INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;
ALTER SEQUENCE public.indicadores_ambientais_id_seq OWNER TO CURRENT_USER;

CREATE SEQUENCE IF NOT EXISTS public.indicadores_governanca_id_seq INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;
ALTER SEQUENCE public.indicadores_governanca_id_seq OWNER TO CURRENT_USER;

-- tabela empresas

CREATE TABLE IF NOT EXISTS public.empresas (
    id integer NOT NULL DEFAULT nextval('empresas_id_seq'::regclass),
    nome_fantasia varchar(255) NOT NULL,
    razao_social varchar(255),
    cnpj varchar(18) UNIQUE,
    segmento varchar(100),
    criado_em timestamp DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT empresas_pkey PRIMARY KEY (id)
);

ALTER TABLE public.empresas OWNER TO CURRENT_USER;

--  tabela usuários
CREATE TABLE IF NOT EXISTS public.usuarios (
    id integer NOT NULL DEFAULT nextval('usuarios_id_seq'::regclass),
    nome varchar(100),
    senha_hash text NOT NULL,
    criado_em timestamp DEFAULT CURRENT_TIMESTAMP,
    email_encrypted bytea,
    cpf_encrypted bytea,
    empresa_id integer,
    CONSTRAINT usuarios_pkey PRIMARY KEY (id),
    CONSTRAINT fk_empresa FOREIGN KEY (empresa_id)
        REFERENCES public.empresas (id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

ALTER TABLE public.usuarios OWNER TO CURRENT_USER;

--  indicadores sociais
CREATE TABLE IF NOT EXISTS public.indicadores_sociais (
    id integer NOT NULL DEFAULT nextval('indicadores_sociais_id_seq'::regclass),
    empresa_id integer,
    diversidade_funcional numeric(5,2),
    horas_treinamento numeric(10,2),
    projetos_comunitarios text,
    periodo date,
    CONSTRAINT indicadores_sociais_pkey PRIMARY KEY (id),
    CONSTRAINT indicadores_sociais_empresa_id_fkey FOREIGN KEY (empresa_id)
        REFERENCES public.empresas (id)
        ON DELETE CASCADE
);

ALTER TABLE public.indicadores_sociais OWNER TO CURRENT_USER;

--  indicadores ambientais
CREATE TABLE IF NOT EXISTS public.indicadores_ambientais (
    id integer NOT NULL DEFAULT nextval('indicadores_ambientais_id_seq'::regclass),
    empresa_id integer,
    emissao_co2 numeric(10,2),
    consumo_agua numeric(10,2),
    energia_renovavel numeric(5,2),
    periodo date,
    CONSTRAINT indicadores_ambientais_pkey PRIMARY KEY (id),
    CONSTRAINT indicadores_ambientais_empresa_id_fkey FOREIGN KEY (empresa_id)
        REFERENCES public.empresas (id)
        ON DELETE CASCADE
);

ALTER TABLE public.indicadores_ambientais OWNER TO CURRENT_USER;

--  indicadores governança
CREATE TABLE IF NOT EXISTS public.indicadores_governanca (
    id integer NOT NULL DEFAULT nextval('indicadores_governanca_id_seq'::regclass),
    empresa_id integer,
    politicas_anticorrupcao boolean,
    transparencia_relatorios boolean,
    conselho_diverso boolean,
    periodo date,
    CONSTRAINT indicadores_governanca_pkey PRIMARY KEY (id),
    CONSTRAINT indicadores_governanca_empresa_id_fkey FOREIGN KEY (empresa_id)
        REFERENCES public.empresas (id)
        ON DELETE CASCADE
);

ALTER TABLE public.indicadores_governanca OWNER TO CURRENT_USER;