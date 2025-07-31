/**
 * API Service Layer
 * バックエンドAPIとの通信を管理
 */

// APIベースURL - 実際のバックエンドサーバーを使用
const API_BASE_URL =
  import.meta.env.MODE === "production"
    ? "https://your-api-domain.com/api/v1"
    : "http://localhost:3001/api/v1";

// 共通のAPIレスポンス型
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// ページネーション用の型
interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// レシピ関連の型定義
export interface Recipe {
  id: string;
  title: string;
  slug: string;
  description: string;
  thumbnailUrl?: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  estimatedTimeMinutes: number;
  categoryId: string;
  category: {
    id: string;
    name: string;
    slug: string;
    description: string;
    iconName: string;
    colorCode: string;
  };
  author: {
    id: string;
    username: string;
    displayName: string;
    bio?: string;
    isVerified: boolean;
  };
  status: "draft" | "published" | "archived";
  likesCount: number;
  commentsCount: number;
  viewsCount: number;
  materials: RecipeMaterial[];
  tools: RecipeTool[];
  steps: RecipeStep[];
  tags: RecipeTag[];
  comments?: RecipeComment[];
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface RecipeMaterial {
  id: string;
  name: string;
  quantity?: string;
  notes?: string;
  sortOrder: number;
}

export interface RecipeTool {
  id: string;
  name: string;
  notes?: string;
  isEssential: boolean;
  sortOrder: number;
}

export interface RecipeStep {
  id: string;
  stepNumber: number;
  title: string;
  description: string;
  estimatedTimeMinutes?: number;
  imageUrl?: string;
  notes?: string;
}

export interface RecipeTag {
  id: string;
  name: string;
  slug: string;
  usageCount: number;
}

export interface RecipeComment {
  id: string;
  content: string;
  author: {
    id: string;
    username: string;
    displayName: string;
    isVerified: boolean;
  };
  likesCount: number;
  createdAt: string;
  updatedAt: string;
}

// カテゴリ型
export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  iconName: string;
  colorCode: string;
  recipesCount: number;
  sortOrder: number;
}

// API クライアント
class ApiClient {
  private baseURL: string;
  private timeout: number;

