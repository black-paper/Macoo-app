# Makeoo コード品質基準

## 📚 関連ドキュメント

このドキュメントは以下の関連資料と併せてお読みください：

- **[クイックスタートガイド](./QUICK_START.md)** - 新規開発者向けの最速セットアップ手順
- **[API 仕様書](./API_SPECIFICATION.md)** - REST API エンドポイントの詳細仕様
- **[開発ログ](./DEVELOPMENT_LOG.md)** - フルスタック実装履歴と技術的変更点
- **[技術的決定記録](./TECHNICAL_DECISIONS.md)** - アーキテクチャ選定の判断根拠（ADR）

## 概要

本ドキュメントは、Makeoo プロジェクトにおけるコード品質の維持・向上のための基準とガイドラインを定めています。

## 実装日

**2024 年 12 月**

- TypeScript `any`型の完全削除
- 共通処理の utils 分離
- コンポーネント共通化
- ロジック・プレゼンテーション分離
- テストコード整備
- アーキテクチャ図作成

## 1. TypeScript 型安全性

### 基本原則

- **`any`型の使用禁止**: すべての型は明示的に定義する
- **厳密な型チェック**: `strict: true`設定下での開発
- **型推論の活用**: 冗長な型注釈を避けつつ、明確性を保つ

### 実装例

```typescript
// ❌ 避けるべき書き方
const handleSubmit = (data: any) => {
  // ...
};

// ✅ 推奨する書き方
interface FormData {
  name: string;
  email: string;
  message: string;
}

const handleSubmit = (data: FormData): Promise<void> => {
  // ...
};
```

### API 型定義

```typescript
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

interface Recipe {
  id: string;
  title: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  // ... 他のプロパティ
}
```

## 2. アーキテクチャ設計

### フォルダ構造

```
frontend/src/
├── components/
│   ├── ui/           # 基本UIコンポーネント
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   └── index.ts
│   └── index.ts
├── hooks/            # カスタムフック
│   ├── useRecipes.ts
│   ├── useRecipeDetail.ts
│   └── index.ts
├── pages/            # ページコンポーネント
├── services/         # API通信
├── utils/            # 共通ユーティリティ
│   ├── formatters.ts
│   ├── ui.tsx
│   └── index.ts
└── __tests__/        # テストファイル
```

### 責任分離

#### カスタムフック（ビジネスロジック）

```typescript
export const useRecipes = (): UseRecipesReturn => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchRecipes = async (): Promise<void> => {
    // API呼び出しロジック
  };

  return { recipes, loading, fetchRecipes };
};
```

#### ページコンポーネント（プレゼンテーション）

```typescript
const RecipesPage: React.FC = () => {
  const { recipes, loading, fetchRecipes } = useRecipes();

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      {recipes.map((recipe) => (
        <RecipeCard key={recipe.id} recipe={recipe} />
      ))}
    </div>
  );
};
```

## 3. コンポーネント設計

### 再利用可能な UI コンポーネント

```typescript
interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  onClick,
  disabled = false,
}) => {
  // 実装
};
```

### コンポーネント合成パターン

```typescript
// Card コンポーネントの例
interface CardProps {
  children: React.ReactNode;
  hover?: boolean;
  padding?: "sm" | "md" | "lg";
}

const Card: React.FC<CardProps> = ({
  children,
  hover = true,
  padding = "md",
}) => {
  const hoverClass = hover ? "hover:-translate-y-1 hover:shadow-xl" : "";
  return <div className={`card ${hoverClass} p-${padding}`}>{children}</div>;
};
```

## 4. ユーティリティ関数

### フォーマット関数

```typescript
// utils/formatters.ts
export const getDifficultyLabel = (
  difficulty: Recipe["difficulty"]
): string => {
  const labels = {
    beginner: "初級",
    intermediate: "中級",
    advanced: "上級",
  };
  return labels[difficulty];
};

export const formatTime = (minutes: number): string => {
  if (minutes < 60) return `${minutes}分`;

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0
    ? `${hours}時間${remainingMinutes}分`
    : `${hours}時間`;
};
```

### UI 関連ユーティリティ

```typescript
// utils/ui.tsx
export const setPageTitle = (
  title: string,
  suffix: string = "Makeoo"
): void => {
  document.title = `${title} - ${suffix}`;
};

export const getRecipeIcon = (
  categoryIconName?: string
): React.ReactElement => {
  // アイコンマッピングロジック
};
```

