-- Criar tabela de usuários
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user'
);

-- Inserir usuário admin com senha criptografada
-- Senha: digital@123 -> hash gerado com bcrypt
INSERT INTO users (name, email, password, role) VALUES
('Admin', 'admin@empresa.com', '$2b$10$PlM3/sZppbprAqI5IusykOjFlYvLnW6u5TUc0cpY.bgNJ3q4fstBW', 'admin')
ON CONFLICT (email) DO NOTHING;