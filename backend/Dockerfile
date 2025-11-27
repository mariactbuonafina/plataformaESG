# base
FROM node:20-slim AS base
WORKDIR /app
ENV NODE_ENV=production
RUN apt-get update && apt-get install -y tini && rm -rf /var/lib/apt/lists/*
ENTRYPOINT ["/usr/bin/tini","--"]

# dependencies
FROM base AS deps
COPY package*.json ./
RUN npm ci --omit=dev

# dev
FROM base AS dev
ENV NODE_ENV=development
USER node
WORKDIR /app
COPY --chown=node:node . .
EXPOSE 3333
CMD ["npm","run","dev"]

# prod
FROM base AS prod
USER node
WORKDIR /app
COPY --chown=node:node --from=deps /app/node_modules ./node_modules
COPY --chown=node:node . .
EXPOSE 3333
CMD ["npm","start"]