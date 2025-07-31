# 🚀 Makeoo AWS インフラストラクチャ

Serverless Framework を使用して AWS 上に Makeoo フロントエンドをホスティングするためのインフラ構成です。

## 📋 概要

- **静的ウェブサイトホスティング**: S3 + CloudFront
- **コスト最適化**: AWS 無料枠内での運用
- **グローバル配信**: CloudFront CDN による高速配信
- **HTTPS 対応**: AWS 提供の SSL 証明書を使用
- **SPA 対応**: React Router の履歴 API をサポート

## 🏗️ アーキテクチャ

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   ユーザー      │────│  CloudFront      │────│  S3 Bucket      │
│   (ブラウザ)    │    │  (CDN/HTTPS)     │    │  (静的ファイル) │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌──────────────────┐
                       │  Route53 (将来)  │
                       │  (カスタムドメイン)│
                       └──────────────────┘
```

### 使用 AWS サービス

| サービス       | 用途                   | 課金                 |
| -------------- | ---------------------- | -------------------- |
| **S3**         | 静的ファイルストレージ | 無料枠: 5GB          |
| **CloudFront** | CDN・HTTPS 配信        | 無料枠: 50GB 転送/月 |
| **Route53**    | DNS（将来的）          | 有料（未実装）       |

## 🛠️ セットアップ

### 前提条件

1. **AWS CLI** のインストールと設定

```bash
# AWS CLI インストール
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# プロファイル設定
aws configure --profile shota
```

2. **Serverless Framework** のインストール

```bash
npm install -g serverless
```

3. **依存関係のインストール**

```bash
cd infra
npm install
```

## 🚀 デプロイ

### 簡単デプロイ

```bash
# 開発環境にデプロイ
./scripts/deploy.sh deploy dev

# 本番環境にデプロイ
./scripts/deploy.sh deploy prod
```

### 詳細なデプロイ手順

#### 1. 開発環境デプロイ

```bash
cd infra

# 依存関係インストール
npm install

# フロントエンドビルド & デプロイ
npm run deploy:dev
```

#### 2. 本番環境デプロイ

```bash
cd infra

# 本番環境デプロイ
npm run deploy:prod
```

### デプロイ後の確認

```bash
# デプロイ情報表示
./scripts/deploy.sh info dev

# または
cd infra && npm run info
```

デプロイ完了後、以下の情報が表示されます：

- **S3 Website URL**: S3 の静的ウェブサイト URL
- **CloudFront URL**: `https://xxxxxxxxx.cloudfront.net` 形式の配信 URL

## 🔧 日常運用

### ファイル更新時の手順

```bash
# 1. フロントエンドをビルド
./scripts/deploy.sh build

# 2. S3 にファイルを同期
./scripts/deploy.sh sync dev

# 3. CloudFront キャッシュを無効化
./scripts/deploy.sh invalidate dev
```

### 便利なコマンド

```bash
# 利用可能なコマンド表示
./scripts/deploy.sh help

# リソース詳細情報表示
./scripts/deploy.sh info dev

# S3 のみファイル同期
./scripts/deploy.sh sync dev

# CloudFront キャッシュクリア
./scripts/deploy.sh invalidate dev
```

## 🗑️ リソース削除

⚠️ **注意**: この操作は元に戻せません。

```bash
# 開発環境削除
./scripts/deploy.sh remove dev

# 本番環境削除
./scripts/deploy.sh remove prod
```

## 💰 コスト最適化

### 無料枠内での運用

- **S3**: 5GB ストレージ、2 万回 GET リクエスト/月
- **CloudFront**: 50GB データ転送、200 万回リクエスト/月
- **Lambda@Edge**: 100 万回リクエスト/月

### 設定内容

- CloudFront は最安価なエッジロケーション (`PriceClass_100`) を使用
- 静的ファイルのキャッシュ期間を最適化
- 不要なリソースの削除スクリプト提供

## 🔒 セキュリティ

### 実装済み

- HTTPS 必須リダイレクト
- S3 バケットの適切なアクセス制御
- CORS 設定
- セキュリティヘッダー（本番環境）

### セキュリティヘッダー（本番環境）

- `Strict-Transport-Security`
- `X-Content-Type-Options`
- `X-Frame-Options`
- `Referrer-Policy`

## 🐛 トラブルシューティング

### よくある問題

#### 1. デプロイエラー

```bash
# AWS 認証確認
aws sts get-caller-identity --profile shota

# 権限確認
aws iam get-user --profile shota
```

#### 2. CloudFront キャッシュ問題

```bash
# キャッシュ無効化
./scripts/deploy.sh invalidate dev
```

#### 3. S3 アップロード問題

```bash
# S3 バケット確認
aws s3 ls --profile shota

# 手動同期
./scripts/deploy.sh sync dev
```

### ログ確認

```bash
# Serverless ログ
sls logs --function main --tail --stage dev

# CloudFormation スタック確認
aws cloudformation describe-stacks --stack-name makeoo-frontend-dev --profile shota
```

## 📊 監視

### CloudWatch メトリクス

- CloudFront リクエスト数
- S3 ストレージ使用量
- エラー率監視

### アラート設定（将来実装予定）

- 異常なトラフィック増加
- エラー率上昇
- コスト増加

## 🔄 CI/CD 統合（将来実装予定）

```yaml
# GitHub Actions 例
name: Deploy to AWS
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: cd infra && npm install
      - run: ./infra/scripts/deploy.sh deploy prod
```

## 📝 設定ファイル

- `serverless.yml`: メイン設定
- `config/serverless.dev.yml`: 開発環境設定
- `config/serverless.prod.yml`: 本番環境設定
- `package.json`: 依存関係とスクリプト

## 🎯 今後の改善予定

- [ ] カスタムドメイン対応（Route53 + ACM）
- [ ] GitHub Actions CI/CD 統合
- [ ] 環境変数管理（AWS Systems Manager）
- [ ] ログ分析（CloudWatch Logs Insights）
- [ ] コスト監視アラート
- [ ] Blue/Green デプロイ
