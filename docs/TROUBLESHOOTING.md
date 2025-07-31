# 🔧 Makeoo トラブルシューティングガイド

このガイドでは、Makeoo 開発環境で発生する可能性のある問題と解決方法を説明します。

## 🐳 Docker 関連の問題

### 問題 1: `docker-compose: command not found`

**原因**: 新しい Docker バージョンでは `docker compose` (ハイフンなし) を使用する

**解決方法**:

```bash
# 確認
docker --version
docker compose version

# 正常な場合、この出力が表示される：
# Docker version 28.x.x
# Docker Compose version v2.x.x
```

### 問題 2: `Cannot connect to the Docker daemon`

**原因**: Docker デーモンが起動していない

**解決方法**:

```bash
# WSL環境での解決
./scripts/docker-fix.sh

# または手動で修正
sudo service docker start
sudo dockerd --iptables=false --bridge=none &
```

### 問題 3: `unshare: operation not permitted`

**原因**: WSL 環境での権限問題

**解決方法**:

```bash
# 権限修正スクリプト実行
./scripts/docker-fix.sh

# または Docker Desktop を使用
# https://www.docker.com/products/docker-desktop/
```

## 📦 依存関係の問題

### 問題 1: `npm install` エラー

**解決方法**:

```bash
# キャッシュクリア
npm cache clean --force

# node_modules削除
npm run clean:deps

# 再インストール
npm install
```

### 問題 2: `Node.js version` 警告

**解決方法**:

```bash
# Node.js バージョン確認
node --version

# 推奨: Node.js 18.x または 20.x
# nvm使用の場合
nvm use 18
```

## 🔌 サーバー起動の問題

### 問題 1: `Port already in use`

**解決方法**:

```bash
# 使用中プロセス確認・終了
sudo lsof -ti:5173 -ti:3001 | xargs kill -9

# または
pkill -f "npm run dev"
pkill -f "vite"
pkill -f "tsx"
```

### 問題 2: `DATABASE_URL not found`

**解決方法**:

```bash
# 環境変数ファイル確認
ls -la backend/.env

# なければ作成
cat > backend/.env << 'EOF'
DATABASE_URL="mysql://makeoo_user:makeoo_password_2025@localhost:3306/makeoo_db"
NODE_ENV="development"
PORT=3001
EOF
```

## 🌐 ブラウザアクセスの問題

### 問題 1: フロントエンドに接続できない

**確認手順**:

```bash
# サーバー状況確認
curl http://localhost:5173
curl http://localhost:3001

# プロセス確認
ps aux | grep -E "(vite|npm|node)"
```

**解決方法**:

```bash
# 開発サーバー再起動
npm run dev:no-docker
```

### 問題 2: データが表示されない

**現在の状況**:

- ✅ **モックデータモード**: サンプルデータが表示される
- ❌ **実データ**: データベース接続が必要

**完全なデータ表示のために**:

```bash
# Docker環境が正常な場合
npm run setup
npm run dev

# Docker環境に問題がある場合
# → モックデータで開発継続
npm run dev:no-docker
```

## 🚀 推奨解決手順

### 開発開始時のチェックリスト

1. **Node.js 確認**

   ```bash
   node --version  # 18.x または 20.x
   npm --version   # 9.x 以上
   ```

2. **依存関係インストール**

   ```bash
   npm install
   ```

3. **サーバー起動**

   ```bash
   # Docker利用可能な場合
   npm run setup && npm run dev

   # Docker不可の場合（推奨）
   npm run dev:no-docker
   ```

4. **アクセス確認**
   - フロントエンド: http://localhost:5173
   - モックデータが表示されることを確認

### 完全リセット（最終手段）

```bash
# プロセス全停止
pkill -f "npm\|vite\|tsx\|docker"

# ファイル完全削除
npm run clean

# Docker完全リセット（Dockerが動作する場合）
docker system prune -af

# 再セットアップ
npm install
npm run dev:no-docker
```

## 📞 サポート

### 正常動作の確認方法

```bash
# ✅ これらがすべて成功すれば正常
curl -s http://localhost:5173 > /dev/null && echo "✅ フロントエンド OK"
npm test --workspace=frontend && echo "✅ テスト OK"
npm run lint --workspace=frontend && echo "✅ リント OK"
```

### よくある質問

**Q: Docker 無しでどこまで開発できますか？**
A: フロントエンド開発は完全に可能です。UI 開発、コンポーネント開発、スタイリング、テストすべて対応しています。

**Q: 実際のデータベースが必要な場合は？**
A: Docker 環境を整えるか、クラウドデータベース（PlanetScale、Aiven 等）の使用を検討してください。

**Q: プロダクション環境では？**
A: Docker 環境を推奨します。`npm run prod-build` でプロダクション用ビルドが可能です。

---

**💡 Tips**: まずは `npm run dev:no-docker` でフロントエンド開発から始めることを強く推奨します！
