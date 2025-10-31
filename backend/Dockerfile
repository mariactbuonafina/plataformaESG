# ---- Base ----
FROM node:20-slim AS base
WORKDIR /app
ENV NODE_ENV=production
RUN apt-get update && apt-get install -y tini && rm -rf /var/lib/apt/lists/*
ENTRYPOINT ["/usr/bin/tini","--"]

# ---- Dependencies (prod) ----
FROM base AS deps
COPY package*.json ./
RUN npm ci --omit=dev

# ---- Dependencies (dev) ----
FROM base AS deps-dev
ENV NODE_ENV=development
COPY package*.json ./
RUN npm ci

# ---- Dev runtime ----
FROM base AS dev
ENV NODE_ENV=development
USER node
WORKDIR /app
COPY --chown=node:node . .
# Opcional: se usar nodemon/ts-node, já vem em dev deps
EXPOSE 3333
CMD ["npm","run","dev"]

# ---- Prod runtime ----
FROM base AS prod
USER node
WORKDIR /app
COPY --chown=node:node --from=deps /app/node_modules ./node_modules
COPY --chown=node:node . .
EXPOSE 3333
CMD ["npm","start"]