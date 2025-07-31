/**
 * useRecipesフックのテスト
 */

import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Category } from "../../services/api";
import * as api from "../../services/api";
import { useRecipes } from "../useRecipes";

// API関数をモック
vi.mock("../../services/api", () => ({
  categoryApi: {
    getCategories: vi.fn(),
  },
  recipeApi: {
    getRecipes: vi.fn(),
  },
}));

describe("useRecipes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockCategories: Category[] = [
    {
      id: "1",
      name: "DIY家具",
      slug: "diy-furniture",
      description: "家具作りのDIYレシピ",
      iconName: "home",
      colorCode: "#8B5CF6",
      recipesCount: 10,
      sortOrder: 1,
    },
  ];

  it("初期化時にカテゴリとレシピを取得する", async () => {
    vi.mocked(api.categoryApi.getCategories).mockResolvedValue({
      success: true,
      data: [],
    });
    vi.mocked(api.recipeApi.getRecipes).mockResolvedValue({
      success: true,
      data: {
        data: [],
        pagination: {
          currentPage: 1,
          totalPages: 0,
          totalItems: 0,
          hasNext: false,
          hasPrev: false,
        },
      },
    });

    const { result } = renderHook(() => useRecipes());

    expect(result.current.loading).toBe(true);

    // Promise が解決されるまで待機
    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(result.current.loading).toBe(false);
    expect(api.categoryApi.getCategories).toHaveBeenCalledOnce();
    expect(api.recipeApi.getRecipes).toHaveBeenCalledOnce();
  });

  it("フィルタ設定が正しく動作する", async () => {
    vi.mocked(api.categoryApi.getCategories).mockResolvedValue({
      success: true,
      data: mockCategories,
    });
    vi.mocked(api.recipeApi.getRecipes).mockResolvedValue({
      success: true,
      data: {
        data: [],
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalItems: 1,
          hasNext: false,
          hasPrev: false,
        },
      },
    });

    const { result } = renderHook(() => useRecipes());

    // Promise が解決されるまで待機
    await new Promise((resolve) => setTimeout(resolve, 100));

    // フィルタリングをテスト
    result.current.setSelectedCategory("1");
    result.current.setSelectedLevel("beginner");

    expect(result.current.selectedCategory).toBe("1");
    expect(result.current.selectedLevel).toBe("beginner");
  });

  it("ページネーションが正しく動作する", async () => {
    vi.mocked(api.categoryApi.getCategories).mockResolvedValue({
      success: true,
      data: mockCategories,
    });
    vi.mocked(api.recipeApi.getRecipes).mockResolvedValue({
      success: true,
      data: {
        data: [],
        pagination: {
          currentPage: 2,
          totalPages: 5,
          totalItems: 50,
          hasNext: true,
          hasPrev: true,
        },
      },
    });

    const { result } = renderHook(() => useRecipes());

    // Promise が解決されるまで待機
    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(result.current.pagination.currentPage).toBe(2);
    expect(result.current.pagination.totalPages).toBe(5);
    expect(result.current.pagination.hasNext).toBe(true);
    expect(result.current.pagination.hasPrev).toBe(true);
  });
});
