#!/bin/bash
# DevContainer用AWS設定セットアップスクリプト

set -e

# 色付きログ出力
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

# AWS設定ディレクトリの準備
setup_aws_directories() {
    log_step "1. AWS設定ディレクトリを準備中..."
    
    # 書き込み可能なAWS設定ディレクトリを作成
    mkdir -p /home/vscode/.aws-writable
    chmod 755 /home/vscode/.aws-writable
    
    # 環境変数でAWS設定ファイルの場所を指定
    export AWS_CONFIG_FILE="/home/vscode/.aws-writable/config"
    export AWS_SHARED_CREDENTIALS_FILE="/home/vscode/.aws-writable/credentials"
    
    log_info "書き込み可能なAWS設定ディレクトリを作成しました: /home/vscode/.aws-writable"
}

# AWS認証情報の設定
setup_aws_credentials() {
    log_step "2. AWS認証情報を設定中..."
    
    # 対話式でAWS認証情報を設定
    echo "AWS認証情報を設定します。"
    echo "以下の情報を入力してください："
    echo ""
    
    read -p "AWS Access Key ID: " AWS_ACCESS_KEY_ID
    read -s -p "AWS Secret Access Key: " AWS_SECRET_ACCESS_KEY
    echo ""
    read -p "Default region name [ap-northeast-1]: " AWS_REGION
    AWS_REGION=${AWS_REGION:-ap-northeast-1}
    
    # credentials ファイルの作成
    cat > "$AWS_SHARED_CREDENTIALS_FILE" << EOF
[shota]
aws_access_key_id = $AWS_ACCESS_KEY_ID
aws_secret_access_key = $AWS_SECRET_ACCESS_KEY
EOF

    # config ファイルの作成
    cat > "$AWS_CONFIG_FILE" << EOF
[profile shota]
region = $AWS_REGION
output = json
EOF

    chmod 600 "$AWS_SHARED_CREDENTIALS_FILE"
    chmod 600 "$AWS_CONFIG_FILE"
    
    log_info "AWS認証情報を設定しました"
}

# 環境変数の設定
setup_environment() {
    log_step "3. 環境変数を設定中..."
    
    # .bashrc に環境変数を追加
    if ! grep -q "AWS_CONFIG_FILE" ~/.bashrc; then
        echo "" >> ~/.bashrc
        echo "# AWS DevContainer設定" >> ~/.bashrc
        echo "export AWS_CONFIG_FILE=/home/vscode/.aws-writable/config" >> ~/.bashrc
        echo "export AWS_SHARED_CREDENTIALS_FILE=/home/vscode/.aws-writable/credentials" >> ~/.bashrc
        echo "export AWS_PROFILE=shota" >> ~/.bashrc
        echo "export AWS_REGION=ap-northeast-1" >> ~/.bashrc
        
        log_info "~/.bashrc に環境変数を追加しました"
    else
        log_info "環境変数は既に設定済みです"
    fi
    
    # プロジェクトの.env ファイルを更新
    if [ -f /workspace/.env ]; then
        if ! grep -q "AWS_CONFIG_FILE" /workspace/.env; then
            echo "" >> /workspace/.env
            echo "# DevContainer AWS設定" >> /workspace/.env
            echo "AWS_CONFIG_FILE=/home/vscode/.aws-writable/config" >> /workspace/.env
            echo "AWS_SHARED_CREDENTIALS_FILE=/home/vscode/.aws-writable/credentials" >> /workspace/.env
        fi
        log_info "プロジェクト .env ファイルを更新しました"
    fi
}

# 設定テスト
test_aws_setup() {
    log_step "4. AWS設定をテスト中..."
    
    # 環境変数を現在のセッションに適用
    export AWS_CONFIG_FILE="/home/vscode/.aws-writable/config"
    export AWS_SHARED_CREDENTIALS_FILE="/home/vscode/.aws-writable/credentials"
    export AWS_PROFILE=shota
    
    # プロファイル一覧表示
    if aws configure list-profiles | grep -q "shota"; then
        log_info "✅ AWS プロファイル 'shota' が正常に設定されました"
    else
        log_error "❌ AWS プロファイル設定に問題があります"
        return 1
    fi
    
    # 認証情報テスト
    if aws sts get-caller-identity --profile shota >/dev/null 2>&1; then
        log_info "✅ AWS認証が正常に動作しています"
        aws sts get-caller-identity --profile shota
    else
        log_warn "⚠️  AWS認証のテストに失敗しました（認証情報を確認してください）"
    fi
}

# メイン処理
main() {
    echo "🌱 Makeoo DevContainer AWS セットアップ"
    echo "========================================"
    echo ""
    
    setup_aws_directories
    setup_aws_credentials
    setup_environment
    test_aws_setup
    
    echo ""
    log_info "🎉 AWS設定が完了しました！"
    echo ""
    echo "次のステップ:"
    echo "1. 新しいターミナルを開いて環境変数を反映してください"
    echo "2. 以下のコマンドでデプロイをテストしてください:"
    echo "   npm run aws:deploy:dev"
    echo ""
}

# スクリプト実行
main "$@"