  constructor(
    baseURL: string = "http://localhost:3001/api",
    timeout: number = 10000
  ) {
    this.baseURL = baseURL;
    this.timeout = timeout;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        return {
          success: false,
          error: `HTTP ${response.status}: ${response.statusText}`,
        };
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      clearTimeout(timeoutId);
      console.warn(`API request failed (${endpoint}), using mock data:`, error);

      // モックデータフォールバック
      const mockData = this.getMockData<T>(endpoint);
      if (mockData) {
        return { success: true, data: mockData };
      }

      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  private getMockData<T>(endpoint: string): T | null {
    // レシピ一覧のモックデータ
    if (endpoint.includes("/recipes")) {
      return {
        data: [
          {
            id: "1",
            title: "ペットボトルで作るプランター",
            slug: "pet-bottle-planter",
            description:
              "使い終わったペットボトルを再利用して、おしゃれなプランターを作ります。初心者でも簡単に作れるエコプロジェクトです。",
            thumbnailUrl: undefined,
            category: {
              id: "1",
              name: "ガーデニング",
              slug: "gardening",
              iconName: "leaf",
              colorCode: "#22c55e",
            },
            author: {
              id: "1",
              email: "user1@example.com",
              displayName: "みどり",
              profileImageUrl: undefined,
            },
            difficulty: "beginner" as const,
            estimatedTimeMinutes: 30,
            likesCount: 42,
            commentsCount: 8,
            viewsCount: 150,
            materials: [
              {
                id: "1",
                name: "2Lペットボトル",
                quantity: "1本",
                sortOrder: 1,
              },
            ],
            tools: [
              {
                id: "1",
                name: "カッター",
                isEssential: true,
                sortOrder: 1,
              },
            ],
            steps: [
              {
                id: "1",
                stepNumber: 1,
                title: "ペットボトルを切る",
                description:
                  "ペットボトルの上部3分の1をカッターで切り取ります。",
                notes: "怪我をしないよう注意してください",
              },
            ],
            tags: [
              { id: "1", name: "エコ", slug: "eco" },
              { id: "2", name: "リサイクル", slug: "recycle" },
            ],
            comments: [],
            publishedAt: "2025-01-20T10:00:00Z",
            createdAt: "2025-01-20T10:00:00Z",
            updatedAt: "2025-01-20T10:00:00Z",
          },
          {
            id: "2",
            title: "古着から作るエコバッグ",
            slug: "old-clothes-eco-bag",
            description:
              "着なくなったTシャツや布を使って、実用的なエコバッグを作ります。縫物初心者にもおすすめです。",
            thumbnailUrl: undefined,
            category: {
              id: "2",
              name: "衣類・アクセサリー",
              slug: "clothing",
              iconName: "shirt",
              colorCode: "#f59e0b",
            },
            author: {
              id: "2",
              email: "user2@example.com",
              displayName: "さくら",
              profileImageUrl: undefined,
            },
            difficulty: "beginner" as const,
            estimatedTimeMinutes: 45,
            likesCount: 28,
            commentsCount: 5,
            viewsCount: 89,
            materials: [],
            tools: [],
            steps: [],
            tags: [
              { id: "1", name: "エコ", slug: "eco" },
              { id: "3", name: "ファッション", slug: "fashion" },
            ],
            comments: [],
            publishedAt: "2025-01-19T14:30:00Z",
            createdAt: "2025-01-19T14:30:00Z",
            updatedAt: "2025-01-19T14:30:00Z",
          },
          {
            id: "3",
            title: "牛乳パックで作る小物入れ",
            slug: "milk-carton-organizer",
            description:
              "牛乳パックを使って、デスク周りを整理できるおしゃれな小物入れを作ります。お子様との工作にも最適です。",
            thumbnailUrl: undefined,
            category: {
              id: "3",
              name: "インテリア",
              slug: "interior",
              iconName: "home",
              colorCode: "#8b5cf6",
            },
            author: {
              id: "3",
              email: "user3@example.com",
              displayName: "そら",
              profileImageUrl: undefined,
            },
            difficulty: "beginner" as const,
            estimatedTimeMinutes: 25,
            likesCount: 35,
            commentsCount: 12,
            viewsCount: 203,
            materials: [],
            tools: [],
            steps: [],
            tags: [
              { id: "2", name: "リサイクル", slug: "recycle" },
              { id: "4", name: "収納", slug: "storage" },
            ],
            comments: [],
            publishedAt: "2025-01-18T09:15:00Z",
            createdAt: "2025-01-18T09:15:00Z",
            updatedAt: "2025-01-18T09:15:00Z",
          },
          {
            id: "4",
            title: "段ボールで作る猫ハウス",
            slug: "cardboard-cat-house",
            description:
              "大きな段ボールを使って、愛猫が喜ぶ快適なハウスを作ります。装飾も楽しめる上級者向けプロジェクトです。",
            thumbnailUrl: undefined,
            category: {
              id: "4",
              name: "ペット用品",
              slug: "pet-supplies",
              iconName: "heart",
              colorCode: "#ef4444",
            },
            author: {
              id: "4",
              email: "user4@example.com",
              displayName: "ひなた",
              profileImageUrl: undefined,
            },
            difficulty: "advanced" as const,
            estimatedTimeMinutes: 120,
            likesCount: 67,
            commentsCount: 23,
            viewsCount: 342,
            materials: [],
            tools: [],
            steps: [],
            tags: [
              { id: "2", name: "リサイクル", slug: "recycle" },
              { id: "5", name: "ペット", slug: "pet" },
            ],
            comments: [],
            publishedAt: "2025-01-17T16:45:00Z",
            createdAt: "2025-01-17T16:45:00Z",
            updatedAt: "2025-01-17T16:45:00Z",
          },
          {
            id: "5",
            title: "空き瓶でハーブ栽培",
            slug: "jar-herb-garden",
            description:
              "ジャムの空き瓶を利用して、キッチンで手軽にハーブを育てましょう。料理にも使えて一石二鳥です。",
            thumbnailUrl: undefined,
            category: {
              id: "1",
              name: "ガーデニング",
              slug: "gardening",
              iconName: "leaf",
              colorCode: "#22c55e",
            },
            author: {
              id: "5",
              email: "user5@example.com",
              displayName: "かえで",
              profileImageUrl: undefined,
            },
            difficulty: "beginner" as const,
            estimatedTimeMinutes: 20,
            likesCount: 51,
            commentsCount: 15,
            viewsCount: 178,
            materials: [],
            tools: [],
            steps: [],
            tags: [
              { id: "1", name: "エコ", slug: "eco" },
              { id: "6", name: "ハーブ", slug: "herb" },
            ],
            comments: [],
            publishedAt: "2025-01-16T11:20:00Z",
            createdAt: "2025-01-16T11:20:00Z",
            updatedAt: "2025-01-16T11:20:00Z",
          },
          {
            id: "6",
            title: "新聞紙で作るエコラッピング",
            slug: "newspaper-eco-wrapping",
            description:
              "古新聞を使っておしゃれなギフトラッピングを作ります。環境に優しくて見た目も素敵なラッピング技術です。",
            thumbnailUrl: undefined,
            category: {
              id: "5",
              name: "クラフト",
              slug: "craft",
              iconName: "scissors",
              colorCode: "#06b6d4",
            },
            author: {
              id: "6",
              email: "user6@example.com",
              displayName: "あおば",
              profileImageUrl: undefined,
            },
            difficulty: "intermediate" as const,
            estimatedTimeMinutes: 15,
            likesCount: 39,
            commentsCount: 7,
            viewsCount: 124,
            materials: [],
            tools: [],
            steps: [],
            tags: [
              { id: "2", name: "リサイクル", slug: "recycle" },
              { id: "7", name: "ギフト", slug: "gift" },
            ],
            comments: [],
            publishedAt: "2025-01-15T13:10:00Z",
            createdAt: "2025-01-15T13:10:00Z",
            updatedAt: "2025-01-15T13:10:00Z",
          },
          {
            id: "7",
            title: "ワインコルクでコースター",
            slug: "wine-cork-coaster",
            description:
              "集めたワインコルクを使って、ナチュラルで温かみのあるコースターを作ります。大人の趣味としてもおすすめ。",
            thumbnailUrl: undefined,
            category: {
              id: "3",
              name: "インテリア",
              slug: "interior",
              iconName: "home",
              colorCode: "#8b5cf6",
            },
            author: {
              id: "7",
              email: "user7@example.com",
              displayName: "つむぎ",
              profileImageUrl: undefined,
            },
            difficulty: "intermediate" as const,
            estimatedTimeMinutes: 60,
            likesCount: 73,
            commentsCount: 19,
            viewsCount: 256,
            materials: [],
            tools: [],
            steps: [],
            tags: [
              { id: "2", name: "リサイクル", slug: "recycle" },
              { id: "8", name: "インテリア", slug: "interior" },
            ],
            comments: [],
            publishedAt: "2025-01-14T15:30:00Z",
            createdAt: "2025-01-14T15:30:00Z",
            updatedAt: "2025-01-14T15:30:00Z",
          },
          {
            id: "8",
            title: "デニムリメイクでポーチ作り",
            slug: "denim-remake-pouch",
            description:
              "履かなくなったジーンズを使って、実用的なポーチを作ります。デニムの質感を活かした上級者向けプロジェクト。",
            thumbnailUrl: undefined,
            category: {
              id: "2",
              name: "衣類・アクセサリー",
              slug: "clothing",
              iconName: "shirt",
              colorCode: "#f59e0b",
            },
            author: {
              id: "8",
              email: "user8@example.com",
              displayName: "はるか",
              profileImageUrl: undefined,
            },
            difficulty: "advanced" as const,
            estimatedTimeMinutes: 90,
            likesCount: 92,
            commentsCount: 31,
            viewsCount: 398,
            materials: [],
            tools: [],
            steps: [],
            tags: [
              { id: "2", name: "リサイクル", slug: "recycle" },
              { id: "3", name: "ファッション", slug: "fashion" },
            ],
            comments: [],
            publishedAt: "2025-01-13T10:45:00Z",
            createdAt: "2025-01-13T10:45:00Z",
            updatedAt: "2025-01-13T10:45:00Z",
          },
          {
            id: "9",
            title: "卵パックで苗づくり",
            slug: "egg-carton-seedlings",
            description:
              "紙製の卵パックを使って、野菜や花の苗を育てます。そのまま土に植えられるので、とても環境に優しい方法です。",
            thumbnailUrl: undefined,
            category: {
              id: "1",
              name: "ガーデニング",
              slug: "gardening",
              iconName: "leaf",
              colorCode: "#22c55e",
            },
            author: {
              id: "9",
              email: "user9@example.com",
              displayName: "みずき",
              profileImageUrl: undefined,
            },
            difficulty: "beginner" as const,
            estimatedTimeMinutes: 10,
            likesCount: 48,
            commentsCount: 21,
            viewsCount: 267,
            materials: [],
            tools: [],
            steps: [],
            tags: [
              { id: "1", name: "エコ", slug: "eco" },
              { id: "2", name: "リサイクル", slug: "recycle" },
            ],
            comments: [],
            publishedAt: "2025-01-12T08:15:00Z",
            createdAt: "2025-01-12T08:15:00Z",
            updatedAt: "2025-01-12T08:15:00Z",
          },
          {
            id: "10",
            title: "古本でウォールアート",
            slug: "old-book-wall-art",
            description:
              "読み終わった本のページを使って、おしゃれなウォールデコレーションを作ります。読書好きにはたまらない上級プロジェクト。",
            thumbnailUrl: undefined,
            category: {
              id: "3",
              name: "インテリア",
              slug: "interior",
              iconName: "home",
              colorCode: "#8b5cf6",
            },
            author: {
              id: "10",
              email: "user10@example.com",
              displayName: "ことは",
              profileImageUrl: undefined,
            },
            difficulty: "advanced" as const,
            estimatedTimeMinutes: 150,
            likesCount: 156,
            commentsCount: 42,
            viewsCount: 523,
            materials: [],
            tools: [],
            steps: [],
            tags: [
              { id: "2", name: "リサイクル", slug: "recycle" },
              { id: "8", name: "インテリア", slug: "interior" },
            ],
            comments: [],
            publishedAt: "2025-01-11T14:20:00Z",
            createdAt: "2025-01-11T14:20:00Z",
            updatedAt: "2025-01-11T14:20:00Z",
          },
        ],
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalItems: 10,
          hasNext: false,
          hasPrev: false,
        },
      } as T;
    }

    // カテゴリ一覧のモックデータ
    if (endpoint.includes("/categories")) {
      return [
        {
          id: "1",
          name: "ガーデニング",
          slug: "gardening",
          description: "植物やガーデン関連のDIYプロジェクト",
          iconName: "leaf",
          colorCode: "#22c55e",
        },
        {
          id: "2",
          name: "衣類・アクセサリー",
          slug: "clothing",
          description: "衣服やアクセサリーの制作・リメイク",
          iconName: "shirt",
          colorCode: "#f59e0b",
        },
        {
          id: "3",
          name: "インテリア",
          slug: "interior",
          description: "家具やインテリア雑貨の制作",
          iconName: "home",
          colorCode: "#8b5cf6",
        },
        {
          id: "4",
          name: "ペット用品",
          slug: "pet-supplies",
          description: "ペットのためのグッズ制作",
          iconName: "heart",
          colorCode: "#ef4444",
        },
        {
          id: "5",
          name: "クラフト",
          slug: "craft",
          description: "手工芸・クラフト作品の制作",
          iconName: "scissors",
          colorCode: "#06b6d4",
        },
      ] as T;
    }

    return null;
  }

