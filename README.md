# Plataforma ESG

![Node.js](https://img.shields.io/badge/Node.js-v19.x-green)
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
│ │ ├─ app.js
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
- Node.js 19 ou superior  
- npm 9 ou superior  
- Docker 20.10+  
- PostgreSQL 15 (opcional se usar Docker)  
- Editor de código: VSCode recomendado

---

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

## 🔹 Seção: Boas Práticas

```markdown
- Nunca commite arquivos `.env` com senhas reais  
- Use `package-lock.json` para manter versões consistentes  
- Use `npm run dev` para desenvolvimento (reinício automático do servidor)  
- Dockerize sempre que possível para padronizar ambiente  
- Documente novas rotas e alterações no README
