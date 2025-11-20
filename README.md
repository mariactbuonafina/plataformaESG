# Plataforma ESG

<<<<<<< HEAD
![Node.js](https://img.shields.io/badge/Node.js-v18.x-green)
=======
![Node.js](https://img.shields.io/badge/Node.js-v19.x-green)
>>>>>>> 345ab443f55dc387622fc8db5c44ac0e2bb2071a
![Express](https://img.shields.io/badge/Express-4.x-blue)
![React](https://img.shields.io/badge/React-18-blueviolet)
![Docker](https://img.shields.io/badge/Docker-20.10-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue)

---

## Descrição do Projeto
A **Plataforma ESG** permite que empresas:
- Respondam questionários de maturidade ESG.
- Anexem evidências (documentos, políticas internas).
- Recebam selo de certificação ESG (Bronze, Prata ou Ouro) baseado na pontuação obtida.

O projeto simula um ambiente real de desenvolvimento, com:
- Fluxo de Git/GitHub (branches, PRs, issues)  
- Gestão de projeto via Trello  
- Containerização via Docker

---

## Funcionalidades
- Questionários de maturidade ESG.  
- Upload de evidências (documentos, práticas, políticas).  
- Cálculo de selo ESG automático (Bronze, Prata, Ouro).  
- API REST com Node.js + Express.  
- Frontend interativo com React.  
- Banco PostgreSQL.  
- Docker para padronização de ambiente.

---

## Tecnologias Utilizadas
- **Frontend:** React 18  
- **Backend:** Node.js 18 + Express 4.x  
- **Banco de Dados:** PostgreSQL 15  
- **Containerização:** Docker + Docker Compose  
- **Controle de versão:** GitHub  

---

## Estrutura do Projeto

```plataformaESG/
├─ backend/ # API Node.js
│ ├─ src/
<<<<<<< HEAD
│ │ ├─ index.js
=======
│ │ ├─ app.js
>>>>>>> 345ab443f55dc387622fc8db5c44ac0e2bb2071a
│ │ └─ db.js
│ ├─ package.json
│ └─ Dockerfile
├─ frontend/ # React
│ ├─ src/
│ └─ Dockerfile
├─ database/
│ └─ init/ # scripts SQL iniciais
├─ docker-compose.yml
└─ .env.example
```

---

## Pré-requisitos
<<<<<<< HEAD
- Node.js 18 ou superior  
=======
- Node.js 19 ou superior  
>>>>>>> 345ab443f55dc387622fc8db5c44ac0e2bb2071a
- npm 9 ou superior  
- Docker 20.10+  
- PostgreSQL 15 (opcional se usar Docker)  
- Editor de código: VSCode recomendado

---

<<<<<<< HEAD
## Rotas da API

### Autenticação
- `POST /api/auth/register` - Registrar novo usuário
- `POST /api/auth/login` - Fazer login
- `GET /api/auth/me` - Obter informações do usuário logado (token)

### Usuários
- `GET /api/users` - Listar usuários (token)
- `GET /api/users/:id` - Buscar usuário (token)
- `POST /api/users` - Criar usuário (token)
- `PUT /api/users/:id` - Atualizar usuário (token)
- `DELETE /api/users/:id` - Deletar usuário (token)

### Questionários
- `GET /api/questionnaires` - Listar questionários
- `GET /api/questionnaires/:id` - Buscar questionário com perguntas
- `POST /api/questionnaires` - Criar questionário (token)
- `POST /api/questionnaires/:id/questions` - Adicionar pergunta (token)

### Respostas
- `POST /api/responses` - Salvar respostas (token)
- `GET /api/responses/questionnaire/:id` - Buscar respostas (token)
- `GET /api/responses/questionnaire/:id/score` - Pontuação (token)

### Evidências
- `GET /api/evidences` - Listar evidências (token)
- `POST /api/evidences` - Adicionar evidência (token)

### Selos
- `POST /api/seals/calculate` - Calcular selo ESG (token)
- `GET /api/seals` - Listar selos (token)
- `GET /api/seals/active` - Selo ativo (token)

### Documentação
- `GET /api` - Documentação completa da API
- `GET /ping` - Health check

---

## Docker

### Configuração

O projeto está configurado com Docker Compose para facilitar o desenvolvimento. O `docker-compose.yml` inclui:
- **PostgreSQL 15**: Banco de dados com volume persistente
- **Backend**: API Node.js com hot-reload em desenvolvimento
- **Rede Docker**: Todos os serviços na mesma rede para comunicação interna

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis (ou use os valores padrão):

```env
NODE_ENV=development
PORT=3333

# Configurações do Banco de Dados PostgreSQL
DB_USER=esg_user
DB_PASS=esg_pass
DB_NAME=esg_db
DB_HOST=db
DB_PORT=5432
```

**Importante**: No Docker, o `DB_HOST` deve ser `db` (nome do serviço no docker-compose), não `localhost`.

### Comandos Docker

**Subir todos os serviços:**
```bash
docker compose up --build
```

**Subir em modo detached (background):**
```bash
docker compose up -d --build
```

**Ver logs:**
```bash
docker compose logs -f
```

**Parar os serviços:**
```bash
docker compose down
```

**Parar e remover volumes (limpar dados do BD):**
```bash
docker compose down -v
```

### Testando a Conexão

Após subir os containers, você pode testar a conexão do backend com o banco:

```bash
# Entrar no container do backend
docker exec -it plataforma-esg-backend sh

# Dentro do container, testar conexão com o banco
ping db
```

### Verificação de Saúde

O docker-compose está configurado com `healthcheck` para o PostgreSQL. O backend só inicia após o banco estar saudável (`depends_on` com `condition: service_healthy`).

### Testando a API

Após subir os containers, você pode testar:

```bash
# Health check
curl http://localhost:3333/ping

# Documentação da API
curl http://localhost:3333/api

# Registrar usuário
curl -X POST http://localhost:3333/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Teste","email":"teste@teste.com","password":"senha123"}'

# Login (salvar o token retornado)
curl -X POST http://localhost:3333/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"teste@teste.com","password":"senha123"}'
```

**Script de teste automático (PowerShell):**
```powershell
.\test-api.ps1
```

---
=======
## Rotas Principais do Backend
- `GET /ping` → teste da API  
- `GET /users` → lista de usuários (mock se banco não estiver pronto)  
- `POST /responses` → enviar respostas do questionário  
- `POST /evidences` → enviar evidências  
- `GET /seals/:userId` → obter selo ESG do usuário

## Como Rodar a Aplicação

### Usando Docker Compose (Recomendado)

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/mariactbuonafina/plataformaESG.git
   cd plataformaESG
   ```

2. **Suba os containers:**
   ```bash
   docker-compose up --build
   ```

3. **Acesse a aplicação:**
   - Frontend: http://localhost
   - Backend: http://localhost:3333
   - Banco: localhost:5432

### Login
- **Usuário:** admin@empresa.com
- **Senha:** digital@123

A senha é criptografada usando bcrypt e o login utiliza JWT para autenticação segura.

### Desenvolvimento Local

1. **Backend:**
   ```bash
   cd backend
   npm install
   npm run dev
   ```

2. **Frontend:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Banco:**
   Configure PostgreSQL localmente ou use Docker.

## Autenticação e Segurança

- **Criptografia de Senha:** Utiliza bcrypt com salt rounds de 10.
- **JWT:** Tokens de autenticação com expiração de 1 hora.
- **Middleware de Autenticação:** Protege rotas sensíveis.

## Melhorias Implementadas

- Adicionado sistema de autenticação seguro.
- Integração frontend-backend para login.
- Containerização completa com Docker Compose.
- Banco de dados PostgreSQL com script de inicialização.
- Uso de melhores práticas de segurança (criptografia, JWT).
>>>>>>> 345ab443f55dc387622fc8db5c44ac0e2bb2071a

## 🔹 Seção: Boas Práticas

```markdown
- Nunca commite arquivos `.env` com senhas reais  
- Use `package-lock.json` para manter versões consistentes  
- Use `npm run dev` para desenvolvimento (reinício automático do servidor)  
- Dockerize sempre que possível para padronizar ambiente  
- Documente novas rotas e alterações no README
