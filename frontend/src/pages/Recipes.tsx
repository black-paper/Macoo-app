import React, { useEffect, useState, type JSX } from "react";
import { Link } from "react-router-dom";

const Recipes: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedLevel, setSelectedLevel] = useState<string>("all");

  useEffect(() => {
    document.title = "レシピ一覧 - Makeoo";
  }, []);

  // サンプルレシピデータ
  const recipes = [
    {
      id: 1,
      title: "ペットボトルプランター",
      description:
        "使い終わったペットボトルを活用した環境に優しいプランターの作り方。初心者でも簡単に作れて、お家で野菜やハーブを育てることができます。",
      image: "planter",
      likes: 124,
      level: "初級",
      category: "ガーデニング",
      author: "山田太郎",
      time: "30分",
      difficulty: "beginner",
    },
    {
      id: 2,
      title: "古着リメイクバッグ",
      description:
        "着なくなった古着を使ったエコバッグの作り方とデザインアイデア。お気に入りの服を新しい形で生まれ変わらせましょう。",
      image: "bag",
      likes: 89,
      level: "中級",
      category: "衣類・アクセサリー",
      author: "佐藤花子",
      time: "90分",
      difficulty: "intermediate",
    },
    {
      id: 3,
      title: "廃材ウッドシェルフ",
      description:
        "廃材を使ったシンプルでおしゃれな壁掛けシェルフの制作方法。工具の使い方も詳しく説明しています。",
      image: "shelf",
      likes: 156,
      level: "上級",
      category: "家具・インテリア",
      author: "田中和也",
      time: "180分",
      difficulty: "advanced",
    },
    {
      id: 4,
      title: "カーペット端材でコースター",
      description:
        "カーペットの端材を使った可愛いコースターの作り方。短時間で作れるのでプレゼントにもおすすめです。",
      image: "coaster",
      likes: 67,
      level: "初級",
      category: "家具・インテリア",
      author: "鈴木みか",
      time: "45分",
      difficulty: "beginner",
    },
    {
      id: 5,
      title: "段ボール収納ボックス",
      description:
        "段ボールをおしゃれに変身させる収納ボックスのDIY。子供と一緒に作れる楽しいプロジェクトです。",
      image: "storage",
      likes: 203,
      level: "中級",
      category: "収納・整理",
      author: "高橋一郎",
      time: "120分",
      difficulty: "intermediate",
    },
    {
      id: 6,
      title: "ワイン瓶キャンドルホルダー",
      description:
        "ワインボトルを再利用したおしゃれなキャンドルホルダー。ロマンチックな雰囲気作りにぴったりです。",
      image: "candle",
      likes: 91,
      level: "中級",
      category: "ライト・照明",
      author: "中村さくら",
      time: "60分",
      difficulty: "intermediate",
    },
  ];

  const categories = [
    "all",
    "ガーデニング",
    "衣類・アクセサリー",
    "家具・インテリア",
    "収納・整理",
    "ライト・照明",
  ];

  const filteredRecipes = recipes.filter((recipe) => {
    const categoryMatch =
      selectedCategory === "all" || recipe.category === selectedCategory;
    const levelMatch =
      selectedLevel === "all" || recipe.difficulty === selectedLevel;
    return categoryMatch && levelMatch;
  });

  const getRecipeIcon = (image: string) => {
    const iconMap: { [key: string]: JSX.Element } = {
      planter: (
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
      bag: (
        <svg
          className="w-10 h-10 text-blue-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
          />
        </svg>
      ),
      shelf: (
        <svg
          className="w-10 h-10 text-orange-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
      ),
      coaster: (
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
            d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
          />
        </svg>
      ),
      storage: (
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
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
          />
        </svg>
      ),
      candle: (
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
    return iconMap[image] || iconMap.planter;
  };

  const getBgColor = (image: string) => {
    const colorMap: { [key: string]: string } = {
      planter: "from-green-200 to-green-300",
      bag: "from-blue-200 to-blue-300",
      shelf: "from-orange-200 to-orange-300",
      coaster: "from-purple-200 to-purple-300",
      storage: "from-gray-200 to-gray-300",
      candle: "from-yellow-200 to-yellow-300",
    };
    return colorMap[image] || colorMap.planter;
  };

  const getLevelColor = (level: string) => {
    const levelColors: { [key: string]: string } = {
      初級: "text-primary-600 bg-primary-50",
      中級: "text-blue-600 bg-blue-50",
      上級: "text-orange-600 bg-orange-50",
    };
    return levelColors[level] || levelColors["初級"];
  };

  return (
    <div className="page-content bg-gray-50 min-h-screen">
      <div className="container-custom section-padding-small">
        {/* ヘッダー */}
        <div className="text-center mb-16 fade-in">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            DIYレシピ一覧
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto">
            環境に優しいDIYレシピを探してみましょう
          </p>
        </div>

        {/* フィルター */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12 slide-up">
          <div className="grid md:grid-cols-2 gap-8">
            {/* カテゴリフィルター */}
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-4">
                カテゴリ
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="input-field text-lg"
              >
                <option value="all">すべて</option>
                {categories.slice(1).map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* レベルフィルター */}
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-4">
                難易度
              </label>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="input-field text-lg"
              >
                <option value="all">すべて</option>
                <option value="beginner">初級</option>
                <option value="intermediate">中級</option>
                <option value="advanced">上級</option>
              </select>
            </div>
          </div>
        </div>

        {/* レシピ一覧 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12 mb-16">
          {filteredRecipes.map((recipe, index) => (
            <Link
              key={recipe.id}
              to={`/recipe/${recipe.id}`}
              className={`card hover:shadow-xl transition-all duration-500 zoom-in no-underline group ${
                index % 3 === 1
                  ? "fade-in-delay-1"
                  : index % 3 === 2
                  ? "fade-in-delay-2"
                  : ""
              }`}
            >
              <div
                className={`h-56 bg-gradient-to-br ${getBgColor(
                  recipe.image
                )} rounded-lg mb-6 flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform duration-500`}
              >
                <div className="text-gray-600 text-center">
                  <div className="w-20 h-20 bg-white bg-opacity-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    {getRecipeIcon(recipe.image)}
                  </div>
                  <span className="text-base font-medium">
                    {recipe.title.split(/[・をで]/)[0]}
                  </span>
                </div>
              </div>

              <h4 className="text-xl font-semibold mb-4 text-gray-900">
                {recipe.title}
              </h4>
              <p className="text-gray-600 mb-6 line-clamp-3 leading-relaxed">
                {recipe.description}
              </p>

              <div className="flex items-center justify-between mb-4 text-base">
                <span className="flex items-center text-gray-500">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  {recipe.author}
                </span>
                <span className="flex items-center text-gray-500">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {recipe.time}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center text-gray-500 hover:text-red-500 transition-colors cursor-pointer">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {recipe.likes}
                </span>
                <span
                  className={`text-base font-medium px-4 py-2 rounded-lg ${getLevelColor(
                    recipe.level
                  )}`}
                >
                  {recipe.level}
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* CTAセクション */}
        <div className="text-center fade-in">
          <div className="bg-white rounded-xl shadow-lg p-12">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              あなたのレシピを投稿しませんか？
            </h3>
            <p className="text-gray-600 text-lg mb-10 leading-relaxed max-w-2xl mx-auto">
              素敵なDIYアイデアをコミュニティと共有して、みんなでエコフレンドリーな暮らしを広めましょう
            </p>
            <button className="btn-primary text-lg px-10 py-4">
              レシピを投稿する
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recipes;
