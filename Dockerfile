# syntax=docker/dockerfile:1.6

ARG NODE_VERSION=20.16.0
FROM node:${NODE_VERSION}-alpine AS base
WORKDIR /app

# Install necessary packages for builds
RUN apk add --no-cache libc6-compat

# 1) Install deps with caching
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

# 2) Build
FROM base AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NODE_ENV=production
RUN npm run build

# 3) Runtime image
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy built server and public assets
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json

# The server expects PORT and may use DATABASE_URL, HUGGINGFACE_API_KEY
ENV PORT=5000
EXPOSE 5000

CMD ["npm", "run", "start"]


