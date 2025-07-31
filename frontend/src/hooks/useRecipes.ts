/**
 * レシピ一覧のロジックを管理するカスタムフック
 */

import { useEffect, useState } from "react";
import {
  categoryApi,
  recipeApi,
  type Category,
  type Recipe,
} from "../services/api";
import { handleApiError } from "../utils";

interface UseRecipesState {
  recipes: Recipe[];
  categories: Category[];
  loading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

interface UseRecipesReturn extends UseRecipesState {
  setSelectedCategory: (category: string) => void;
  setSelectedLevel: (level: string) => void;
  selectedCategory: string;
  selectedLevel: string;
  fetchRecipes: (page?: number) => Promise<void>;
  retryFetch: () => Promise<void>;
}

export const useRecipes = (): UseRecipesReturn => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 0,
    totalItems: 0,
    hasNext: false,
    hasPrev: false,
  });

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      setError(null);

      // カテゴリとレシピを並行取得
      const [categoriesResponse, recipesResponse] = await Promise.all([
        categoryApi.getCategories(),
        recipeApi.getRecipes({
          page: 1,
          limit: 12,
          sort: "newest",
        }),
      ]);

      if (categoriesResponse.success && recipesResponse.success) {
        // バックエンドレスポンスの構造: { success: true, data: [...] }
        // ApiClientが返す構造: { success: true, data: { success: true, data: [...] } }
        const actualCategories = categoriesResponse.data;
        const actualRecipes = recipesResponse.data;

        setCategories(Array.isArray(actualCategories) ? actualCategories : []);
        setRecipes(actualRecipes?.data || []);
        setPagination(
          actualRecipes?.pagination || {
            currentPage: 1,
            totalPages: 0,
            totalItems: 0,
            hasNext: false,
            hasPrev: false,
          }
        );
      } else {
        setError("データの取得に失敗しました");
      }
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const fetchRecipes = async (page: number = 1) => {
    try {
      setLoading(true);
      setError(null);

      interface RecipeParams {
        page: number;
        limit: number;
        sort: "newest" | "oldest" | "popular" | "likes";
        category?: string;
        difficulty?: string;
      }

      const params: RecipeParams = {
        page,
        limit: 12,
        sort: "newest",
      };

      if (selectedCategory !== "all") {
        params.category = selectedCategory;
      }

      if (selectedLevel !== "all") {
        params.difficulty = selectedLevel;
      }

      const response = await recipeApi.getRecipes(params);

      if (response.success) {
        // バックエンドレスポンスの構造対応
        const actualData = response.data;
        setRecipes(actualData?.data || []);
        setPagination(
          actualData?.pagination || {
            currentPage: 1,
            totalPages: 0,
            totalItems: 0,
            hasNext: false,
            hasPrev: false,
          }
        );
      } else {
        setError("レシピの取得に失敗しました");
      }
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  // 初期データ取得
  useEffect(() => {
    fetchInitialData();
  }, []);

  // フィルター変更時にレシピを再取得
  useEffect(() => {
    if (categories.length > 0) {
      fetchRecipes();
    }
  }, [selectedCategory, selectedLevel]);

  const retryFetch = async () => {
    await fetchInitialData();
  };

  return {
    recipes,
    categories,
    loading,
    error,
    pagination,
    selectedCategory,
    selectedLevel,
    setSelectedCategory,
    setSelectedLevel,
    fetchRecipes,
    retryFetch,
  };
};
