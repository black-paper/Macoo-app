# 🚀 Makeoo クイックスタートガイド

## 📚 関連ドキュメント

このドキュメントは以下の関連資料と併せてお読みください：

- **[API 仕様書](./API_SPECIFICATION.md)** - REST API エンドポイントの詳細仕様
- **[開発ログ](./DEVELOPMENT_LOG.md)** - フルスタック実装履歴と技術的変更点
- **[技術的決定記録](./TECHNICAL_DECISIONS.md)** - アーキテクチャ選定の判断根拠（ADR）
- **[コード品質基準](./CODE_QUALITY_STANDARDS.md)** - 開発品質維持のためのガイドライン

新しい開発者がすぐに開発を始められるよう、最も重要なコマンドをまとめました。

## 🐳 Docker 環境での開発（推奨・フル機能）

### 📋 最初にすること

```bash
# 1. リポジトリクローン後、プロジェクトディレクトリに移動
cd makeoo

# 2. 初回セットアップ（全自動）
npm run setup
# ⏱️ 約3-5分かかります（ダウンロード・DB初期化含む）

# 3. 開発サーバー起動
npm run dev
# 🎉 これで開発開始！
```

## ⚡ Docker 無し環境での開発（即座に利用可能）

Docker が利用できない環境でも、フロントエンドの開発は可能です：

### 📋 最初にすること

```bash
# 1. リポジトリクローン後、プロジェクトディレクトリに移動
cd makeoo

# 2. 初回セットアップ（Docker無し）
npm run setup:no-docker

# 3. 開発サーバー起動（フロントエンドのみ）
npm run dev:no-docker
# または
make dev-no-docker
```

### 🌐 アクセス先

- **フロントエンド**: http://localhost:5173 ✅
- **バックエンド API**: データベース接続が必要なため利用不可 ❌

### 💡 Docker 無し環境での開発について

- ✅ **UI 開発**: 完全に利用可能
- ✅ **コンポーネント開発**: 問題なし
- ✅ **スタイリング**: TailwindCSS 利用可能
- ✅ **テスト実行**: `npm test` で実行可能
- ❌ **API 通信**: データベースが無いため利用不可
- ❌ **データ表示**: サンプルデータは表示されない

## 🐳 Docker のインストール（完全な開発環境のため）

完全な機能（データベース、API、データ表示）を利用したい場合は、Docker をインストールしてください：

### Linux/WSL 環境

```bash
# Docker Engine インストール
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# 現在のユーザーをdockerグループに追加
sudo usermod -aG docker $USER

# ログアウト・ログインして設定を反映
# またはコマンドで即座に反映
newgrp docker

# インストール確認
docker --version
docker compose version
```

### 🔄 Docker インストール後

```bash
# フルセットアップ
npm run setup

# 全機能付きで開発開始
npm run dev
# または
make dev
```

## 🔥 よく使用するコマンド

| コマンド           | 説明                           | 使用頻度   |
| ------------------ | ------------------------------ | ---------- |
| `npm run dev`      | 開発サーバー起動（全サービス） | ⭐⭐⭐⭐⭐ |
| `make help`        | 利用可能なコマンド一覧         | ⭐⭐⭐⭐   |
| `npm test`         | テスト実行                     | ⭐⭐⭐⭐   |
| `npm run lint`     | コード品質チェック             | ⭐⭐⭐     |
| `make docker-logs` | ログ確認                       | ⭐⭐⭐     |
| `make db-reset`    | データベースリセット           | ⭐⭐       |

## 🌐 アクセス先

開発サーバー起動後、以下の URL にアクセス：

- **フロントエンド**: http://localhost:5173
- **バックエンド API**: http://localhost:3001
- **phpMyAdmin**: http://localhost:8080（DB 管理）
- **API 仕様書**: http://localhost:3001/api

## 🔧 個別サービス操作

### フロントエンドのみ作業する場合

```bash
npm run dev:frontend
# または
cd frontend && npm run dev
```

### バックエンドのみ作業する場合

```bash
npm run dev:backend
# または
cd backend && npm run dev
```

### データベース関連の作業

```bash
# DBスキーマ確認・編集
cd backend && npm run db:studio

# 初期データ再投入
npm run db:seed

# DB完全リセット
make db-reset
```

## 🚨 トラブルシューティング

### ポートが使用中エラー

```bash
# 使用中のプロセスを確認・終了
sudo lsof -ti:5173 -ti:3001 | xargs kill -9
# または
pkill -f "npm run dev"
```

### Docker エラー

```bash
# Docker完全リセット
make docker-reset

# ログ確認
make docker-logs
```

### 依存関係エラー

```bash
# 完全クリーンアップ
npm run clean
npm install
```

## 📚 次に読むべきドキュメント

1. **[API 仕様書](./API_SPECIFICATION.md)** - バックエンド開発者必読
2. **[コード品質基準](./CODE_QUALITY_STANDARDS.md)** - コード修正前に確認
3. **[技術的決定記録](./TECHNICAL_DECISIONS.md)** - アーキテクチャ理解のため

## 💡 Tips

- **Makefile が使える場合**: `make dev` の方が短くて便利
- **VSCode 使用者**: 拡張機能「Prisma」「Tailwind CSS IntelliSense」を推奨
- **初回は時間がかかります**: Docker イメージダウンロード・DB 初期化のため

---

**問題があれば**: まず `make help` でコマンド一覧を確認してください 🔍
