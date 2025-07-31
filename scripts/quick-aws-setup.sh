#!/bin/bash
# DevContainer用AWS簡易設定スクリプト

set -e

# AWS設定ディレクトリ準備
mkdir -p ~/.aws-writable

# 環境変数設定（現在のセッション用）
export AWS_CONFIG_FILE=~/.aws-writable/config
export AWS_SHARED_CREDENTIALS_FILE=~/.aws-writable/credentials
export AWS_PROFILE=shota
export AWS_REGION=ap-northeast-1

# 環境変数を.bashrcに追加（永続化）
if ! grep -q "AWS_CONFIG_FILE" ~/.bashrc; then
    echo "" >> ~/.bashrc
    echo "# AWS DevContainer設定" >> ~/.bashrc
    echo "export AWS_CONFIG_FILE=~/.aws-writable/config" >> ~/.bashrc
    echo "export AWS_SHARED_CREDENTIALS_FILE=~/.aws-writable/credentials" >> ~/.bashrc
    echo "export AWS_PROFILE=shota" >> ~/.bashrc
    echo "export AWS_REGION=ap-northeast-1" >> ~/.bashrc
fi

echo "✅ AWS環境変数が設定されました"
echo ""
echo "🔧 次のステップ："
echo "1. 新しいターミナルを開いて環境変数を反映"
echo "2. 以下の方法でAWS認証情報を設定："
echo ""
echo "方法A: 手動設定"
echo "cat > ~/.aws-writable/credentials << EOF"
echo "[shota]"
echo "aws_access_key_id = YOUR_ACCESS_KEY"
echo "aws_secret_access_key = YOUR_SECRET_KEY"
echo "EOF"
echo ""
echo "cat > ~/.aws-writable/config << EOF"
echo "[profile shota]"
echo "region = ap-northeast-1"
echo "output = json"
echo "EOF"
echo ""
echo "方法B: 対話的設定"
echo "./scripts/setup-aws-devcontainer.sh"
echo ""
echo "chmod 600 ~/.aws-writable/credentials ~/.aws-writable/config"
echo ""
echo "3. テスト実行："
echo "npm run aws:deploy:dev"