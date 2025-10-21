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

EXPOSE 3000

CMD ["node", "dist/main.js"]

