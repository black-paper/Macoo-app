/**
 * レシピ詳細のロジックを管理するカスタムフック
 */

import { useEffect, useState } from "react";
import { recipeApi, type Recipe } from "../services/api";
import { handleApiError, setPageTitle } from "../utils";

interface UseRecipeDetailReturn {
  recipe: Recipe | null;
  loading: boolean;
  error: string | null;
  isLiked: boolean;
  showCommentForm: boolean;
  newComment: string;
  submittingComment: boolean;
  setShowCommentForm: (show: boolean) => void;
  setNewComment: (comment: string) => void;
  handleLike: () => Promise<void>;
  handleCommentSubmit: () => Promise<void>;
  toggleCommentForm: () => void;
  retryFetch: () => Promise<void>;
}

export const useRecipeDetail = (slug?: string): UseRecipeDetailReturn => {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);

  const fetchRecipe = async (identifier: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await recipeApi.getRecipe(identifier);

      if (response.success && response.data) {
        // バックエンドレスポンスの構造対応
        const actualData = response.data;
        setRecipe(actualData);
        setPageTitle(actualData.title);
      } else {
        setError("レシピが見つかりません");
        setPageTitle("レシピが見つかりません");
      }
    } catch (err) {
      setError(handleApiError(err));
      setPageTitle("レシピが見つかりません");
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!recipe) return;

    try {
      const response = isLiked
        ? await recipeApi.unlikeRecipe(recipe.id)
        : await recipeApi.likeRecipe(recipe.id);

      if (response.success) {
        setIsLiked(response.data?.liked || false);
        setRecipe((prev) =>
          prev
            ? {
                ...prev,
                likesCount: response.data?.likesCount || 0,
              }
            : null
        );
      }
    } catch (err) {
      console.error("いいね処理でエラーが発生しました:", err);
    }
  };

  const handleCommentSubmit = async () => {
    if (!recipe || !newComment.trim()) return;

    try {
      setSubmittingComment(true);
      const response = await recipeApi.addComment(recipe.id, newComment.trim());

      if (response.success) {
        // コメント追加後、レシピを再取得
        await fetchRecipe(recipe.id);
        setNewComment("");
        setShowCommentForm(false);
      }
    } catch (err) {
      console.error("コメント投稿でエラーが発生しました:", err);
    } finally {
      setSubmittingComment(false);
    }
  };

  const toggleCommentForm = () => {
    setShowCommentForm(!showCommentForm);
  };

  const retryFetch = async () => {
    if (slug) {
      await fetchRecipe(slug);
    }
  };

  useEffect(() => {
    if (slug) {
      fetchRecipe(slug);
    }
  }, [slug]);

  return {
    recipe,
    loading,
    error,
    isLiked,
    showCommentForm,
    newComment,
    submittingComment,
    setShowCommentForm,
    setNewComment,
    handleLike,
    handleCommentSubmit,
    toggleCommentForm,
    retryFetch,
  };
};
