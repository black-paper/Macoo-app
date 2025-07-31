#!/bin/bash
# 環境変数の自動読み込みスクリプト
# 使用方法: source scripts/load-env.sh

# .env ファイルが存在する場合は読み込み
if [ -f .env ]; then
    set -a  # 自動エクスポートを有効化
    source .env
    set +a  # 自動エクスポートを無効化
    echo "✅ .env ファイルから環境変数を読み込みました"
fi

# AWS プロファイルの設定確認
if [ -z "$AWS_PROFILE" ]; then
    export AWS_PROFILE=shota
    echo "⚠️  AWS_PROFILE が設定されていませんでした。デフォルト値 'shota' を設定しました"
else
    echo "✅ AWS_PROFILE: $AWS_PROFILE"
fi

# AWS リージョンの設定確認
if [ -z "$AWS_REGION" ]; then
    export AWS_REGION=ap-northeast-1
    echo "⚠️  AWS_REGION が設定されていませんでした。デフォルト値 'ap-northeast-1' を設定しました"
else
    echo "✅ AWS_REGION: $AWS_REGION"
fi

echo ""
echo "🌱 Makeoo 開発環境の環境変数設定完了"
echo "利用可能なコマンド:"
echo "  npm run aws:deploy:dev  - 開発環境にデプロイ"
echo "  npm run aws:deploy:prod - 本番環境にデプロイ"
echo "  npm run aws:info        - デプロイ情報表示"
echo ""