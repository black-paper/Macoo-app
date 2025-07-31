# Makeoo Backend Dockerfile
# マルチステージビルド対応（開発・本番）

# Base stage - 共通の基盤
FROM node:20-alpine AS base
WORKDIR /app
RUN apk add --no-cache libc6-compat
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Development stage
FROM node:20-alpine AS development
WORKDIR /app
RUN apk add --no-cache libc6-compat curl

# 開発用依存関係をインストール
COPY package*.json ./
RUN npm install

# Prismaクライアント生成
COPY prisma ./prisma/
RUN npx prisma generate

# アプリケーションコードをコピー
COPY . .

# 開発用ポート
EXPOSE 3001

# ヘルスチェック
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3001/health || exit 1

# 開発サーバー起動
CMD ["npm", "run", "dev"]

# Build stage - TypeScriptコンパイル
FROM base AS builder
WORKDIR /app

# 開発依存関係をインストール
COPY package*.json ./
RUN npm install

# ソースコードとPrismaスキーマをコピー
COPY . .
COPY prisma ./prisma/

# Prismaクライアント生成
RUN npx prisma generate

# TypeScriptコンパイル
RUN npm run build

# Production stage
FROM node:20-alpine AS production
WORKDIR /app

# セキュリティ: 非rootユーザーで実行
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 makeoo

# 必要なパッケージをインストール
RUN apk add --no-cache libc6-compat curl

# 本番用依存関係をコピー
COPY --from=base /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package*.json ./

# Prismaクライアント生成
RUN npx prisma generate

# アップロードディレクトリ作成
RUN mkdir -p uploads logs
RUN chown -R makeoo:nodejs uploads logs

# ユーザー切り替え
USER makeoo

# 本番用ポート
EXPOSE 3001

# ヘルスチェック
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3001/health || exit 1

# 本番サーバー起動
CMD ["npm", "start"] 