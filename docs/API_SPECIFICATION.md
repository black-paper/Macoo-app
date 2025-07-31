# �� Makeoo API 仕様書

## 📚 関連ドキュメント

このドキュメントは以下の関連資料と併せてお読みください：

- **[クイックスタートガイド](./QUICK_START.md)** - 新規開発者向けの最速セットアップ手順
- **[開発ログ](./DEVELOPMENT_LOG.md)** - フルスタック実装履歴と技術的変更点
- **[技術的決定記録](./TECHNICAL_DECISIONS.md)** - アーキテクチャ選定の判断根拠（ADR）
- **[コード品質基準](./CODE_QUALITY_STANDARDS.md)** - 開発品質維持のためのガイドライン

## 📋 概要

Makeoo DIY プラットフォームの REST API 仕様書です。Express.js + TypeScript + Prisma ORM で実装されています。

**Base URL**: `http://localhost:3001`  
**API Version**: `v1`  
**認証方式**: JWT Bearer Token  
**データ形式**: JSON

---

## 🏥 ヘルスチェック

### `GET /health`

サーバーの基本的な死活監視

**レスポンス例**:

```json
{
  "status": "healthy",
  "timestamp": "2025-01-20T10:30:00.000Z",
  "uptime": 3600,
  "version": "1.0.0",
  "environment": "development",
  "services": {
    "database": {
      "status": "up",
      "type": "MySQL"
    },
    "cache": {
      "status": "up",
      "type": "Redis"
    }
  },
  "system": {
    "memory": {
      "used": 156.78,
      "total": 512.0,
      "unit": "MB"
    },
    "nodeVersion": "v20.10.0",
    "platform": "linux"
  }
}
```

### `GET /health/detailed`

詳細なシステム情報とデータベース統計

**レスポンス例**:

```json
{
  "status": "healthy",
  "services": {
    "database": {
      "status": "up",
      "type": "MySQL",
      "stats": {
        "users": 6,
        "recipes": 6,
        "categories": 5,
        "tags": 25,
        "activeRecipes": 6,
        "timestamp": "2025-01-20T10:30:00.000Z"
      }
    }
  },
  "system": {
    "memory": {
      "used": 156.78,
      "total": 512.0,
      "external": 23.45,
      "unit": "MB"
    },
    "cpu": {
      "loadAverage": [0.5, 0.3, 0.2],
      "uptime": 86400
    }
  }
}
```

### `GET /health/ready` | `GET /health/live`

Kubernetes 用の Probe（簡易レスポンス）

---

## 📊 システム情報

### `GET /api`

API 概要とエンドポイント一覧

**レスポンス例**:

```json
{
  "name": "Makeoo DIY Platform API",
  "version": "1.0.0",
  "status": "running",
  "environment": "development",
  "endpoints": {
    "health": "/health",
    "docs": "/api/docs",
    "v1": {
      "recipes": "/api/v1/recipes",
      "users": "/api/v1/users",
      "categories": "/api/v1/categories",
      "tags": "/api/v1/tags",
      "upload": "/api/v1/upload"
    }
  },
  "timestamp": "2025-01-20T10:30:00.000Z"
}
```

---

## 📝 レシピ管理 `/api/v1/recipes`

### `GET /api/v1/recipes`

レシピ一覧取得（ページネーション・フィルタ対応）

**クエリパラメータ**:
| パラメータ | 型 | 説明 | デフォルト |
|------------|----|----- |-----------|
| `page` | number | ページ番号 | 1 |
| `limit` | number | 1 ページあたりの件数 | 20 |
| `category` | string | カテゴリ Slug | - |
| `difficulty` | string | 難易度（beginner\|intermediate\|advanced） | - |
| `sort` | string | ソート（latest\|popular\|likes） | latest |
| `search` | string | 検索キーワード | - |

**レスポンス例**:

```json
{
  "success": true,
  "data": {
    "recipes": [
      {
        "id": "1",
        "title": "ペットボトルプランター",
        "slug": "pet-bottle-planter",
        "description": "使い終わったペットボトルを活用した環境に優しいプランター...",
        "thumbnailUrl": "/uploads/recipes/planter-thumb.jpg",
        "difficulty": "beginner",
        "estimatedTimeMinutes": 30,
        "category": {
          "id": 1,
          "name": "ガーデニング",
          "slug": "gardening",
          "colorCode": "#22c55e"
        },
        "author": {
          "id": "1",
          "username": "yamada_taro",
          "displayName": "山田太郎",
          "avatarUrl": null,
          "isVerified": true
        },
        "likesCount": 124,
        "viewsCount": 1456,
        "commentsCount": 3,
        "tags": [
          { "id": 1, "name": "エコ", "slug": "eco" },
          { "id": 2, "name": "ガーデニング", "slug": "gardening" }
        ],
        "createdAt": "2024-01-15T00:00:00.000Z",
        "publishedAt": "2024-01-15T00:00:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 1,
      "totalItems": 6,
      "hasNext": false,
      "hasPrev": false
    }
  }
}
```

### `GET /api/v1/recipes/{id}`

個別レシピ詳細取得

