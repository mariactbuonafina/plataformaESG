# ---- Base Node ----
FROM node:20-slim AS base
WORKDIR /app
ENV NODE_ENV=production

# ---- Frontend Build ----
FROM node:22-alpine AS build-frontend
WORKDIR /app
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# ---- Backend Build ----
FROM base AS build-backend
WORKDIR /app
COPY backend/package*.json ./
RUN npm install --omit=dev
COPY backend/ ./

# ---- Final Image ----
FROM base AS final
WORKDIR /app
# Copy built backend with production dependencies
COPY --from=build-backend /app ./
# Copy built frontend assets
COPY --from=build-frontend /app/dist ./public

# Expose port and start app
EXPOSE 3003
CMD ["node", "src/app.js"]