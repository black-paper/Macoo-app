/**
 * レシピ画像カルーセルコンポーネント
 */

import React, { useState } from "react";

interface RecipeImageCarouselProps {
  images?: string[];
  title?: string;
}

const RecipeImageCarousel: React.FC<RecipeImageCarouselProps> = ({
  images = [],
  title = "レシピ画像",
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // モック画像データ（実際の画像がない場合）
  const mockImages = [
    {
      url: "/api/placeholder/800/600",
      alt: "ステップ1: ペットボトルの準備",
      description: "ペットボトルをよく洗い、ラベルを剥がします。",
    },
    {
      url: "/api/placeholder/800/600",
      alt: "ステップ2: 排水穴を開ける",
      description: "ペットボトルの底に5-6箇所、直径5mm程度の穴を開けます。",
    },
    {
      url: "/api/placeholder/800/600",
      alt: "ステップ3: ボトルを切る",
      description: "ペットボトルの上部3分の1をカッターで切り取ります。",
    },
    {
      url: "/api/placeholder/800/600",
      alt: "完成品",
      description: "培養土を入れて植物を植えた完成品です。",
    },
  ];

  const displayImages =
    images.length > 0
      ? images.map((img, i) => ({
          url: img,
          alt: `${title} ${i + 1}`,
          description: `${title}の画像 ${i + 1}`,
        }))
      : mockImages;

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % displayImages.length);
  };

  const prevImage = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + displayImages.length) % displayImages.length
    );
  };

  const goToImage = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="relative bg-gray-100 rounded-2xl overflow-hidden shadow-lg">
      {/* メイン画像 */}
      <div className="relative aspect-video bg-gradient-to-br from-gray-200 to-gray-300">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl text-gray-400 mb-4">📷</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {displayImages[currentIndex].alt}
            </h3>
            <p className="text-gray-500 max-w-md mx-auto px-4">
              {displayImages[currentIndex].description}
            </p>
          </div>
        </div>

        {/* 画像ナビゲーションボタン */}
        {displayImages.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-700 p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
              aria-label="前の画像"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-700 p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
              aria-label="次の画像"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </>
        )}

        {/* 画像インデックス表示 */}
        {displayImages.length > 1 && (
          <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
            {currentIndex + 1} / {displayImages.length}
          </div>
        )}
      </div>

      {/* サムネイル */}
      {displayImages.length > 1 && (
        <div className="p-4 bg-white">
          <div className="flex space-x-3 overflow-x-auto pb-2">
            {displayImages.map((_, index) => (
              <button
                key={index}
                onClick={() => goToImage(index)}
                className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                  index === currentIndex
                    ? "border-primary-500 shadow-lg scale-105"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                aria-label={`画像 ${index + 1}を表示`}
              >
                <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <div className="text-gray-400 text-sm">{index + 1}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipeImageCarousel;
