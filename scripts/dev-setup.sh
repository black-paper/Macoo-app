#!/bin/bash

# 🚀 Makeoo ローカル開発環境セットアップスクリプト
# Usage: ./scripts/dev-setup.sh

set -e  # エラー時に停止

echo "🌱 Makeoo ローカル開発環境をセットアップしています..."

# 色付きメッセージ用の関数
print_step() {
    echo -e "\n\033[1;34m📋 $1\033[0m"
}

print_success() {
    echo -e "\033[1;32m✅ $1\033[0m"
}

print_error() {
    echo -e "\033[1;31m❌ $1\033[0m"
}

print_warning() {
    echo -e "\033[1;33m⚠️  $1\033[0m"
}

# 前提条件チェック
print_step "前提条件をチェックしています..."

# Node.js バージョンチェック
if command -v node >/dev/null 2>&1; then
    NODE_VERSION=$(node --version | sed 's/v//')
    REQUIRED_VERSION="18.0.0"
    if [ "$(printf '%s\n' "$REQUIRED_VERSION" "$NODE_VERSION" | sort -V | head -n1)" = "$REQUIRED_VERSION" ]; then
        print_success "Node.js $NODE_VERSION が検出されました"
    else
        print_error "Node.js $REQUIRED_VERSION 以上が必要です（現在: $NODE_VERSION）"
        exit 1
    fi
else
    print_error "Node.js がインストールされていません"
    exit 1
fi

# Docker チェック
if command -v docker >/dev/null 2>&1; then
    print_success "Docker が検出されました"
else
    print_warning "Docker が見つかりません - データベース関連の機能は制限されます"
fi

# Docker Compose チェック
if command -v docker-compose >/dev/null 2>&1; then
    print_success "Docker Compose が検出されました"
elif docker compose version >/dev/null 2>&1; then
    print_success "Docker Compose (新バージョン) が検出されました"
    alias docker-compose='docker compose'
else
    print_warning "Docker Compose が見つかりません"
fi

# 依存関係インストール
print_step "依存関係をインストールしています..."
npm install
print_success "依存関係のインストール完了"

# Docker サービス起動
if command -v docker >/dev/null 2>&1; then
    print_step "Docker サービスを起動しています..."
    docker compose -f infra/docker/docker-compose.yml up -d mysql redis phpmyadmin adminer redis-commander
    
    print_step "データベースの起動を待機しています..."
    sleep 15
    
    # データベースセットアップ
    print_step "データベースをセットアップしています..."
    cd backend
    npx prisma db push --force-reset
    npx prisma generate
    
    # 初期データ投入
    print_step "初期データを投入しています..."
    npm run db:seed
    cd ..
    
    print_success "データベースセットアップ完了"
else
    print_warning "Docker が利用できないため、データベース設定をスキップします"
fi

# 設定ファイル確認
print_step "設定ファイルを確認しています..."

# Backend .env
if [ ! -f "backend/.env" ]; then
    print_step "backend/.env ファイルを作成しています..."
    cat > backend/.env << EOF
# Database
DATABASE_URL="mysql://makeoo_user:makeoo_password_2025@localhost:3306/makeoo_db"

# Redis
REDIS_URL="redis://localhost:6379"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="7d"

# Server
PORT=3001
NODE_ENV="development"

# File Upload
UPLOAD_MAX_SIZE="10485760"
UPLOAD_PATH="./uploads"

# Rate Limiting
RATE_LIMIT_WINDOW_MS="900000"
RATE_LIMIT_MAX_REQUESTS="100"
EOF
    print_success "backend/.env ファイルを作成しました"
else
    print_success "backend/.env ファイルが存在します"
fi

# Frontend .env (必要に応じて)
if [ ! -f "frontend/.env" ]; then
    cat > frontend/.env << EOF
VITE_API_BASE_URL="http://localhost:3001"
VITE_APP_NAME="Makeoo"
EOF
    print_success "frontend/.env ファイルを作成しました"
fi

print_step "セットアップが完了しました！"
echo ""
echo "🚀 開発サーバーを起動するには:"
echo "   npm run dev"
echo ""
echo "📊 利用可能なサービス:"
echo "   • フロントエンド: http://localhost:5173"
echo "   • バックエンドAPI: http://localhost:3001"
echo "   • phpMyAdmin: http://localhost:8080"
echo "   • Adminer: http://localhost:8081"
echo "   • Redis Commander: http://localhost:8082"
echo ""
echo "🔧 その他の便利なコマンド:"
echo "   npm run docker:logs    # Docker ログ表示"
echo "   npm run db:reset       # データベースリセット"
echo "   npm run test           # テスト実行"
echo "   npm run lint           # リント実行"
echo ""
print_success "Happy coding! 🎉" 