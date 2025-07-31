# 🌱 Makeoo Development Makefile
# Usage: make [target]

.PHONY: help dev setup build test clean docker-up docker-down docker-logs db-reset lint

# デフォルトターゲット
.DEFAULT_GOAL := help

# ヘルプメッセージ
help: ## 利用可能なコマンドを表示
	@echo "🌱 Makeoo 開発用コマンド"
	@echo ""
	@echo "🚀 クイックスタート:"
	@echo "   make setup     # 初回セットアップ（Docker必要）"
	@echo "   make dev       # 開発サーバー起動（全機能）"
	@echo "   make dev-no-docker # Docker無しで開発（フロントエンドのみ）"
	@echo ""
	@echo "📋 利用可能なコマンド:"
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "   \033[36m%-15s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)
	@echo ""
	@echo "💡 Docker無し環境では 'make dev-no-docker' をご利用ください"

# 初回セットアップ
setup: ## 初回セットアップ（依存関係インストール + Docker起動 + DB初期化）
	@echo "🚀 初回セットアップを開始しています..."
	chmod +x scripts/dev-setup.sh
	./scripts/dev-setup.sh

# 開発サーバー起動
dev: ## 開発サーバー起動（フロントエンド + バックエンド + Docker）
	@echo "🚀 開発サーバーを起動しています..."
	chmod +x scripts/dev-start.sh
	./scripts/dev-start.sh full

dev-no-docker: ## Docker無しで開発サーバー起動（フロントエンド + バックエンドのみ）
	@echo "🚀 Docker無しで開発サーバーを起動しています..."
	npm run dev:no-docker

# 開発サーバー起動（アプリのみ）
dev-app: ## アプリケーションのみ起動（Docker起動済み前提）
	@echo "🚀 アプリケーションを起動しています..."
	chmod +x scripts/dev-start.sh
	./scripts/dev-start.sh app

# データベースのみ起動
dev-db: ## データベースサービスのみ起動
	@echo "🗄️ データベースサービスを起動しています..."
	chmod +x scripts/dev-start.sh
	./scripts/dev-start.sh db

# ビルド
build: ## 本番用ビルド
	@echo "🏗️ プロダクションビルドを実行しています..."
	npm run build

# フロントエンドのみビルド
build-frontend: ## フロントエンドのみビルド
	@echo "🏗️ フロントエンドをビルドしています..."
	npm run build:frontend

# バックエンドのみビルド
build-backend: ## バックエンドのみビルド
	@echo "🏗️ バックエンドをビルドしています..."
	npm run build:backend

# テスト実行
test: ## 全テスト実行
	@echo "🧪 テストを実行しています..."
	npm run test

# フロントエンドテスト
test-frontend: ## フロントエンドテストのみ実行
	@echo "🧪 フロントエンドテストを実行しています..."
	npm run test:frontend

# リント実行
lint: ## リント実行
	@echo "🔍 リントを実行しています..."
	npm run lint

# リント修正
lint-fix: ## リント自動修正
	@echo "🔧 リントを自動修正しています..."
	npm run lint:fix

# Docker関連
docker-up: ## Dockerサービス起動
	@echo "🐳 Dockerサービスを起動しています..."
	docker compose -f infra/docker/docker-compose.yml up -d

docker-down: ## Dockerサービス停止
	@echo "🐳 Dockerサービスを停止しています..."
	docker compose -f infra/docker/docker-compose.yml down

docker-logs: ## Dockerログ表示
	@echo "📋 Dockerログを表示しています..."
	docker compose -f infra/docker/docker-compose.yml logs -f

docker-reset: ## Docker完全リセット
	@echo "🐳 Dockerを完全リセットしています..."
	docker compose -f infra/docker/docker-compose.yml down -v
	docker compose -f infra/docker/docker-compose.yml up -d

# データベース関連
db-setup: ## データベースセットアップ
	@echo "🗄️ データベースをセットアップしています..."
	cd backend && npx prisma db push && npx prisma generate

db-seed: ## 初期データ投入
	@echo "🌱 初期データを投入しています..."
	npm run db:seed

db-reset: ## データベースリセット + 初期データ投入
	@echo "🔄 データベースをリセットしています..."
	chmod +x scripts/dev-start.sh
	./scripts/dev-start.sh reset

# クリーンアップ
clean: ## ビルドファイルと依存関係の削除
	@echo "🧹 クリーンアップを実行しています..."
	npm run clean

clean-deps: ## 依存関係のみ削除
	@echo "🧹 依存関係を削除しています..."
	npm run clean:deps

clean-build: ## ビルドファイルのみ削除
	@echo "🧹 ビルドファイルを削除しています..."
	npm run clean:build

# プロダクション
prod-build: ## プロダクション用Dockerビルド
	@echo "🏭 プロダクション用Dockerイメージをビルドしています..."
	docker compose -f infra/docker/docker-compose.yml --profile production build

prod-up: ## プロダクション環境起動
	@echo "🏭 プロダクション環境を起動しています..."
	docker compose -f infra/docker/docker-compose.yml --profile production up -d

# 便利なエイリアス
start: setup ## setupのエイリアス
run: dev ## devのエイリアス
server: dev-app ## dev-appのエイリアス 