#!/bin/bash

echo "🚀 Makeoo DevContainer 初期化を開始します..."

# Node.js環境確認とnpm設定
echo "📦 Node.js 環境を設定中..."
# featuresでインストールされたNode.jsを使用
if command -v node &> /dev/null; then
    echo "✅ Node.js $(node -v) が利用可能です"
    npm config set prefix ~/.npm-global
    echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
else
    echo "⚠️  Node.jsが見つかりません"
fi

# Pythonパス設定
echo "🐍 Python 環境を設定中..."
echo 'export PYTHONPATH=/workspace/backend:$PYTHONPATH' >> ~/.bashrc

# Git設定（プロジェクト固有）
echo "🔧 Git設定を初期化中..."
git config --global init.defaultBranch main
git config --global core.autocrlf input

# 環境変数ファイルのコピー
echo "⚙️  環境変数ファイルを作成中..."
if [ ! -f "/workspace/.env" ]; then
    if [ -f "/workspace/.env.example" ]; then
        cp /workspace/.env.example /workspace/.env
        echo "✅ .env ファイルを .env.example からコピーしました"
    fi
fi

# backend用requirements.txtがある場合のインストール
if [ -f "/workspace/backend/requirements.txt" ]; then
    echo "📚 Backend依存関係をインストール中..."
    cd /workspace/backend && pip install -r requirements.txt
fi

# frontend用package.jsonがある場合のインストール
if [ -f "/workspace/frontend/package.json" ]; then
    echo "📦 Frontend依存関係をインストール中..."
    cd /workspace/frontend && npm install
fi

# プロジェクトディレクトリの作成（存在しない場合）
echo "📁 プロジェクト構造を確認中..."
mkdir -p /workspace/backend/{handlers,routers,services,models,repositories,utils,db,tests/{unit,integration}}
mkdir -p /workspace/frontend/src/{components/{common,recipe,layout},hooks,services,utils,pages,store,styles,types,assets,tests/{unit,integration}}
mkdir -p /workspace/infra/{config,scripts,templates}
mkdir -p /workspace/tests/e2e/specs

# 便利なエイリアスの追加
echo "🔗 便利なエイリアスを追加中..."
cat >> ~/.bashrc << 'EOF'

# Makeoo プロジェクト用エイリアス
alias be='cd /workspace/backend'
alias fe='cd /workspace/frontend'
alias inf='cd /workspace/infra'
alias dev-start='/workspace/scripts/dev-start.sh'
alias test-all='cd /workspace && python -m pytest backend/tests/ && cd frontend && npm test'
alias lint='cd /workspace/backend && flake8 . && black --check . && cd /workspace/frontend && npm run lint'
alias fix='cd /workspace/backend && black . && cd /workspace/frontend && npm run lint:fix'

# よく使うコマンドのショートカット
alias ll='ls -alF'
alias la='ls -A'
alias l='ls -CF'
alias ..='cd ..'
alias ...='cd ../..'
alias grep='grep --color=auto'
alias python='python3'
alias pip='pip3'

EOF

# データベース接続テスト用の待機
echo "🗄️  データベース接続待機中..."
until mysql -h mysql -u dev -pdevpassword -e "SELECT 1" > /dev/null 2>&1; do
  echo "MySQL接続を待機中..."
  sleep 2
done

echo "✅ MySQL接続が確認できました"

# 開発用スクリプトの実行権限設定
if [ -f "/workspace/scripts/dev-start.sh" ]; then
    chmod +x /workspace/scripts/dev-start.sh
fi

echo ""
echo "🎉 Makeoo DevContainer の初期化が完了しました！"
echo ""
echo "📋 次のステップ:"
echo "  1. 環境変数を確認・編集: .env ファイル"
echo "  2. 開発サーバー起動: dev-start コマンド"
echo "  3. バックエンド: be コマンドでbackendディレクトリへ移動"
echo "  4. フロントエンド: fe コマンドでfrontendディレクトリへ移動"
echo ""
echo "🔧 便利なコマンド:"
echo "  - dev-start: 開発サーバー起動"
echo "  - test-all: 全テスト実行"
echo "  - lint: コード品質チェック"
echo "  - fix: コード自動修正"
echo "" 