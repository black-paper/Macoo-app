#!/bin/bash
set -e

# スクリプトのディレクトリに移動
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
INFRA_DIR="$PROJECT_ROOT/infra"

# 色付きログ出力
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# ヘルプメッセージ
show_help() {
    cat << EOF
Makeoo AWS デプロイスクリプト

使用方法:
    $0 [COMMAND] [STAGE]

コマンド:
    deploy          - AWSにデプロイ（デフォルト）
    remove          - AWSリソースを削除
    info            - デプロイ済みリソース情報を表示
    sync            - フロントエンドファイルをS3に同期
    invalidate      - CloudFrontキャッシュを無効化
    build           - フロントエンドのみビルド
    help            - このヘルプを表示

ステージ:
    dev             - 開発環境（デフォルト）
    prod            - 本番環境

例:
    $0 deploy dev   - 開発環境にデプロイ
    $0 deploy prod  - 本番環境にデプロイ
    $0 remove dev   - 開発環境のリソースを削除
    $0 info prod    - 本番環境の情報を表示

前提条件:
    - AWS CLI がインストール済み
    - AWS プロファイル 'shota' が設定済み
    - Node.js 18+ がインストール済み
    - serverless framework がインストール済み
EOF
}

# 前提条件チェック
check_prerequisites() {
    log_info "前提条件をチェック中..."

    # 環境変数の確認と設定
    if [ -z "$AWS_PROFILE" ]; then
        export AWS_PROFILE=shota
        log_warn "AWS_PROFILE が設定されていませんでした。デフォルト値 'shota' を設定しました"
    fi

    # AWS CLI
    if ! command -v aws &> /dev/null; then
        log_error "AWS CLI が見つかりません。インストールしてください。"
        exit 1
    fi

    # AWS プロファイル確認
    if ! aws configure list-profiles | grep -q "$AWS_PROFILE"; then
        log_error "AWS プロファイル '$AWS_PROFILE' が設定されていません。"
        log_error "以下のコマンドで設定してください:"
        echo "  aws configure --profile $AWS_PROFILE"
        exit 1
    fi

    # Node.js
    if ! command -v node &> /dev/null; then
        log_error "Node.js が見つかりません。インストールしてください。"
        exit 1
    fi

    # Serverless Framework
    if ! command -v sls &> /dev/null && ! command -v serverless &> /dev/null && ! npx sls --version &> /dev/null; then
        log_error "Serverless Framework が見つかりません。"
        log_error "以下のコマンドでインストールしてください:"
        echo "  npm install -g serverless"
        echo "または infra ディレクトリで:"
        echo "  cd infra && npm install"
        exit 1
    fi

    # フロントエンドの依存関係
    if [ ! -d "$PROJECT_ROOT/frontend/node_modules" ]; then
        log_warn "フロントエンドの依存関係がインストールされていません。"
        log_info "依存関係をインストール中..."
        cd "$PROJECT_ROOT/frontend"
        npm install
    fi

    # インフラの依存関係
    if [ ! -d "$INFRA_DIR/node_modules" ]; then
        log_warn "インフラの依存関係がインストールされていません。"
        log_info "依存関係をインストール中..."
        cd "$INFRA_DIR"
        npm install
    fi

    log_info "前提条件チェック完了"
}

# フロントエンドビルド
build_frontend() {
    log_info "フロントエンドをビルド中..."
    cd "$PROJECT_ROOT/frontend"
    
    if [ ! -f "package.json" ]; then
        log_error "frontend/package.json が見つかりません。"
        exit 1
    fi

    npm run build
    
    if [ ! -d "dist" ]; then
        log_error "ビルドに失敗しました。dist フォルダが作成されていません。"
        exit 1
    fi

    log_info "フロントエンドビルド完了"
}

# デプロイ実行
deploy() {
    local stage=${1:-dev}
    
    log_info "AWS に ${stage} 環境をデプロイ中..."
    cd "$INFRA_DIR"
    
    # フロントエンドビルド
    build_frontend
    
    # タイムスタンプ生成（バケット名の一意性確保）
    TIMESTAMP=$(date +%Y%m%d%H%M%S)
    
    # Serverless Framework コマンドの決定（infraディレクトリで実行）
    cd "$INFRA_DIR"
    if command -v sls &> /dev/null; then
        SLS_CMD="sls"
    elif command -v serverless &> /dev/null; then
        SLS_CMD="serverless"
    else
        SLS_CMD="npx --yes sls"
    fi
    
    # フロントエンドビルドも含めてデプロイ
    log_info "Serverless Framework を使用してデプロイ中... ($SLS_CMD)"
    
    if [ "$stage" = "dev" ]; then
        $SLS_CMD deploy --stage dev --verbose
    elif [ "$stage" = "prod" ]; then  
        $SLS_CMD deploy --stage prod --verbose
    else
        $SLS_CMD deploy --stage "$stage" --verbose
    fi
    
    log_info "デプロイ完了!"
    log_info "以下のコマンドで詳細情報を確認できます:"
    echo "  $0 info $stage"
}

# リソース削除
remove() {
    local stage=${1:-dev}
    
    log_warn "AWS の ${stage} 環境リソースを削除しますか？"
    log_warn "この操作は元に戻せません。"
    read -p "続行しますか？ (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        log_info "削除をキャンセルしました。"
        exit 0
    fi
    
    log_info "AWS リソースを削除中..."
    cd "$INFRA_DIR"
    
    if [ "$stage" = "dev" ]; then
        npm run remove:dev
    elif [ "$stage" = "prod" ]; then
        npm run remove:prod
    else
        npm run remove -- --stage "$stage"
    fi
    
    log_info "削除完了!"
}

# 情報表示
info() {
    local stage=${1:-dev}
    
    log_info "${stage} 環境の情報を取得中..."
    cd "$INFRA_DIR"
    
    sls info --stage "$stage" --verbose
}

# S3同期
sync_s3() {
    local stage=${1:-dev}
    
    log_info "S3 に静的ファイルを同期中..."
    cd "$INFRA_DIR"
    
    # フロントエンドビルド
    build_frontend
    
    # S3同期
    sls s3sync --stage "$stage"
    
    log_info "S3同期完了!"
}

# CloudFrontキャッシュ無効化
invalidate_cloudfront() {
    local stage=${1:-dev}
    
    log_info "CloudFront キャッシュを無効化中..."
    cd "$INFRA_DIR"
    
    sls cloudfrontInvalidate --stage "$stage"
    
    log_info "キャッシュ無効化完了!"
}

# メイン処理
main() {
    local command=${1:-deploy}
    local stage=${2:-dev}
    
    case $command in
        deploy)
            check_prerequisites
            deploy "$stage"
            ;;
        remove)
            check_prerequisites
            remove "$stage"
            ;;
        info)
            check_prerequisites
            info "$stage"
            ;;
        sync)
            check_prerequisites
            sync_s3 "$stage"
            ;;
        invalidate)
            check_prerequisites
            invalidate_cloudfront "$stage"
            ;;
        build)
            build_frontend
            ;;
        help|--help|-h)
            show_help
            ;;
        *)
            log_error "不明なコマンド: $command"
            show_help
            exit 1
            ;;
    esac
}

# スクリプト実行
main "$@"