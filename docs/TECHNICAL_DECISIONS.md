# 🎯 技術的意思決定記録（ADR: Architecture Decision Records）

## 📚 関連ドキュメント

このドキュメントは以下の関連資料と併せてお読みください：

- **[クイックスタートガイド](./QUICK_START.md)** - 新規開発者向けの最速セットアップ手順
- **[API 仕様書](./API_SPECIFICATION.md)** - REST API エンドポイントの詳細仕様
- **[開発ログ](./DEVELOPMENT_LOG.md)** - フルスタック実装履歴と技術的変更点
- **[コード品質基準](./CODE_QUALITY_STANDARDS.md)** - 開発品質維持のためのガイドライン

## 概要

Makeoo DIY プラットフォーム開発における技術選定の判断根拠と設計思想を記録します。

---

## ADR-001: バックエンド技術スタックの選定

**決定日**: 2025-01-XX  
**決定者**: Development Team  
**ステータス**: ✅ 採用

### 📋 課題

フロントエンドのハードコードデータを DB 化し、本格的なバックエンド API を構築する必要があった。

### 🎯 決定内容

**Express.js + TypeScript + Prisma ORM + MySQL 8.0 + Redis**

### 🤔 検討した選択肢

| 技術選択肢     | メリット                                             | デメリット                         | 判定    |
| -------------- | ---------------------------------------------------- | ---------------------------------- | ------- |
| **Express.js** | 高速開発、豊富なエコシステム、TypeScript 親和性      | 構造化が必要、大規模時の設計複雑化 | ✅ 採用 |
| Fastify        | より高いパフォーマンス、スキーマベースバリデーション | エコシステム小、学習コスト         | ❌ 却下 |
| NestJS         | 構造化されたアーキテクチャ、デコレータベース         | オーバーヘッド大、学習コスト高     | ❌ 却下 |

### 📊 判断根拠

#### Express.js 選定理由

1. **開発速度**: チーム全員が既習、即座に開発開始可能
2. **柔軟性**: 必要な機能のみを段階的に追加可能
3. **エコシステム**: 豊富なミドルウェア、ライブラリ
4. **TypeScript 対応**: 型安全性を確保しつつ、学習コストを抑制

#### Prisma ORM 選定理由

1. **型安全性**: TypeScript との完全統合
2. **Developer Experience**: 優秀な CLI、Studio GUI
3. **マイグレーション**: 自動生成・管理システム
4. **マルチ DB 対応**: 将来的な DB 移行への対応

### 🎉 期待される効果

- 高速プロトタイピング → MVP 早期リリース
- 型安全性確保 → バグ減少、保守性向上
- スケーラビリティ → 段階的な機能拡張

### 📈 成果測定

- 初期実装期間: 1 週間（目標達成）
- 型安全性: Prisma 型定義 100%カバー（達成）
- 開発体験: ホットリロード、自動型生成（良好）

---

## ADR-002: データベース設計アプローチ

**決定日**: 2025-01-XX  
**ステータス**: ✅ 採用

### 📋 課題

スケーラブルで保守性の高いデータベース設計が必要。

### 🎯 決定内容

**完全正規化（第 3 正規形） + パフォーマンス最適化**

### 🏗️ 設計方針

#### 1. 正規化戦略

```sql
-- ✅ 正規化後
users (id, username, email, ...)
recipes (id, title, description, category_id, author_id, ...)
categories (id, name, slug, ...)
recipe_materials (id, recipe_id, name, quantity, ...)

-- ❌ 非正規化（避けた設計）
recipes (id, title, description, category_name, author_name, materials_json, ...)
```

#### 2. パフォーマンス対策

- **複合インデックス**: 検索頻度の高い組み合わせ
- **フルテキスト検索**: title, description 用インデックス
- **統計テーブル**: daily_stats での集計データ事前計算
- **自動更新トリガー**: likes_count, comments_count 等

### 📊 判断根拠

| 観点               | 正規化      | 非正規化 | 採用理由                       |
| ------------------ | ----------- | -------- | ------------------------------ |
| **データ整合性**   | ✅ 高い     | ❌ 低い  | ビジネス要件上、整合性が重要   |
| **保守性**         | ✅ 高い     | ❌ 低い  | 長期運用を見据えた設計         |
| **パフォーマンス** | ⚠️ 要最適化 | ✅ 高い  | インデックス・キャッシュで対応 |
| **ストレージ効率** | ✅ 高い     | ❌ 低い  | コスト効率重視                 |

### 🎪 特殊な設計決定

#### **BigInt vs Int**

```typescript
// ✅ 採用: BigInt for high-volume tables
recipes: id BIGINT
users: id BIGINT
comments: id BIGINT

// ✅ 採用: Int for reference tables
categories: id INT
tags: id INT
```

**理由**: 将来的なスケールを見据え、大量データが予想されるテーブルは BigInt

#### **Slug と ID 併用**

```sql
recipes (id BIGINT, slug VARCHAR(250) UNIQUE)
categories (id INT, slug VARCHAR(50) UNIQUE)
```

