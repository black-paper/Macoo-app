# Makeoo

> **Make eco** ― 環境に優しいDIYレシピ投稿・閲覧プラットフォーム

---

## 📖 プロジェクト概要

**Makeoo**（メイクー）は、20〜30代のDIY初心者・中級者をターゲットに、自分の手で何かを作る楽しさを共有するためのWebアプリケーションです。  
ユーザー生成コンテンツ（UGC）として、DIYレシピの投稿・検索・コメント・いいね機能を提供し、コミュニティの形成と知見の蓄積を目指します。

---

## 🚀 主な機能

1. **ユーザー認証**  
   - メール／パスワードによる新規登録・ログイン（JWT）
2. **DIYレシピ管理**  
   - レシピの投稿・編集・削除  
   - タイトル・説明・材料・手順・画像アップロード（S3）
3. **検索・フィルタ**  
   - カテゴリ／タグ／キーワード検索  
   - ページング対応
4. **フィードバック**  
   - コメント機能  
   - いいね機能
5. **管理機能（将来）**  
   - 投稿の承認・モデレーション  
   - レポート機能

---

## 🛠 技術スタック

- **バックエンド**  
  - Python 3.10 + FastAPI  
  - AWS Lambda + Serverless Framework  
  - データベース：RDS (MySQL)、DynamoDB  
- **フロントエンド**  
  - React + TypeScript + Vite  
  - TailwindCSS  
- **インフラ**  
  - API Gateway, Lambda, S3, SQS, RDS, DynamoDB  
- **テスト**  
  - Unit: pytest / Vitest  
  - Integration: FastAPI TestClient, React Testing Library  
  - E2E: Cypress  
- **CI/CD**  
  - GitHub Actions (Lint → Test → Deploy)

---

## 📂 ディレクトリ構成

```text
/
├── backend/
│   ├── handlers/         # Lambda ハンドラ (FastAPI エントリ)
│   ├── routers/          # API ルーティング
│   ├── services/         # ビジネスロジック
│   ├── models/           # Pydantic モデル
│   ├── repositories/     # DB アクセス層
│   └── serverless.yml    # Serverless Framework 定義
├── frontend/
│   ├── src/
│   │   ├── components/   # UI コンポーネント
│   │   ├── hooks/        # カスタムフック
│   │   ├── services/     # API 呼び出し
│   │   ├── utils/        # ユーティリティ
│   │   ├── pages/        # ルーティングページ
│   │   ├── store/        # 状態管理
│   │   └── index.tsx     # エントリポイント
│   └── vite.config.ts
├── infra/
│   ├── serverless.yml    # サービス定義
│   ├── config/           # 環境別設定
│   └── scripts/          # デプロイ補助スクリプト
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── .cursorrules.md       # Cursor AI 共通ルール
├── PRD.md                # 要件定義書
├── architecture.md       # アーキテクチャ設計書
├── api-spec.md           # API 仕様書
├── tests.md              # テスト戦略書
└── README.md             # 本ドキュメント
