# Using Node.js 20 because it's the LTS version and works well with Next.js
FROM node:20-alpine AS base

# Installing dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files first - this helps with Docker layer caching
# If package.json doesn't change, Docker reuses this layer
COPY package.json package-lock.json* ./
RUN npm ci

# Building the application
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Disable Next.js telemetry during build - not needed in containers
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# Production image - keeping it small
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Creating a non-root user for security
# Running as root in containers is a bad practice
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copying necessary files only
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Using node server.js instead of npm start for better performance
CMD ["node", "server.js"]