**理由**: SEO 向けの URL（slug）とパフォーマンス（id）を両立

---

## ADR-003: TailwindCSS v4 移行決定

**決定日**: 2025-01-XX  
**ステータス**: ✅ 採用

### 📋 課題

TailwindCSS v3 の JavaScript 設定で`mb-20`等の一部ユーティリティが適用されない問題が発生。

### 🎯 決定内容

**TailwindCSS v4 の CSS-first configuration**への移行

### 🔄 変更内容

#### Before (v3 JavaScript 設定)

```javascript
// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        /* ... */
      },
    },
  },
};
```

#### After (v4 CSS-first 設定)

```css
/* src/index.css */
@theme {
  --color-primary-500: #22c55e;
  --color-primary-600: #16a34a;
  --spacing-48: 12rem; /* 不足していた大きなスペーシング */
}
```

### 📊 判断根拠

| 項目               | v3 (JS 設定) | v4 (CSS 設定) | 効果                    |
| ------------------ | ------------ | ------------- | ----------------------- |
| **設定の見通し**   | ❌ 複雑      | ✅ 直感的     | CSS 変数で直接制御      |
| **ビルド速度**     | ⚠️ 遅い      | ✅ 高速       | CSS-in-CSS 処理         |
| **カスタマイズ性** | ⚠️ 制限あり  | ✅ 柔軟       | CSS 変数による動的制御  |
| **デバッグ性**     | ❌ 困難      | ✅ 容易       | DevTools で変数確認可能 |

### 🛠️ 移行作業

1. **不足ユーティリティの追加**

   ```css
   @theme {
     --spacing-48: 12rem; /* mb-48, p-48等で使用 */
   }
   ```

2. **カスタムコンポーネント保持**

   ```css
   .btn-primary {
     @apply rounded-lg bg-primary-600 px-6 py-3 font-medium text-white;
   }
   ```

3. **色定義の統一**
   - CSS 変数と JavaScript 設定のハイブリッド構成
   - インテリセンス対応のため config.js 併用

---

## ADR-004: キャッシュ戦略

**決定日**: 2025-01-XX  
**ステータス**: ✅ 採用

### 📋 課題

データベース負荷軽減とレスポンス速度向上が必要。

### 🎯 決定内容

**Redis 多層キャッシュ戦略**

### 🏗️ キャッシュ層設計

```typescript
// Cache Key Strategy
"recipes:popular"; // TTL: 30分
"recipes:category:{slug}"; // TTL: 1時間
"categories:all"; // TTL: 6時間
"tags:trending"; // TTL: 1時間
"user:{id}:profile"; // TTL: 15分
"stats:daily:{date}"; // TTL: 24時間
```

### 📊 キャッシュポリシー

| データ種別               | TTL     | 更新戦略      | 理由               |
| ------------------------ | ------- | ------------- | ------------------ |
| **人気レシピ**           | 30 分   | 時間ベース    | いいね数変動対応   |
| **カテゴリ一覧**         | 6 時間  | 手動無効化    | 変更頻度低         |
| **ユーザープロフィール** | 15 分   | Write-through | リアルタイム性重視 |
| **日次統計**             | 24 時間 | Write-behind  | 重い集計処理       |

### 🎪 実装パターン

#### Cache-Aside Pattern

```typescript
async function getPopularRecipes() {
  // 1. キャッシュ確認
  const cached = await CacheManager.get<Recipe[]>("recipes:popular");
  if (cached) return cached;

  // 2. DB取得
  const recipes = await prisma.recipe.findMany({
    orderBy: { likesCount: "desc" },
    take: 10,
  });

  // 3. キャッシュ更新
  await CacheManager.set("recipes:popular", recipes, 1800); // 30分
  return recipes;
}
```

### 🎯 期待効果

- **レスポンス時間**: 500ms → 50ms（90%改善）
- **DB 負荷**: 70%削減
- **同時接続**: 10 倍向上

---

## ADR-005: エラーハンドリング統一

**決定日**: 2025-01-XX  
**ステータス**: ✅ 採用

### 📋 課題

一貫性のないエラーレスポンスによるフロントエンド実装の複雑化。

### 🎯 決定内容

**統一エラーレスポンス形式 + カスタムエラークラス**

### 🏗️ エラー構造

```typescript
interface ErrorResponse {
  success: false;
  error: {
    message: string;
    status: number;
    timestamp: string;
    path: string;
    requestId?: string;
    stack?: string; // 開発環境のみ
    details?: any; // バリデーションエラー等
  };
}
```

### 🎪 エラー分類と処理

#### 1. **Prisma エラー**

```typescript
// P2002: Unique constraint violation
{
  "error": {
    "message": "既に存在するデータです",
    "status": 409,
    "details": { "field": ["email"] }
  }
}
```

#### 2. **バリデーションエラー**