**パスパラメータ**:

- `id`: レシピ ID（数値）または Slug（文字列）

**レスポンス例**:

```json
{
  "success": true,
  "data": {
    "recipe": {
      "id": "1",
      "title": "ペットボトルプランター",
      "slug": "pet-bottle-planter",
      "description": "使い終わったペットボトルを活用した...",
      "thumbnailUrl": "/uploads/recipes/planter-main.jpg",
      "difficulty": "beginner",
      "estimatedTimeMinutes": 30,
      "status": "published",
      "category": {
        "id": 1,
        "name": "ガーデニング",
        "slug": "gardening"
      },
      "author": {
        "id": "1",
        "displayName": "山田太郎",
        "username": "yamada_taro",
        "avatarUrl": null,
        "isVerified": true,
        "bio": "DIY初心者ですが、頑張って投稿しています！"
      },
      "materials": [
        {
          "id": "1",
          "name": "2Lペットボトル × 1本",
          "quantity": "1本",
          "notes": null,
          "sortOrder": 0
        },
        {
          "id": "2",
          "name": "土 × 適量",
          "quantity": "適量",
          "notes": null,
          "sortOrder": 1
        }
      ],
      "tools": [
        {
          "id": "1",
          "name": "カッター",
          "isEssential": true,
          "notes": null,
          "sortOrder": 0
        },
        {
          "id": "2",
          "name": "はさみ",
          "isEssential": true,
          "notes": null,
          "sortOrder": 1
        }
      ],
      "steps": [
        {
          "id": "1",
          "stepNumber": 1,
          "title": "ペットボトルのカット",
          "description": "ペットボトルを上から1/3の位置でカットします...",
          "imageUrl": null,
          "tip": "子供と一緒に作る場合は、大人がカット作業を行ってください。",
          "estimatedTimeMinutes": null,
          "sortOrder": 0
        }
      ],
      "tags": [
        { "id": 1, "name": "エコ", "slug": "eco" },
        { "id": 6, "name": "ペットボトル", "slug": "pet-bottle" }
      ],
      "likesCount": 124,
      "viewsCount": 1456,
      "commentsCount": 3,
      "createdAt": "2024-01-15T00:00:00.000Z",
      "updatedAt": "2024-01-15T00:00:00.000Z",
      "publishedAt": "2024-01-15T00:00:00.000Z"
    }
  }
}
```

### `POST /api/v1/recipes` 🔒

新規レシピ作成（認証必要）

**リクエストボディ**:

```json
{
  "title": "新しいDIYレシピ",
  "description": "詳細な説明文...",
  "difficulty": "beginner",
  "estimatedTimeMinutes": 60,
  "categoryId": 1,
  "thumbnailUrl": "/uploads/images/new-recipe.jpg",
  "materials": [
    {
      "name": "材料名",
      "quantity": "1個",
      "notes": "備考",
      "sortOrder": 0
    }
  ],
  "tools": [
    {
      "name": "道具名",
      "isEssential": true,
      "notes": "使用上の注意",
      "sortOrder": 0
    }
  ],
  "steps": [
    {
      "stepNumber": 1,
      "title": "手順タイトル",
      "description": "詳細な手順説明...",
      "tip": "コツやポイント",
      "sortOrder": 0
    }
  ],
  "tags": [1, 2, 3]
}
```

### `PUT /api/v1/recipes/{id}` 🔒

レシピ更新（作成者または管理者のみ）

### `DELETE /api/v1/recipes/{id}` 🔒

レシピ削除（作成者または管理者のみ）

---

## 👤 ユーザー管理 `/api/v1/users`

### `POST /api/v1/auth/register`

ユーザー新規登録

**リクエストボディ**:

```json
{
  "username": "new_user",
  "email": "user@example.com",
  "password": "securepassword123",
  "displayName": "新しいユーザー",
  "bio": "自己紹介文（オプション）"
}
```

**レスポンス例**:

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "7",
      "username": "new_user",
      "email": "user@example.com",
      "displayName": "新しいユーザー",
      "bio": "自己紹介文",
      "isVerified": false,
      "createdAt": "2025-01-20T10:30:00.000Z"
    },
    "token": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "expiresIn": "7d"
    }
  }
}
```

### `POST /api/v1/auth/login`

ユーザーログイン

**リクエストボディ**:

```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

### `POST /api/v1/auth/logout` 🔒

ログアウト（トークン無効化）

### `GET /api/v1/users/profile` 🔒

ログイン中ユーザーのプロフィール取得

### `PUT /api/v1/users/profile` 🔒

プロフィール更新

---

## 📂 カテゴリ管理 `/api/v1/categories`

### `GET /api/v1/categories`

カテゴリ一覧取得

**レスポンス例**:

