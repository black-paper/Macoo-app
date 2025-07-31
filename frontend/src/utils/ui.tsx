/**
 * UI関連のユーティリティ関数
 */

import React from "react";
import type { Recipe } from "../services/api";

// ページタイトル設定
export const setPageTitle = (
  title: string,
  suffix: string = "Makeoo"
): void => {
  document.title = `${title} - ${suffix}`;
};

// レシピアイコン取得
export const getRecipeIcon = (
  categoryIconName?: string
): React.ReactElement => {
  const iconMap: { [key: string]: React.ReactElement } = {
    leaf: (
      <svg
        className="w-10 h-10 text-green-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
        />
      </svg>
    ),
    hammer: (
      <svg
        className="w-10 h-10 text-gray-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
        />
      </svg>
    ),
    palette: (
      <svg
        className="w-10 h-10 text-purple-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM7 3C5.343 3 4 4.343 4 6s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zM11 6h10M11 12h10M11 18h10"
        />
      </svg>
    ),
    lightbulb: (
      <svg
        className="w-10 h-10 text-yellow-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 1-4 4-4s4 2 4 4c2-1 2.657-2.657 2.657-2.657a8 8 0 01-2 11.314z"
        />
      </svg>
    ),
  };
  return iconMap[categoryIconName || "leaf"] || iconMap.leaf;
};

// カテゴリ背景色取得
export const getBgColor = (colorCode?: string): string => {
  if (!colorCode) return "from-green-200 to-green-300";

  // カラーコードから適切なグラデーションを生成
  const colorMap: { [key: string]: string } = {
    "#22c55e": "from-green-200 to-green-300",
    "#3b82f6": "from-blue-200 to-blue-300",
    "#f97316": "from-orange-200 to-orange-300",
    "#6b7280": "from-gray-200 to-gray-300",
    "#fbbf24": "from-yellow-200 to-yellow-300",
  };

  return colorMap[colorCode] || "from-green-200 to-green-300";
};

// 難易度レベルの色取得
export const getLevelColor = (difficulty: Recipe["difficulty"]): string => {
  const levelColors: { [key: string]: string } = {
    beginner: "text-primary-600 bg-primary-50",
    intermediate: "text-blue-600 bg-blue-50",
    advanced: "text-orange-600 bg-orange-50",
  };
  return levelColors[difficulty] || levelColors.beginner;
};
