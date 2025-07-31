# 🌱 Makeoo - エコフレンドリー DIY プラットフォーム

**環境に優しい DIY レシピを共有するためのフルスタック Web アプリケーション**

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

## 📋 目次

- [機能](#-機能)
- [技術スタック](#-技術スタック)
- [プロジェクト構造](#-プロジェクト構造)
- [セットアップ](#-セットアップ)
- [開発](#-開発)
- [API 仕様](#-api仕様)
- [ドキュメント](#-ドキュメント)
- [デプロイ](#-デプロイ)
- [ライセンス](#-ライセンス)

> 📚 **開発者向け**: 最速で開発を始めたい場合は **[クイックスタートガイド](./docs/QUICK_START.md)** をご覧ください

## ✨ 機能

### 👤 ユーザー機能

- ユーザー登録・ログイン
- プロフィール管理
- レシピのお気に入り・コメント

### 📝 レシピ機能

- DIY レシピの投稿・編集
- カテゴリ・タグによる分類
- 難易度別表示（初級・中級・上級）
- 画像アップロード対応
- 詳細な手順・材料・道具リスト

### 🔍 検索・フィルタ機能

- カテゴリ別検索
- 難易度別フィルタ
- タグ検索
- 人気・新着ソート

### 📊 統計・分析

- レシピ閲覧数追跡
- いいね数・コメント数
- ユーザー投稿統計

## 🛠️ 技術スタック

### フロントエンド

- **React 18** + **TypeScript**
- **Vite** - 高速ビルドツール
- **TailwindCSS v4** - CSS-first design system
- **React Router** - SPA ルーティング

### バックエンド

- **Node.js 20** + **Express.js**
- **TypeScript** - 型安全な開発
- **Prisma ORM** - データベース管理
- **JWT** - 認証システム

### データベース・インフラ

- **MySQL 8.0** - メインデータベース
- **Redis 7** - キャッシュ・セッション管理
- **Docker Compose** - ローカル開発環境
- **Nginx** - リバースプロキシ（本番）

### 開発ツール

- **ESLint** + **Prettier** - コード品質
- **Jest** - テストフレームワーク
- **Winston** - 構造化ログ
- **phpMyAdmin** / **Adminer** - DB 管理 UI

## 📁 プロジェクト構造

```
makeoo/
├── frontend/                 # React フロントエンド
│   ├── src/
│   │   ├── components/       # 再利用可能コンポーネント
│   │   │   └── ui/          # 基本UIコンポーネント
│   │   ├── pages/           # ページコンポーネント
│   │   ├── hooks/           # カスタムフック（ビジネスロジック）
│   │   ├── services/        # API通信層
│   │   ├── utils/           # ユーティリティ関数
│   │   └── index.css        # TailwindCSS設定
│   ├── package.json
│   └── vite.config.ts
├── backend/                  # Node.js バックエンド
│   ├── src/
│   │   ├── routes/          # API エンドポイント
│   │   ├── middleware/      # Express ミドルウェア
│   │   ├── utils/           # ユーティリティ・DB接続
│   │   └── server.ts        # サーバーエントリーポイント
│   ├── prisma/
│   │   └── schema.prisma    # データベーススキーマ
│   ├── package.json
│   └── tsconfig.json
├── docs/                     # プロジェクトドキュメント
│   ├── API_SPECIFICATION.md # API仕様書
│   ├── DEVELOPMENT_LOG.md   # 開発履歴
│   ├── TECHNICAL_DECISIONS.md # 技術的意思決定記録
│   ├── CODE_QUALITY_STANDARDS.md # コード品質基準
│   └── QUICK_START.md       # クイックスタートガイド
├── infra/                    # インフラ構成・設定
│   ├── docker/              # Docker設定
│   │   ├── docker-compose.yml
│   │   └── docker-compose.override.yml
│   ├── database/            # データベース関連
│   │   └── schema.sql       # MySQLスキーマ
│   ├── mysql/               # MySQL設定
│   │   └── mysql.conf
│   └── redis/               # Redis設定
│       └── redis.conf
├── scripts/                  # 開発用スクリプト
│   ├── dev-setup.sh         # 初回セットアップ
│   └── dev-start.sh         # 開発サーバー起動
├── package.json             # ワークスペース設定
├── Makefile                 # タスクランナー
└── README.md
```

## 🚀 セットアップ

### 前提条件

- **Node.js** 18.0.0 以上
- **Docker** & **Docker Compose**
- **Git**

### 🎯 ワンコマンド起動

新しい開発者でも簡単に環境を構築できるよう、複数の起動方法を用意しています：

#### **1. 完全自動セットアップ（推奨）**

```bash
# 初回のみ実行 - 全自動セットアップ
npm run setup
# または
make setup
```

これにより以下が自動実行されます：

- 依存関係インストール
- Docker サービス起動（MySQL, Redis, 管理 UI）
- データベース初期化
- 初期データ投入
- 設定ファイル生成

#### **2. 開発サーバー起動**

```bash
# フロントエンド + バックエンド + Docker を並行起動
npm run dev
# または
make dev
```

#### **3. 個別起動オプション**

```bash
# データベースのみ起動
make dev-db

# アプリケーションのみ起動（Docker起動済み前提）
make dev-app
./scripts/dev-start.sh app

# データベースリセット + 全サービス起動
./scripts/dev-start.sh reset
```

### 1. リポジトリクローン

```bash
git clone <repository-url>
cd makeoo
```

### 2. Docker サービス起動

```bash
docker-compose -f infra/docker/docker-compose.yml up -d mysql redis phpmyadmin adminer redis-commander
```

### 3. バックエンドセットアップ

```bash
cd backend

# 依存関係インストール
npm install

# Prisma クライアント生成
npm run db:generate

# データベースマイグレーション
npm run db:push

# 初期データ投入
npm run db:seed
```

### 4. フロントエンドセットアップ

```bash
cd ../frontend

# 依存関係インストール
npm install

# 開発サーバー起動
npm run dev
```

### 5. 動作確認

| サービス             | URL                          | 説明          |
| -------------------- | ---------------------------- | ------------- |
| **フロントエンド**   | http://localhost:5173        | React アプリ  |
| **バックエンド API** | http://localhost:3001/api    | REST API      |
| **ヘルスチェック**   | http://localhost:3001/health | サーバー状態  |
| **phpMyAdmin**       | http://localhost:8080        | MySQL 管理    |
| **Adminer**          | http://localhost:8081        | DB 管理ツール |
| **Redis Commander**  | http://localhost:8082        | Redis 管理    |

## 💻 利用可能なサービス

開発環境起動後、以下のサービスにアクセスできます：

| サービス                | URL                       | 説明                      |
| ----------------------- | ------------------------- | ------------------------- |
| 🌐 **フロントエンド**   | http://localhost:5173     | React + Vite 開発サーバー |
| 🔧 **バックエンド API** | http://localhost:3001     | Express.js API サーバー   |
| 📊 **phpMyAdmin**       | http://localhost:8080     | MySQL 管理 UI             |
| 🗄️ **Adminer**          | http://localhost:8081     | 軽量 DB 管理ツール        |
| 🔴 **Redis Commander**  | http://localhost:8082     | Redis 管理 UI             |
| 📚 **API ドキュメント** | http://localhost:3001/api | API 仕様書                |

## 🔧 開発コマンド

### 🎯 よく使用するコマンド

```bash
# 📚 利用可能なコマンド一覧を表示
make help

# 🚀 開発サーバー起動
npm run dev
make dev

# 🧪 テスト実行
npm test
make test

# 🔍 リント実行
npm run lint
make lint

# 🏗️ 本番ビルド
npm run build
make build

# 🐳 Docker サービス管理
make docker-up    # 起動
make docker-down  # 停止
make docker-logs  # ログ表示

# 🗄️ データベース管理
make db-setup     # セットアップ
make db-seed      # 初期データ投入
make db-reset     # リセット
```

### ⚙️ 詳細な npm スクリプト

```bash
# === ワークスペース全体 ===
npm run dev              # 全サービス並行起動
npm run build            # 全体ビルド
npm run test             # 全体テスト
npm run lint             # 全体リント
npm run clean            # クリーンアップ

# === 個別サービス ===
npm run dev:frontend     # フロントエンドのみ
npm run dev:backend      # バックエンドのみ
npm run dev:docker       # Dockerサービスのみ

# === Docker関連 ===
npm run docker:up        # 全Docker起動
npm run docker:down      # 全Docker停止
npm run docker:logs      # ログ表示
npm run docker:reset     # 完全リセット

# === データベース ===
npm run db:setup         # DB初期化
npm run db:seed          # 初期データ投入
npm run db:reset         # DB完全リセット
```

### 🔧 個別サービスコマンド

#### フロントエンド (frontend/)

```bash
cd frontend

npm run dev          # 開発サーバー
npm run build        # 本番ビルド
npm run preview      # ビルド確認
npm run test         # テスト実行
npm run test:ui      # テストUIモード
npm run lint         # リント実行
```

#### バックエンド (backend/)

```bash
cd backend

npm run dev          # 開発サーバー
npm run build        # 本番ビルド
npm start            # 本番サーバー
npm run db:studio    # Prisma Studio
npm run db:generate  # Prisma Client生成
npm test             # テスト実行
```

## 📡 API 仕様

### 認証

- `POST /api/v1/auth/register` - ユーザー登録
- `POST /api/v1/auth/login` - ログイン
- `POST /api/v1/auth/logout` - ログアウト

### レシピ管理

- `GET /api/v1/recipes` - レシピ一覧取得
- `GET /api/v1/recipes/:id` - 個別レシピ取得
- `POST /api/v1/recipes` - レシピ作成
- `PUT /api/v1/recipes/:id` - レシピ更新
- `DELETE /api/v1/recipes/:id` - レシピ削除

### カテゴリ・タグ

- `GET /api/v1/categories` - カテゴリ一覧
- `GET /api/v1/tags` - タグ一覧

### ファイルアップロード

- `POST /api/v1/upload/image` - 画像アップロード

詳細な仕様は `/api` エンドポイントで確認できます。

## 📚 ドキュメント

プロジェクトの詳細なドキュメントは [`docs`](./docs/) フォルダにあります：

- **[クイックスタートガイド](./docs/QUICK_START.md)** - 新規開発者向けの最速セットアップ手順
- **[API 仕様書](./docs/API_SPECIFICATION.md)** - REST API エンドポイントの詳細仕様
- **[開発ログ](./docs/DEVELOPMENT_LOG.md)** - フルスタック実装履歴と技術的変更点
- **[技術的決定記録](./docs/TECHNICAL_DECISIONS.md)** - アーキテクチャ選定の判断根拠（ADR）
- **[コード品質基準](./docs/CODE_QUALITY_STANDARDS.md)** - 開発品質維持のためのガイドライン

## 🐳 Docker 開発環境

### 全サービス起動

```bash
docker-compose -f infra/docker/docker-compose.yml up -d
```

### ログ確認

```bash
# 全サービスログ
docker-compose -f infra/docker/docker-compose.yml logs -f

# 特定サービスログ
docker-compose -f infra/docker/docker-compose.yml logs -f mysql
docker-compose -f infra/docker/docker-compose.yml logs -f backend
```

### サービス管理

```bash
# サービス停止
docker-compose -f infra/docker/docker-compose.yml stop

# コンテナ削除
docker-compose -f infra/docker/docker-compose.yml down

# ボリューム含めて削除
docker-compose -f infra/docker/docker-compose.yml down -v
```

## 🚢 デプロイ

### 🌥️ AWS デプロイ（推奨）

Serverless Framework を使用して AWS にフロントエンドをホスティングします：

```bash
# ワンコマンド デプロイ（環境変数自動設定）
npm run aws:deploy:dev     # 開発環境
npm run aws:deploy:prod    # 本番環境

# 従来方式（手動で環境変数設定）
export AWS_PROFILE=shota
cd infra && ./scripts/deploy.sh deploy dev
```

#### 🔧 環境変数の自動設定

このプロジェクトでは `AWS_PROFILE=shota` が以下の方法で自動設定されます：

1. **VS Code**: ターミナル起動時に自動設定
2. **npm scripts**: AWS 関連コマンドで自動設定
3. **手動設定**: `source scripts/load-env.sh` で設定
4. **DevContainer**: 書き込み可能な AWS 設定ディレクトリで自動対応

詳細な手順は [infra/README.md](./infra/README.md) および [docs/DEVCONTAINER_AWS_SETUP.md](./docs/DEVCONTAINER_AWS_SETUP.md) を参照してください。

### 🐳 Docker 本番起動（ローカル環境）

```bash
# 本番プロファイルで起動
docker-compose -f infra/docker/docker-compose.yml --profile production up -d
```

### ローカル本番ビルド

```bash
# フロントエンド
cd frontend
npm run build

# バックエンド
cd backend
npm run build
```

## 🎯 今後の予定

- [x] **AWS フロントエンドデプロイ** - Serverless Framework + S3 + CloudFront
- [ ] バックエンド API の AWS デプロイ（Lambda + RDS）
- [ ] S3 画像ストレージ統合
- [ ] カスタムドメイン設定（Route53 + ACM）
- [ ] CI/CD パイプライン（GitHub Actions）
- [ ] メール通知機能（SES）
- [ ] レシピ検索最適化（OpenSearch）
- [ ] PWA 対応
- [ ] モバイルアプリ

## 📄 ライセンス

MIT License - 詳細は [LICENSE](LICENSE) ファイルを参照

## 🤝 コントリビューション

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

**Made with ❤️ for a sustainable future 🌍**