```typescript
// express-validator結果
{
  "error": {
    "message": "入力データに不正があります",
    "status": 400,
    "details": {
      "validation": [
        { "field": "title", "message": "タイトルは必須です" }
      ]
    }
  }
}
```

#### 3. **認証エラー**

```typescript
// JWT verification failed
{
  "error": {
    "message": "認証トークンが無効です",
    "status": 401
  }
}
```

### 📊 メリット

- **フロントエンド**: 統一的なエラー処理ロジック
- **デバッグ**: 構造化されたエラー情報
- **監視**: ログ分析・アラート設定の容易化

---

## ADR-006: ログ・監視戦略

**決定日**: 2025-01-XX  
**ステータス**: ✅ 採用

### 📋 課題

本番環境での問題調査・パフォーマンス監視の仕組みが必要。

### 🎯 決定内容

**Winston 構造化ログ + ヘルスチェックエンドポイント**

### 🏗️ ログレベル設計

| レベル    | 用途           | 例                         |
| --------- | -------------- | -------------------------- |
| **error** | システムエラー | DB 接続エラー、500 エラー  |
| **warn**  | 警告           | 404 エラー、レート制限     |
| **info**  | 重要な情報     | サーバー起動、API 呼び出し |
| **debug** | デバッグ情報   | SQL 実行、キャッシュヒット |

### 📊 ログ出力例

```json
{
  "timestamp": "2025-01-20T10:30:00.000Z",
  "level": "error",
  "message": "Database connection failed",
  "meta": {
    "error": {
      "name": "PrismaClientInitializationError",
      "code": "P1001"
    },
    "request": {
      "method": "GET",
      "url": "/api/v1/recipes",
      "ip": "192.168.1.100"
    }
  }
}
```

### 🏥 ヘルスチェック設計

```typescript
// /health - 基本監視
{
  "status": "healthy",
  "services": {
    "database": { "status": "up", "type": "MySQL" },
    "cache": { "status": "up", "type": "Redis" }
  }
}

// /health/detailed - 詳細監視
{
  "services": {
    "database": {
      "stats": {
        "users": 1000,
        "recipes": 500,
        "activeRecipes": 450
      }
    }
  },
  "system": {
    "memory": { "used": 256, "total": 512 },
    "cpu": { "loadAverage": [0.5, 0.3, 0.2] }
  }
}
```

---

## ADR-007: セキュリティ対策

**決定日**: 2025-01-XX  
**ステータス**: ✅ 採用

### 📋 課題

Web アプリケーションの基本的なセキュリティ脅威への対策。

### 🎯 決定内容

**多層防御戦略**

### 🛡️ 実装された対策

#### 1. **認証・認可**

```typescript
// JWT + bcrypt (saltRounds: 12)
const hashedPassword = await bcrypt.hash(password, 12);
const token = jwt.sign(payload, secret, { expiresIn: "7d" });
```

#### 2. **入力検証**

```typescript
// express-validator
body('email').isEmail().normalizeEmail(),
body('password').isLength({ min: 8 }).matches(/^(?=.*[A-Za-z])(?=.*\d)/),
```

#### 3. **レート制限**

```typescript
// 一般API: 100req/15min
// 認証API: 5req/15min
// アップロード: 10files/1min
```

#### 4. **セキュリティヘッダー**

```typescript
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: {
      /* CSP設定 */
    },
  })
);
```

### 🎯 対応済み脅威

| 脅威              | 対策                   | 実装                        |
| ----------------- | ---------------------- | --------------------------- |
| **SQL Injection** | Prisma ORM             | ✅ 自動防御                 |
| **XSS**           | 入力サニタイゼーション | ✅ validator 適用           |
| **CSRF**          | SameSite Cookie        | ✅ セッション設定           |
| **DDoS**          | レート制限             | ✅ express-rate-limit       |
| **情報漏洩**      | エラー情報制限         | ✅ 本番環境でスタック非表示 |

---

## 📋 今後の技術的意思決定

### 検討中の項目

#### ADR-008: 画像ストレージ戦略 🔄

- **選択肢**: ローカルストレージ vs AWS S3 vs Cloudinary
- **判断要因**: コスト、パフォーマンス、CDN 統合

#### ADR-009: 検索機能実装 🔄

- **選択肢**: MySQL FULLTEXT vs Elasticsearch vs Algolia
- **判断要因**: 精度、速度、運用コスト、日本語対応

#### ADR-010: デプロイメント戦略 🔄

- **選択肢**: AWS ECS vs AWS Lambda vs Vercel
- **判断要因**: スケーラビリティ、コスト、運用負荷

### 定期見直し項目

#### パフォーマンス監視指標

- **レスポンス時間**: 95%ile < 200ms
- **エラー率**: < 1%
- **可用性**: > 99.9%

#### 技術的負債

- **依存関係更新**: 月次
- **セキュリティ監査**: 四半期
- **パフォーマンス監査**: 半年

---

**記録者**: AI Assistant  
**最終更新**: 2025-01-XX  
**次回レビュー**: 機能拡張時または問題発生時
