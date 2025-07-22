#!/bin/bash

# Makeoo 開発サーバー起動スクリプト
# バックエンド（FastAPI）とフロントエンド（Vite）を並行起動

set -e  # エラー時に停止

echo "🚀 Makeoo 開発サーバーを起動します..."

# 環境変数の読み込み
if [ -f "/workspace/.env" ]; then
    export $(cat /workspace/.env | grep -v '^#' | xargs)
    echo "✅ 環境変数を読み込みました"
else
    echo "⚠️  .env ファイルが見つかりません。.env.example をコピーして作成してください"
    exit 1
fi

# 依存関係の確認とインストール
echo "📦 依存関係を確認中..."

# Backend依存関係
if [ -f "/workspace/backend/requirements.txt" ]; then
    cd /workspace/backend
    echo "🐍 Python依存関係をインストール中..."
    pip install -r requirements.txt
    cd /workspace
fi

# Frontend依存関係  
if [ -f "/workspace/frontend/package.json" ]; then
    cd /workspace/frontend
    echo "📦 Node.js依存関係をインストール中..."
    npm install
    cd /workspace
fi

# データベース接続テスト
echo "🗄️  データベース接続をテスト中..."
until mysql -h mysql -u dev -pdevpassword -e "SELECT 1" > /dev/null 2>&1; do
  echo "MySQL接続を待機中..."
  sleep 2
done
echo "✅ データベース接続OK"

# ログディレクトリの作成
mkdir -p /workspace/logs

# PIDファイルのクリーンアップ
cleanup() {
    echo ""
    echo "🛑 開発サーバーを停止中..."
    if [ -f "/workspace/logs/backend.pid" ]; then
        kill $(cat /workspace/logs/backend.pid) 2>/dev/null || true
        rm -f /workspace/logs/backend.pid
    fi
    if [ -f "/workspace/logs/frontend.pid" ]; then
        kill $(cat /workspace/logs/frontend.pid) 2>/dev/null || true
        rm -f /workspace/logs/frontend.pid
    fi
    echo "👋 開発サーバーを停止しました"
    exit 0
}

# Ctrl+C時のクリーンアップ
trap cleanup INT TERM

echo ""
echo "🎯 サーバー起動中..."

# バックエンドサーバー起動（FastAPI）
if [ -f "/workspace/backend/handlers/app.py" ]; then
    cd /workspace/backend
    echo "🐍 FastAPI サーバーを起動中... (http://localhost:8000)"
    nohup uvicorn handlers.app:app --reload --host 0.0.0.0 --port 8000 \
        > /workspace/logs/backend.log 2>&1 &
    echo $! > /workspace/logs/backend.pid
    cd /workspace
else
    echo "⚠️  backend/handlers/app.py が見つかりません。バックエンドの初期実装を作成してください"
fi

# 少し待機
sleep 2

# フロントエンドサーバー起動（Vite）
if [ -f "/workspace/frontend/package.json" ]; then
    cd /workspace/frontend
    echo "⚛️  Vite開発サーバーを起動中... (http://localhost:3000)"
    nohup npm run dev -- --host 0.0.0.0 --port 3000 \
        > /workspace/logs/frontend.log 2>&1 &
    echo $! > /workspace/logs/frontend.pid
    cd /workspace
else
    echo "⚠️  frontend/package.json が見つかりません。フロントエンドの初期実装を作成してください"
fi

echo ""
echo "🌟 開発サーバーが起動しました！"
echo ""
echo "📊 アクセス情報:"
echo "  🌐 フロントエンド: http://localhost:3000"
echo "  🔧 バックエンドAPI: http://localhost:8000"
echo "  📚 API ドキュメント: http://localhost:8000/docs"
echo "  🗄️  データベース: mysql://localhost:3306/makeoo_dev"
echo ""
echo "📋 便利なコマンド:"
echo "  📖 ログ確認:"
echo "    - tail -f /workspace/logs/backend.log   # バックエンドログ"
echo "    - tail -f /workspace/logs/frontend.log  # フロントエンドログ"
echo "  🔧 開発ツール:"
echo "    - mysql -h mysql -u dev -pdevpassword makeoo_dev  # DB接続"
echo "    - pytest backend/tests/                           # テスト実行"
echo ""
echo "⚠️  注意: Ctrl+C で両方のサーバーを停止します"
echo ""

# サーバーの起動確認
sleep 5

# バックエンドヘルスチェック
if curl -s http://localhost:8000/health > /dev/null 2>&1; then
    echo "✅ バックエンド (FastAPI) が正常に起動しました"
else
    echo "⚠️  バックエンドの起動を確認できませんでした。ログを確認してください:"
    echo "    tail -f /workspace/logs/backend.log"
fi

# フロントエンドヘルスチェック
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ フロントエンド (Vite) が正常に起動しました"  
else
    echo "⚠️  フロントエンドの起動を確認できませんでした。ログを確認してください:"
    echo "    tail -f /workspace/logs/frontend.log"
fi

echo ""
echo "🚀 開発を開始してください！Ctrl+C で停止します。"

# 無限ループでプロセス監視
while true; do
    sleep 30
    
    # プロセスが生きているかチェック
    if [ -f "/workspace/logs/backend.pid" ]; then
        if ! kill -0 $(cat /workspace/logs/backend.pid) 2>/dev/null; then
            echo "⚠️  バックエンドプロセスが停止しました"
            rm -f /workspace/logs/backend.pid
        fi
    fi
    
    if [ -f "/workspace/logs/frontend.pid" ]; then
        if ! kill -0 $(cat /workspace/logs/frontend.pid) 2>/dev/null; then
            echo "⚠️  フロントエンドプロセスが停止しました"  
            rm -f /workspace/logs/frontend.pid
        fi
    fi
done 