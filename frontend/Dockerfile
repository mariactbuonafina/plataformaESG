# --- base ---
FROM node:20-slim AS base
WORKDIR /app
RUN apt-get update && apt-get install -y tini && rm -rf /var/lib/apt/lists/*
ENTRYPOINT ["/usr/bin/tini","--"]

# --- deps (dev) ---
FROM base AS deps-dev
ENV NODE_ENV=development
COPY package*.json ./
RUN npm ci

# --- dev runtime ---
FROM base AS dev
ENV NODE_ENV=development
USER node
WORKDIR /app
COPY --chown=node:node . .
EXPOSE 5173
# Garanta que o script 'dev' do package.json use --host
# ex.: "dev": "vite --host"
CMD ["npm","run","dev"]

# --- build (prod) ---
FROM base AS build
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# --- prod (nginx) ---
FROM nginx:alpine AS prod
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx","-g","daemon off;"]