```json
{
  "success": true,
  "data": {
    "categories": [
      {
        "id": 1,
        "name": "ガーデニング",
        "slug": "gardening",
        "description": "植物やガーデン関連のDIYプロジェクト",
        "iconName": "leaf",
        "colorCode": "#22c55e",
        "sortOrder": 1,
        "isActive": true,
        "recipeCount": 1
      },
      {
        "id": 2,
        "name": "衣類・アクセサリー",
        "slug": "clothing-accessories",
        "description": "古着リメイクやアクセサリー制作",
        "iconName": "shirt",
        "colorCode": "#3b82f6",
        "sortOrder": 2,
        "isActive": true,
        "recipeCount": 1
      }
    ]
  }
}
```

---

## 🏷️ タグ管理 `/api/v1/tags`

### `GET /api/v1/tags`

タグ一覧取得（使用頻度順）

**クエリパラメータ**:

- `limit`: 取得件数制限（デフォルト: 50）
- `search`: タグ名検索

**レスポンス例**:

```json
{
  "success": true,
  "data": {
    "tags": [
      {
        "id": 1,
        "name": "エコ",
        "slug": "eco",
        "usageCount": 3,
        "createdAt": "2025-01-20T00:00:00.000Z"
      },
      {
        "id": 2,
        "name": "リサイクル",
        "slug": "recycle",
        "usageCount": 2,
        "createdAt": "2025-01-20T00:00:00.000Z"
      }
    ]
  }
}
```

---

## 📤 ファイルアップロード `/api/v1/upload`

### `POST /api/v1/upload/image` 🔒

画像ファイルアップロード

**リクエスト**: `multipart/form-data`

- `image`: 画像ファイル（JPEG, PNG, WebP, GIF 対応）
- `type`: アップロード種別（recipe_thumbnail, recipe_step, user_avatar）

**レスポンス例**:

```json
{
  "success": true,
  "data": {
    "url": "/uploads/images/2025/01/20/abc123-resized.jpg",
    "originalName": "my-recipe.jpg",
    "size": 245760,
    "mimeType": "image/jpeg",
    "dimensions": {
      "width": 800,
      "height": 600
    }
  }
}
```

---

## ❤️ インタラクション

### `POST /api/v1/recipes/{id}/like` 🔒

レシピいいね

### `DELETE /api/v1/recipes/{id}/like` 🔒

いいね解除

### `GET /api/v1/recipes/{id}/comments`

コメント一覧取得

### `POST /api/v1/recipes/{id}/comments` 🔒

コメント投稿

### `PUT /api/v1/comments/{id}` 🔒

コメント編集

### `DELETE /api/v1/comments/{id}` 🔒

コメント削除

---

## 🚨 エラーレスポンス

### 統一エラーフォーマット

```json
{
  "success": false,
  "error": {
    "message": "エラーメッセージ",
    "status": 400,
    "timestamp": "2025-01-20T10:30:00.000Z",
    "path": "/api/v1/recipes",
    "requestId": "req_abc123",
    "details": {
      "validation": [
        {
          "field": "title",
          "message": "タイトルは必須です"
        }
      ]
    }
  }
}
```

### HTTP ステータスコード

| コード | 意味                  | 使用場面               |
| ------ | --------------------- | ---------------------- |
| 200    | OK                    | 正常な GET/PUT/DELETE  |
| 201    | Created               | POST 成功              |
| 400    | Bad Request           | バリデーションエラー   |
| 401    | Unauthorized          | 認証エラー             |
| 403    | Forbidden             | 認可エラー             |
| 404    | Not Found             | リソース未存在         |
| 409    | Conflict              | 重複データエラー       |
| 422    | Unprocessable Entity  | ビジネスロジックエラー |
| 429    | Too Many Requests     | レート制限             |
| 500    | Internal Server Error | サーバーエラー         |

---

## 🔐 認証・認可

### JWT Bearer Token

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### トークン構造

```json
{
  "userId": "1",
  "username": "yamada_taro",
  "role": "user",
  "iat": 1705741800,
  "exp": 1706346600
}
```

### レート制限

| エンドポイント | 制限           | ウィンドウ |
| -------------- | -------------- | ---------- |
| 一般 API       | 100 リクエスト | 15 分      |
| 認証 API       | 5 リクエスト   | 15 分      |
| アップロード   | 10 ファイル    | 1 分       |
| 検索 API       | 30 リクエスト  | 1 分       |

---

## 📋 実装メモ

### データベース設計

- **正規化**: 第 3 正規形まで適用
- **インデックス**: 検索・ソート用に最適化
- **外部キー制約**: データ整合性確保
- **トリガー**: カウント値自動更新

### パフォーマンス

- **Redis キャッシュ**: 人気レシピ、カテゴリ一覧等
- **画像最適化**: Sharp による自動リサイズ
- **ページネーション**: cursor-based（将来実装）
- **N+1 対策**: Prisma include 活用

### セキュリティ

- **入力サニタイゼーション**: XSS 対策
- **SQL インジェクション**: Prisma ORM で自動防御
- **CSRF**: SameSite Cookie 設定
- **Content Security Policy**: Helmet 適用

---

**更新履歴**:

- v1.0.0 (2025-01-XX): 初版リリース - 基本 CRUD 機能
- 今後の更新: 検索機能強化、推薦システム、管理機能

**API Status**: 🚧 開発中（コア CRUD 実装済み、認証・ファイルアップロード開発予定）
