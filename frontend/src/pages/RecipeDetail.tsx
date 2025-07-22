import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

interface Recipe {
  id: number;
  title: string;
  description: string;
  image: string;
  likes: number;
  level: string;
  category: string;
  author: string;
  time: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  materials: string[];
  tools: string[];
  steps: {
    step: number;
    title: string;
    description: string;
    image?: string;
    tip?: string;
  }[];
  tags: string[];
  createdAt: string;
  views: number;
  comments: {
    id: number;
    author: string;
    content: string;
    date: string;
    likes: number;
  }[];
}

const RecipeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [isLiked, setIsLiked] = useState(false);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [newComment, setNewComment] = useState("");

  // サンプルレシピデータ（実際のアプリではAPIから取得）
  const getRecipeData = (recipeId: string): Recipe | null => {
    const recipes: { [key: string]: Recipe } = {
      "1": {
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
        materials: [
          "2Lペットボトル × 1本",
          "土 × 適量",
          "種または苗 × 1つ",
          "小石または軽石 × 少々",
          "ビニールテープ × 1巻",
          "アクリル絵の具（お好みで）",
        ],
        tools: [
          "カッター",
          "はさみ",
          "ドリル（または千枚通し）",
          "定規",
          "ペン・マーカー",
          "ペイントブラシ（装飾する場合）",
        ],
        steps: [
          {
            step: 1,
            title: "ペットボトルのカット",
            description:
              "ペットボトルを上から1/3の位置でカットします。切り口はなめらかになるようにやすりをかけましょう。",
            tip: "子供と一緒に作る場合は、大人がカット作業を行ってください。",
          },
          {
            step: 2,
            title: "排水穴の作成",
            description:
              "ボトルの底の部分に、ドリルまたは千枚通しで5〜6個の穴をあけます。水はけを良くするための重要な工程です。",
            tip: "穴は直径3-4mm程度が適切です。大きすぎると土が流れ出てしまいます。",
          },
          {
            step: 3,
            title: "装飾（オプション）",
            description:
              "お好みでアクリル絵の具を使ってペットボトルをデコレーションします。完全に乾くまで待ちましょう。",
            tip: "マスキングテープを使えば、きれいな模様を描くことができます。",
          },
          {
            step: 4,
            title: "土と種の準備",
            description:
              "底に小石を敷き、その上に土を入れます。種を植えるか、苗を植えて軽く水をあげましょう。",
            tip: "土は野菜用の培養土を使用することをおすすめします。",
          },
          {
            step: 5,
            title: "完成・管理",
            description:
              "日当たりの良い場所に置き、適度に水やりをしながら育てましょう。成長を楽しみに待ちます！",
            tip: "水やりは土が乾いたらたっぷりと。毎日の観察が成功の秘訣です。",
          },
        ],
        tags: [
          "エコ",
          "ガーデニング",
          "初心者",
          "リサイクル",
          "ペットボトル",
          "野菜",
          "ハーブ",
        ],
        createdAt: "2024-01-15",
        views: 1456,
        comments: [
          {
            id: 1,
            author: "田中みか",
            content:
              "とても分かりやすい説明で、子供と一緒に作ることができました！バジルを植えて、今では料理に使えるほど育っています。",
            date: "2024-01-20",
            likes: 12,
          },
          {
            id: 2,
            author: "佐藤けん",
            content:
              "排水穴のサイズが参考になりました。最初失敗したのですが、アドバイス通りにしたらうまくいきました。",
            date: "2024-01-22",
            likes: 8,
          },
          {
            id: 3,
            author: "山本さくら",
            content:
              "プランターを買う必要がなくて経済的ですね。いろんな野菜で試してみたいと思います！",
            date: "2024-01-25",
            likes: 15,
          },
        ],
      },
      // 他のレシピデータは省略（同じ形式で続く）
      "2": {
        id: 2,
        title: "古着リメイクバッグ",
        description:
          "着なくなった古着を使ったエコバッグの作り方とデザインアイデア",
        image: "bag",
        likes: 89,
        level: "中級",
        category: "衣類・アクセサリー",
        author: "佐藤花子",
        time: "90分",
        difficulty: "intermediate",
        materials: ["古いTシャツ", "糸", "ボタン（オプション）"],
        tools: ["ミシン", "はさみ", "まち針"],
        steps: [
          {
            step: 1,
            title: "デザイン決め",
            description: "どのような形のバッグにするか決めます。",
          },
          { step: 2, title: "パターン作成", description: "型紙を作成します。" },
          {
            step: 3,
            title: "裁断",
            description: "生地を型紙に合わせて裁断します。",
          },
        ],
        tags: ["リメイク", "古着", "バッグ", "中級"],
        createdAt: "2024-01-10",
        views: 890,
        comments: [],
      },
      "3": {
        id: 3,
        title: "廃材ウッドシェルフ",
        description: "廃材を使ったシンプルでおしゃれな壁掛けシェルフの制作方法",
        image: "shelf",
        likes: 156,
        level: "上級",
        category: "家具・インテリア",
        author: "田中和也",
        time: "180分",
        difficulty: "advanced",
        materials: ["廃材（木材）", "ネジ", "L字金具", "ワックス"],
        tools: ["のこぎり", "ドリル", "やすり", "メジャー"],
        steps: [
          {
            step: 1,
            title: "設計",
            description: "シェルフの寸法を決めて設計します。",
          },
          {
            step: 2,
            title: "材料準備",
            description: "廃材を必要なサイズにカットします。",
          },
          {
            step: 3,
            title: "組み立て",
            description: "L字金具を使って組み立てます。",
          },
        ],
        tags: ["廃材", "木工", "シェルフ", "上級"],
        createdAt: "2024-01-05",
        views: 2340,
        comments: [],
      },
    };
    return recipes[recipeId] || null;
  };

  const recipe = getRecipeData(id || "1");

  // Reactフックのルールに従い、条件分岐の前に配置
  useEffect(() => {
    if (recipe) {
      document.title = `${recipe.title} - Makeoo`;
    } else {
      document.title = "レシピが見つかりません - Makeoo";
    }
  }, [recipe]);

  if (!recipe) {
    return (
      <div className="page-content bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center fade-in">
          <div className="w-32 h-32 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-12">
            <svg
              className="w-16 h-16 text-primary-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m-7 4h8M3 20a1 1 0 01-1-1V5a1 1 0 011-1h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a1 1 0 01-1 1z"
              />
            </svg>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
            レシピが見つかりません
          </h2>
          <p className="text-gray-600 text-lg mb-12 leading-relaxed max-w-md mx-auto">
            お探しのレシピは存在しないか、削除された可能性があります。
          </p>
          <Link
            to="/recipes"
            className="btn-primary text-lg px-10 py-4 no-underline"
          >
            レシピ一覧に戻る
          </Link>
        </div>
      </div>
    );
  }

  const handleLike = () => {
    setIsLiked(!isLiked);
    // ここで実際のAPIコールを行う
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      // ここで実際のコメント投稿APIコールを行う
      console.log("New comment:", newComment);
      setNewComment("");
      setShowCommentForm(false);
    }
  };

  const getBgColor = (image: string) => {
    const colorMap: { [key: string]: string } = {
      planter: "from-green-200 to-green-300",
      bag: "from-blue-200 to-blue-300",
      shelf: "from-orange-200 to-orange-300",
    };
    return colorMap[image] || colorMap.planter;
  };

  const getRecipeIcon = (image: string) => {
    const iconMap: { [key: string]: React.ReactElement } = {
      planter: (
        <svg
          className="w-16 h-16 text-green-600"
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
          className="w-16 h-16 text-blue-600"
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
          className="w-16 h-16 text-orange-600"
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
    };
    return iconMap[image] || iconMap.planter;
  };

  return (
    <div className="page-content bg-gray-50 min-h-screen">
      {/* パンくずナビ */}
      <div className="bg-white border-b">
        <div className="container-narrow py-6">
          <nav className="flex space-x-3 text-gray-600 text-lg">
            <Link to="/" className="hover:text-primary-600 transition-colors">
              ホーム
            </Link>
            <span>/</span>
            <Link
              to="/recipes"
              className="hover:text-primary-600 transition-colors"
            >
              レシピ一覧
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">{recipe.title}</span>
          </nav>
        </div>
      </div>

      <div className="container-narrow section-padding-small">
        {/* ヘッダー部分 */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-12 fade-in">
          <div
            className={`h-80 bg-gradient-to-br ${getBgColor(
              recipe.image
            )} flex items-center justify-center`}
          >
            <div className="text-center">
              <div className="w-28 h-28 bg-white bg-opacity-50 rounded-full flex items-center justify-center mx-auto mb-6">
                {getRecipeIcon(recipe.image)}
              </div>
              <span className="text-gray-700 font-semibold text-xl">
                {recipe.category}
              </span>
            </div>
          </div>

          <div className="p-12">
            <div className="flex items-start justify-between mb-8">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 flex-1 pr-6">
                {recipe.title}
              </h1>
              <button
                onClick={handleLike}
                className={`flex items-center space-x-3 px-6 py-3 rounded-lg transition-all text-lg ${
                  isLiked
                    ? "bg-red-50 text-red-600 hover:bg-red-100"
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                }`}
              >
                <svg
                  className={`w-6 h-6 ${
                    isLiked ? "fill-current" : "fill-none"
                  }`}
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                <span>{recipe.likes + (isLiked ? 1 : 0)}</span>
              </button>
            </div>

            <p className="text-gray-700 text-xl mb-10 leading-relaxed">
              {recipe.description}
            </p>

            {/* メタデータ */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-base text-gray-600 mb-2">作成者</div>
                <div className="font-semibold text-lg">{recipe.author}</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-base text-gray-600 mb-2">所要時間</div>
                <div className="font-semibold text-lg">{recipe.time}</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-base text-gray-600 mb-2">難易度</div>
                <div className="font-semibold text-lg">{recipe.level}</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-base text-gray-600 mb-2">閲覧数</div>
                <div className="font-semibold text-lg">
                  {recipe.views.toLocaleString()}
                </div>
              </div>
            </div>

            {/* タグ */}
            <div className="flex flex-wrap gap-3">
              {recipe.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-primary-100 text-primary-700 rounded-full font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 材料と道具 */}
        <div className="grid md:grid-cols-2 gap-12 mb-12">
          <div className="bg-white rounded-xl shadow-lg p-10 slide-up">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 flex items-center">
              <svg
                className="w-7 h-7 mr-3 text-primary-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              必要な材料
            </h2>
            <ul className="space-y-4">
              {recipe.materials.map((material, index) => (
                <li key={index} className="flex items-center text-lg">
                  <span className="w-3 h-3 bg-primary-600 rounded-full mr-4"></span>
                  {material}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-10 slide-up slide-up-delay-1">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 flex items-center">
              <svg
                className="w-7 h-7 mr-3 text-secondary-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              必要な道具
            </h2>
            <ul className="space-y-4">
              {recipe.tools.map((tool, index) => (
                <li key={index} className="flex items-center text-lg">
                  <span className="w-3 h-3 bg-secondary-600 rounded-full mr-4"></span>
                  {tool}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 作り方 */}
        <div className="bg-white rounded-xl shadow-lg p-12 mb-12 slide-up slide-up-delay-2">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 flex items-center">
            <svg
              className="w-8 h-8 mr-4 text-primary-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
            作り方
          </h2>

          <div className="space-y-12">
            {recipe.steps.map((step) => (
              <div key={step.step} className="flex">
                <div className="flex-shrink-0 w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-xl mr-8">
                  {step.step}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {step.title}
                  </h3>
                  <p className="text-gray-700 text-lg mb-6 leading-relaxed">
                    {step.description}
                  </p>
                  {step.tip && (
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded">
                      <div className="flex items-center mb-3">
                        <svg
                          className="w-5 h-5 text-yellow-600 mr-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span className="font-medium text-yellow-600">
                          コツ・ポイント
                        </span>
                      </div>
                      <p className="text-yellow-700 leading-relaxed">
                        {step.tip}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* コメントセクション */}
        <div className="bg-white rounded-xl shadow-lg p-12 mb-12 fade-in">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              コメント ({recipe.comments.length})
            </h2>
            <button
              onClick={() => setShowCommentForm(!showCommentForm)}
              className="btn-primary text-lg px-8 py-4"
            >
              コメントを投稿
            </button>
          </div>

          {showCommentForm && (
            <form
              onSubmit={handleCommentSubmit}
              className="mb-10 p-6 bg-gray-50 rounded-lg"
            >
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="コメントを入力してください..."
                className="input-field mb-6 min-h-[120px] resize-none text-lg"
                required
              />
              <div className="flex gap-4">
                <button type="submit" className="btn-primary">
                  投稿する
                </button>
                <button
                  type="button"
                  onClick={() => setShowCommentForm(false)}
                  className="btn-secondary"
                >
                  キャンセル
                </button>
              </div>
            </form>
          )}

          <div className="space-y-8">
            {recipe.comments.map((comment) => (
              <div key={comment.id} className="border-b pb-8 last:border-b-0">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center mr-4">
                      <svg
                        className="w-6 h-6 text-gray-600"
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
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 text-lg">
                        {comment.author}
                      </div>
                      <div className="text-gray-500">{comment.date}</div>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-500">
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
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                    {comment.likes}
                  </div>
                </div>
                <p className="text-gray-700 text-lg leading-relaxed">
                  {comment.content}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 関連レシピ */}
        <div className="bg-white rounded-xl shadow-lg p-12 fade-in">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-10">
            関連するレシピ
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Link to="/recipe/2" className="group">
              <div className="bg-gray-100 rounded-lg p-6 group-hover:bg-gray-200 transition-colors">
                <h3 className="font-semibold text-lg mb-3">
                  古着リメイクバッグ
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  着なくなった古着を再利用...
                </p>
              </div>
            </Link>
            <Link to="/recipe/3" className="group">
              <div className="bg-gray-100 rounded-lg p-6 group-hover:bg-gray-200 transition-colors">
                <h3 className="font-semibold text-lg mb-3">
                  廃材ウッドシェルフ
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  廃材を使ったおしゃれな...
                </p>
              </div>
            </Link>
            <div className="flex items-center justify-center">
              <Link
                to="/recipes"
                className="text-primary-600 hover:text-primary-700 font-medium text-lg"
              >
                さらに見る →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;
