FROM node:20.19-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci --no-audit --no-fund

COPY . .

RUN npm run build

FROM node:20.19-alpine AS runner
WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev --no-audit --no-fund

COPY --from=builder /app/dist ./dist
COPY nest-cli.json ./nest-cli.json
COPY tsconfig.json ./tsconfig.json
ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

RUN apk add --no-cache curl
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=5 CMD sh -c 'curl -sS http://127.0.0.1:${PORT:-3000}/ >/dev/null || exit 1'

CMD ["node", "dist/main.js"]

