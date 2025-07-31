#!/bin/bash
set -e

# MakeooプロジェクトのAWS簡易デプロイスクリプト
# 使用方法: ./scripts/aws-deploy.sh [dev|prod]

# スクリプトのディレクトリに移動
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# 色付きログ出力
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

# 環境設定
STAGE=${1:-dev}

log_info "🚀 Makeoo フロントエンドを AWS ${STAGE} 環境にデプロイします"
echo

# Step 1: インフラディレクトリの依存関係確認
log_step "1. インフラ環境をセットアップ中..."
cd "$PROJECT_ROOT/infra"

if [ ! -d "node_modules" ]; then
    log_info "Serverless Framework の依存関係をインストール中..."
    npm install
else
    log_info "依存関係は既にインストール済みです"
fi

# Step 2: デプロイスクリプト実行
log_step "2. AWS にデプロイ中..."
echo

# infraディレクトリのデプロイスクリプトを呼び出し
./scripts/deploy.sh deploy "$STAGE"

log_info "✅ デプロイが完了しました！"
echo

# Step 3: 次のステップの案内
log_step "3. 次のステップ"
echo "以下のコマンドでデプロイ情報を確認できます："
echo "  cd infra && ./scripts/deploy.sh info $STAGE"
echo
echo "ファイルを更新した場合の同期："
echo "  cd infra && ./scripts/deploy.sh sync $STAGE"
echo
echo "CloudFrontキャッシュのクリア："
echo "  cd infra && ./scripts/deploy.sh invalidate $STAGE"
echo
echo "詳細な操作方法は infra/README.md を参照してください"