#!/bin/bash

echo "🌱 Makeoo 開発環境をセットアップ中..."

# Node.js 依存関係のインストール
echo "📦 依存関係をインストール中..."
npm install

# フロントエンドとバックエンドの依存関係をインストール
cd frontend && npm install && cd ..
cd backend && npm install && cd ..

# AWS設定ディレクトリの準備（DevContainer用）
echo "🌥️  AWS設定ディレクトリを準備中..."
mkdir -p /home/vscode/.aws-writable
chmod 755 /home/vscode/.aws-writable

# 環境変数を .bashrc に追加
if ! grep -q "AWS_CONFIG_FILE" ~/.bashrc; then
    echo "" >> ~/.bashrc
    echo "# AWS DevContainer設定" >> ~/.bashrc
    echo "export AWS_CONFIG_FILE=/home/vscode/.aws-writable/config" >> ~/.bashrc
    echo "export AWS_SHARED_CREDENTIALS_FILE=/home/vscode/.aws-writable/credentials" >> ~/.bashrc
    echo "export AWS_PROFILE=shota" >> ~/.bashrc
    echo "export AWS_REGION=ap-northeast-1" >> ~/.bashrc
fi

echo "✅ セットアップ完了！"
echo ""
echo "🔧 AWS認証情報を設定するには:"
echo "   ./scripts/setup-aws-devcontainer.sh"
echo ""