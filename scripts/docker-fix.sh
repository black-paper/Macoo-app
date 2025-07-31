#!/bin/bash
# 🐳 WSL環境でのDocker権限問題解決スクリプト

set -e

print_info() {
    echo "ℹ️  $1"
}

print_success() {
    echo "✅ $1"
}

print_warning() {
    echo "⚠️  $1"
}

print_error() {
    echo "❌ $1"
}

echo "🐳 WSL環境でのDocker権限問題を修正しています..."
echo ""

# 1. Dockerプロセス停止
print_info "既存のDockerプロセスを停止しています..."
sudo pkill dockerd 2>/dev/null || true
sudo pkill docker-containerd 2>/dev/null || true

# 2. Docker権限設定
print_info "Docker権限を設定しています..."
sudo chmod 666 /var/run/docker.sock 2>/dev/null || true

# 3. ユーザーグループ確認
print_info "ユーザーグループを確認しています..."
groups | grep -q docker && print_success "dockerグループに参加済み" || print_warning "dockerグループ参加が必要"

# 4. Docker再起動
print_info "Dockerデーモンを再起動しています..."
sudo dockerd --iptables=false --bridge=none --host=unix:///var/run/docker.sock --host tcp://0.0.0.0:2375 &

# 5. 起動待機
print_info "Docker起動を待機しています..."
sleep 5

# 6. 起動確認
if docker info > /dev/null 2>&1; then
    print_success "Docker正常起動完了！"
    echo ""
    echo "🎉 完全な開発環境をセットアップできます："
    echo "   npm run setup"
    echo "   npm run dev"
else
    print_error "Docker起動に失敗しました"
    echo ""
    echo "💡 代替案："
    echo "   npm run dev:no-docker  # モックデータ使用"
    echo "   または Docker Desktopの使用を検討してください"
fi

echo ""
echo "🏁 スクリプト実行完了" 