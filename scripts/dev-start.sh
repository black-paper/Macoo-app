#!/bin/bash

# 🚀 Makeoo 開発サーバー起動スクリプト
# Usage: ./scripts/dev-start.sh [option]
#
# Options:
#   full    - 全サービス起動（デフォルト）
#   db      - データベースのみ起動
#   app     - アプリケーションのみ起動
#   reset   - データベースリセット + 全サービス起動

set -e

# カラー出力用関数
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# 引数処理
OPTION=${1:-full}

print_info "Makeoo 開発環境を起動しています（オプション: $OPTION）"

case $OPTION in
    "db")
        print_info "データベースサービスのみを起動しています..."
        docker compose -f infra/docker/docker-compose.yml up -d mysql redis phpmyadmin adminer redis-commander
        print_success "データベースサービスが起動しました"
        echo ""
        echo "📊 利用可能なサービス:"
        echo "   • phpMyAdmin: http://localhost:8080"
        echo "   • Adminer: http://localhost:8081"
        echo "   • Redis Commander: http://localhost:8082"
        ;;
    
    "app")
        print_info "アプリケーションのみを起動しています..."
        echo "フロントエンド: http://localhost:5173"
        echo "バックエンド: http://localhost:3001"
        echo ""
        npm run dev:backend &
        npm run dev:frontend
        ;;
    
    "reset")
        print_warning "データベースをリセットしています..."
        docker compose -f infra/docker/docker-compose.yml down -v
        docker compose -f infra/docker/docker-compose.yml up -d mysql redis
        
        print_info "データベースの準備を待機しています..."
        sleep 15
        
        cd backend
        npx prisma db push --force-reset
        npx prisma generate
        npm run db:seed
        cd ..
        
        print_success "データベースリセット完了"
        
        print_info "全サービスを起動しています..."
        docker compose -f infra/docker/docker-compose.yml up -d phpmyadmin adminer redis-commander
        npm run dev:backend &
        npm run dev:frontend
        ;;
    
    "full"|*)
        print_info "全サービスを起動しています..."
        
        # Dockerサービス起動
        docker compose -f infra/docker/docker-compose.yml up -d mysql redis phpmyadmin adminer redis-commander
        
        print_info "データベースの準備を待機しています..."
        sleep 10
        
        # 開発サーバー起動
        print_success "開発サーバーを起動しています..."
        echo ""
        echo "📊 利用可能なサービス:"
        echo "   • フロントエンド: http://localhost:5173"
        echo "   • バックエンドAPI: http://localhost:3001"
        echo "   • phpMyAdmin: http://localhost:8080"
        echo "   • Adminer: http://localhost:8081"
        echo "   • Redis Commander: http://localhost:8082"
        echo ""
        echo "🛑 終了するには Ctrl+C を押してください"
        echo ""
        
        # concurrentlyがインストールされている場合は並行実行
        if command -v npx >/dev/null 2>&1 && npm list concurrently >/dev/null 2>&1; then
            npx concurrently \
                --names "BACKEND,FRONTEND" \
                --prefix-colors "blue,green" \
                "npm run dev:backend" \
                "npm run dev:frontend"
        else
            # concurrentlyがない場合は順次実行
            npm run dev:backend &
            npm run dev:frontend
        fi
        ;;
esac 