## 5. テスト戦略

### テストファイル構造

```
src/
├── components/ui/__tests__/
│   ├── Button.test.tsx
│   └── Card.test.tsx
├── hooks/__tests__/
│   ├── useRecipes.test.ts
│   └── useRecipeDetail.test.ts
└── utils/__tests__/
    └── formatters.test.ts
```

### テスト作成基準

#### コンポーネントテスト

```typescript
describe("Button", () => {
  it("正しくレンダリングされる", () => {
    render(<Button>テストボタン</Button>);
    expect(screen.getByRole("button")).toHaveTextContent("テストボタン");
  });

  it("onClick ハンドラーが呼ばれる", () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>クリック</Button>);

    fireEvent.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledOnce();
  });
});
```

#### カスタムフックテスト

```typescript
describe("useRecipes", () => {
  it("初期状態が正しく設定される", () => {
    const { result } = renderHook(() => useRecipes());

    expect(result.current.loading).toBe(true);
    expect(result.current.recipes).toEqual([]);
  });
});
```

#### ユーティリティ関数テスト

```typescript
describe("formatters", () => {
  describe("formatTime", () => {
    it("60分未満は「分」で表示する", () => {
      expect(formatTime(30)).toBe("30分");
    });

    it("60分以上は「時間」で表示する", () => {
      expect(formatTime(90)).toBe("1時間30分");
    });
  });
});
```

## 6. パフォーマンス最適化

### React 最適化

```typescript
// メモ化の適切な使用
const RecipeCard = React.memo<RecipeCardProps>(({ recipe }) => {
  const formattedTime = useMemo(
    () => formatTime(recipe.estimatedTimeMinutes),
    [recipe.estimatedTimeMinutes]
  );

  const handleClick = useCallback(() => {
    // イベントハンドラー
  }, []);

  return (
    <Card>
      <h3>{recipe.title}</h3>
      <p>{formattedTime}</p>
    </Card>
  );
});
```

### バンドルサイズ最適化

```typescript
// 動的インポートの活用
const LazyRecipeDetail = React.lazy(() => import("./pages/RecipeDetail"));

// Tree shakingに配慮したインポート
import { formatTime, getDifficultyLabel } from "../utils/formatters";
```

## 7. エラーハンドリング

### 統一されたエラー処理

```typescript
// utils/formatters.ts
export const handleApiError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return "エラーが発生しました。しばらく時間をおいて再度お試しください。";
};
```

### エラーバウンダリ

```typescript
class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorMessage message="予期しないエラーが発生しました" />;
    }

    return this.props.children;
  }
}
```

## 8. アクセシビリティ

### 基本原則

- セマンティック HTML の使用
- キーボードナビゲーション対応
- ARIA 属性の適切な使用
- カラーコントラストの確保

### 実装例

```typescript
const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    if (isOpen) {
      // フォーカストラップの実装
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
      };
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <h2 id="modal-title">{title}</h2>
      {children}
    </div>
  );
};
```

## 9. 品質チェックリスト

### コードレビュー時のチェックポイント

#### TypeScript

- [ ] `any`型が使用されていないか
- [ ] すべての関数・変数に適切な型が定義されているか
- [ ] インターフェースの設計が適切か

#### アーキテクチャ

- [ ] 責任分離が適切に行われているか
- [ ] 共通処理が utils に配置されているか
- [ ] コンポーネントが再利用可能な設計になっているか

#### テスト

- [ ] 新規・変更コンポーネントにテストが書かれているか
- [ ] テストカバレッジが適切か
- [ ] エッジケースのテストが含まれているか

#### パフォーマンス

- [ ] 不要な再レンダリングが発生していないか
- [ ] メモ化が適切に使用されているか
- [ ] バンドルサイズへの影響が考慮されているか

#### アクセシビリティ

- [ ] セマンティック HTML が使用されているか
- [ ] キーボードナビゲーションが実装されているか
- [ ] ARIA 属性が適切に設定されているか

## 10. 継続的改善

### 技術的負債管理

- 定期的なコードレビューと品質監査
- 依存関係の定期的な更新
- パフォーマンス監視とボトルネック特定

### 学習・共有

- 技術決定事項のドキュメント化
- ベストプラクティスの共有
- 外部ライブラリ・ツールの調査と導入検討

---

このドキュメントは、プロジェクトの成長とともに継続的に更新されます。チーム全体での品質向上を目指し、実践的で持続可能な基準を維持していきます。
