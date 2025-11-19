# ---- base ----
FROM node:20-slim AS base
WORKDIR /app
ENV NODE_ENV=production

RUN apt-get update && apt-get install -y tini && rm -rf /var/lib/apt/lists/*
ENTRYPOINT ["/usr/bin/tini", "--"]

# ---- dependencies (dev) ----
FROM base AS deps-dev
ENV NODE_ENV=development
COPY package*.json ./
RUN npm install

# ---- dev runtime ----
FROM base AS dev
ENV NODE_ENV=development
WORKDIR /app
USER node
COPY --chown=node:node . .
COPY --from=deps-dev /app/node_modules ./node_modules
EXPOSE 3333


ENV NODE_ENV $NODE_ENV

# Wait for database to be ready
CMD ["sh", "-c", "sleep 10 && if [ \"$NODE_ENV\" = 'production' ]; then npm start; else npm run dev; fi"]

