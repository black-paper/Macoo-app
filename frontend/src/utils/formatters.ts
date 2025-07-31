/**
 * フォーマット関連のユーティリティ関数
 */

import type { Recipe } from "../services/api";

// 日本語の難易度表示
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

// 時間表示のフォーマット
export const formatTime = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes}分`;
  } else {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0
      ? `${hours}時間${remainingMinutes}分`
      : `${hours}時間`;
  }
};

// 日付フォーマット
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// API エラーハンドリング
export const handleApiError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return "エラーが発生しました。しばらく時間をおいて再度お試しください。";
};
