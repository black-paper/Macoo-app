# 🌥️ AWS デプロイ セットアップガイド

## 📋 前提条件

### 1. AWS CLI のインストール

```bash
# Linux/WSL2
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# macOS
brew install awscli

# Windows (PowerShell)
msiexec.exe /i https://awscli.amazonaws.com/AWSCLIV2.msi
```

### 2. AWS プロファイル設定

```bash
# AWSプロファイル 'shota' を設定
aws configure --profile shota

# 設定例:
# AWS Access Key ID: YOUR_ACCESS_KEY
# AWS Secret Access Key: YOUR_SECRET_KEY
# Default region name: ap-northeast-1
# Default output format: json
```

### 3. 権限確認

必要な AWS 権限：

- S3: CreateBucket, PutObject, PutBucketPolicy
- CloudFront: CreateDistribution, GetDistribution
- CloudFormation: CreateStack, UpdateStack, DescribeStacks

## 🚀 デプロイ方法

### 方法 1: npm scripts（推奨）

```bash
# 開発環境にデプロイ（AWS_PROFILE自動設定）
npm run aws:deploy:dev

# 本番環境にデプロイ
npm run aws:deploy:prod

# デプロイ情報確認
npm run aws:info

# リソース削除（注意）
npm run aws:remove
```

### 方法 2: 直接スクリプト実行

```bash
# 環境変数を手動設定してスクリプト実行
export AWS_PROFILE=shota
./scripts/aws-deploy.sh dev
```

### 方法 3: プロジェクト環境変数読み込み

```bash
# 環境変数をファイルから読み込み
source scripts/load-env.sh

# その後通常通りスクリプト実行
./scripts/aws-deploy.sh dev
```

## 🔧 環境変数の自動設定

### VS Code での自動設定

1. `.vscode/settings.json` に以下が設定済み：

   ```json
   "terminal.integrated.env.linux": {
     "AWS_PROFILE": "shota",
     "AWS_REGION": "ap-northeast-1"
   }
   ```

2. 新しいターミナルを開いて確認：
   ```bash
   echo $AWS_PROFILE  # "shota" が表示されるはず
   ```

### .env ファイル設定

プロジェクトルートの `.env` ファイルに設定済み：

```bash
AWS_PROFILE=shota
AWS_REGION=ap-northeast-1
```

### direnv での自動設定（オプション）

1. direnv をインストール：

   ```bash
   # macOS
   brew install direnv

   # Ubuntu/Debian
   sudo apt install direnv
   ```

2. シェル設定に追加：

   ```bash
   echo 'eval "$(direnv hook bash)"' >> ~/.bashrc
   source ~/.bashrc
   ```

3. プロジェクトディレクトリで許可：
   ```bash
   direnv allow
   ```

## 🎯 デプロイ完了後

### アクセス URL 確認

デプロイ完了後に表示される URL：

- **CloudFront URL**: `https://xxxxxxxxx.cloudfront.net`
- **S3 Website URL**: `http://bucket-name.s3-website-ap-northeast-1.amazonaws.com`

### よく使うコマンド

```bash
# ファイル更新時の同期
cd infra && npm run sync

# CloudFront キャッシュクリア
cd infra && npm run invalidate

# デプロイ情報詳細表示
cd infra && npm run info
```

## 🐛 トラブルシューティング

### AWS_PROFILE が設定されない場合

1. **新しいターミナルを開く**

   - VS Code の設定は新しいターミナルでのみ有効

2. **手動で設定**

   ```bash
   export AWS_PROFILE=shota
   echo $AWS_PROFILE  # "shota" と表示されることを確認
   ```

3. **環境変数スクリプト使用**
   ```bash
   source scripts/load-env.sh
   ```

### AWS プロファイルエラー

```bash
# プロファイル一覧確認
aws configure list-profiles

# プロファイル設定確認
aws configure list --profile shota

# 認証情報確認
aws sts get-caller-identity --profile shota
```

### デプロイエラー

```bash
# CloudFormation スタック確認
aws cloudformation describe-stacks --stack-name makeoo-frontend-dev --profile shota

# S3 バケット確認
aws s3 ls --profile shota
```

## 💰 コスト情報

- **S3**: 5GB まで無料（通常サイズなら問題なし）
- **CloudFront**: 50GB 転送まで無料
- **Lambda@Edge**: 100 万リクエストまで無料

このプロジェクトの構成では AWS 無料枠内で運用可能です。

## 🗑️ リソース削除

⚠️ **注意**: この操作は元に戻せません

```bash
# 開発環境削除
npm run aws:remove dev

# 本番環境削除
npm run aws:remove prod
```

リソース削除後は AWS コンソールで完全に削除されたことを確認してください。
