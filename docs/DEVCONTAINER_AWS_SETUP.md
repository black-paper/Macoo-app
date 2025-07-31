# 🐳 DevContainer での AWS 設定ガイド

## 🔍 問題の原因

DevContainer 内で `~/.aws/` ディレクトリが Windows の C:\ ドライブに**読み取り専用**でマウントされているため、AWS 認証情報ファイルを作成できません。

```bash
# 問題の確認方法
mount | grep vscode
# 出力例: C:\ on /home/vscode/.aws type 9p (ro,...)
```

## ✅ 解決策

### 1. 自動セットアップスクリプトを使用（推奨）

```bash
# AWS認証情報を設定
./scripts/setup-aws-devcontainer.sh
```

このスクリプトが以下を自動実行します：

- 書き込み可能な AWS 設定ディレクトリ作成
- AWS 認証情報の対話的設定
- 環境変数の自動設定
- 設定テスト

### 2. 手動設定

#### Step 1: 環境変数設定

```bash
# 書き込み可能なディレクトリを作成
mkdir -p ~/.aws-writable

# 環境変数を設定
export AWS_CONFIG_FILE=~/.aws-writable/config
export AWS_SHARED_CREDENTIALS_FILE=~/.aws-writable/credentials
export AWS_PROFILE=shota
```

#### Step 2: 認証情報ファイル作成

```bash
# credentials ファイル作成
cat > ~/.aws-writable/credentials << EOF
[shota]
aws_access_key_id = YOUR_ACCESS_KEY_ID
aws_secret_access_key = YOUR_SECRET_ACCESS_KEY
EOF

# config ファイル作成
cat > ~/.aws-writable/config << EOF
[profile shota]
region = ap-northeast-1
output = json
EOF

# ファイル権限設定
chmod 600 ~/.aws-writable/credentials
chmod 600 ~/.aws-writable/config
```

#### Step 3: 永続化設定

```bash
# .bashrc に環境変数を追加
echo 'export AWS_CONFIG_FILE=~/.aws-writable/config' >> ~/.bashrc
echo 'export AWS_SHARED_CREDENTIALS_FILE=~/.aws-writable/credentials' >> ~/.bashrc
echo 'export AWS_PROFILE=shota' >> ~/.bashrc
echo 'export AWS_REGION=ap-northeast-1' >> ~/.bashrc
```

## 🧪 設定テスト

### 環境変数確認

```bash
echo "AWS_PROFILE: $AWS_PROFILE"
echo "AWS_CONFIG_FILE: $AWS_CONFIG_FILE"
echo "AWS_SHARED_CREDENTIALS_FILE: $AWS_SHARED_CREDENTIALS_FILE"
```

### AWS CLI テスト

```bash
# プロファイル確認
aws configure list-profiles

# 認証情報確認
aws sts get-caller-identity --profile shota

# 設定詳細表示
aws configure list --profile shota
```

### デプロイテスト

```bash
# 新しいターミナルを開いて実行
npm run aws:deploy:dev
```

## 🔧 DevContainer 設定詳細

### devcontainer.json の変更点

```json
{
  "mounts": [
    "type=volume,source=makeoo-aws-config,target=/home/vscode/.aws-writable"
  ],
  "containerEnv": {
    "AWS_CONFIG_FILE": "/home/vscode/.aws-writable/config",
    "AWS_SHARED_CREDENTIALS_FILE": "/home/vscode/.aws-writable/credentials"
  }
}
```

### Docker Volume の利点

- **永続化**: DevContainer 再起動後も設定が保持される
- **書き込み可能**: 読み取り専用制限を回避
- **独立性**: ホスト OS に依存しない

## 🐛 トラブルシューティング

### 問題: 環境変数が設定されない

```bash
# 解決策: 新しいターミナルを開く、または手動で読み込み
source ~/.bashrc
```

### 問題: AWS CLI が認証情報を見つけられない

```bash
# 解決策: 環境変数を再設定
export AWS_CONFIG_FILE=~/.aws-writable/config
export AWS_SHARED_CREDENTIALS_FILE=~/.aws-writable/credentials
export AWS_PROFILE=shota
```

### 問題: ファイル権限エラー

```bash
# 解決策: 権限を修正
chmod 600 ~/.aws-writable/credentials
chmod 600 ~/.aws-writable/config
```

### 問題: DevContainer rebuild が必要な場合

1. VS Code で `Ctrl+Shift+P`
2. "Dev Containers: Rebuild Container" を選択
3. DevContainer が再起動された後、再度設定スクリプトを実行

## 📝 注意事項

### セキュリティ

- AWS 認証情報は Docker Volume に保存されます
- `.aws-writable` ディレクトリは適切な権限設定を維持してください
- 本番環境では IAM ロールの使用を推奨します

### DevContainer 更新時

- DevContainer を rebuild する際は、認証情報設定が保持されます
- 新しいプロジェクトメンバーは初回のみ設定スクリプトを実行する必要があります

## 🎯 設定完了後の確認

設定が正常に完了すると、以下のコマンドが動作するはずです：

```bash
# プロファイル確認（"shota" が表示される）
aws configure list-profiles

# 認証テスト
aws sts get-caller-identity --profile shota

# デプロイテスト
npm run aws:deploy:dev
```

この設定により、DevContainer 内で AWS CLI が正常に動作し、AWS デプロイが可能になります。