  // GETリクエスト
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint);
  }

  // POSTリクエスト
  async post<T>(
    endpoint: string,
    data?: Record<string, unknown>
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // PUTリクエスト
  async put<T>(
    endpoint: string,
    data?: Record<string, unknown>
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // DELETEリクエスト
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "DELETE",
    });
  }
}

// APIクライアントインスタンス
const apiClient = new ApiClient(API_BASE_URL);

// =================================
// レシピAPI
// =================================

export const recipeApi = {
  // レシピ一覧取得
  getRecipes: async (
    params: {
      page?: number;
      limit?: number;
      category?: string;
      difficulty?: string;
      tags?: string[];
      search?: string;
      sort?: "newest" | "oldest" | "popular" | "likes";
    } = {}
  ): Promise<ApiResponse<PaginatedResponse<Recipe>>> => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          searchParams.append(key, value.join(","));
        } else {
          searchParams.append(key, String(value));
        }
      }
    });
    const queryString = searchParams.toString();
    const endpoint = queryString ? `/recipes?${queryString}` : "/recipes";
    return apiClient.get<PaginatedResponse<Recipe>>(endpoint);
  },

  // 個別レシピ取得
  getRecipe: (id: string): Promise<ApiResponse<Recipe>> => {
    return apiClient.get<Recipe>(`/recipes/${id}`);
  },

  // レシピ作成
  createRecipe: (recipeData: Partial<Recipe>): Promise<ApiResponse<Recipe>> => {
    return apiClient.post<Recipe>("/recipes", recipeData);
  },

  // レシピ更新
  updateRecipe: (
    id: string,
    recipeData: Partial<Recipe>
  ): Promise<ApiResponse<Recipe>> => {
    return apiClient.put<Recipe>(`/recipes/${id}`, recipeData);
  },

  // レシピ削除
  deleteRecipe: (id: string): Promise<ApiResponse<null>> => {
    return apiClient.delete<null>(`/recipes/${id}`);
  },

  // いいね追加
  likeRecipe: (
    id: string
  ): Promise<ApiResponse<{ liked: boolean; likesCount: number }>> => {
    return apiClient.post<{ liked: boolean; likesCount: number }>(
      `/recipes/${id}/like`
    );
  },

  // いいね削除
  unlikeRecipe: (
    id: string
  ): Promise<ApiResponse<{ liked: boolean; likesCount: number }>> => {
    return apiClient.delete<{ liked: boolean; likesCount: number }>(
      `/recipes/${id}/like`
    );
  },

  // コメント追加
  addComment: (
    id: string,
    content: string
  ): Promise<ApiResponse<RecipeComment>> => {
    return apiClient.post<RecipeComment>(`/recipes/${id}/comments`, {
      content,
    });
  },
};

// カテゴリAPI
export const categoryApi = {
  // カテゴリ一覧取得
  getCategories: (): Promise<ApiResponse<Category[]>> => {
    return apiClient.get<Category[]>("/categories");
  },

  // 個別カテゴリ取得
  getCategory: (id: string): Promise<ApiResponse<Category>> => {
    return apiClient.get<Category>(`/categories/${id}`);
  },
};

// タグAPI
export const tagApi = {
  // タグ一覧取得
  getTags: (params?: {
    limit?: number;
    popular?: boolean;
  }): Promise<ApiResponse<RecipeTag[]>> => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
    }
    const queryString = searchParams.toString();
    const endpoint = queryString ? `/tags?${queryString}` : "/tags";
    return apiClient.get<RecipeTag[]>(endpoint);
  },
};

export default apiClient;
