# Linter エラーについて

## CloudFormation 組み込み関数のエラー

`infra/serverless.yml` ファイルでは、以下の CloudFormation 組み込み関数を使用しているため、YAML リンターでエラーが表示される場合があります：

- `!Ref` - リソース参照
- `!Sub` - 文字列置換
- `!GetAtt` - リソース属性取得

## これらのエラーは無視して問題ありません

1. **正しい構文**: これらは CloudFormation の正式な組み込み関数です
2. **デプロイ正常**: Serverless Framework が正しく処理し、AWS 上で正常に動作します
3. **標準的な使用**: Serverless/CloudFormation プロジェクトでは一般的な記述方法です

## 対応方法

### IDE での対応

- VS Code の場合: `.vscode/settings.json` で CloudFormation タグを許可済み
- その他のエディタ: CloudFormation/AWS 拡張機能をインストール

### yamllint での対応

- `.yamllint` 設定ファイルで組み込み関数を許可済み
- ファイル先頭に `# yamllint disable-file` を追加済み

## 確認方法

実際のデプロイは正常に動作します：

```bash
cd infra
npm run deploy:dev
```

デプロイが成功すれば、リンターエラーは表示上の問題のみです。
