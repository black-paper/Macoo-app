import React, { useEffect } from "react";

const About: React.FC = () => {
  useEffect(() => {
    document.title = "Makeooとは - Makeoo";
  }, []);

  return (
    <div className="page-content bg-gray-50 min-h-screen">
      <div className="container-narrow section-padding">
        {/* ヘッダー */}
        <div className="text-center mb-24 fade-in">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-10">
            Makeooとは
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            環境に優しいDIYレシピを通じて、持続可能な暮らしを提案するプラットフォームです
          </p>
        </div>

        {/* ミッション */}
        <div className="bg-white rounded-xl shadow-lg p-16 mb-20 slide-up">
          <div className="flex items-center mb-12">
            <div className="w-20 h-20 bg-primary-100 rounded-lg flex items-center justify-center mr-8">
              <svg
                className="w-10 h-10 text-primary-600"
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
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              私たちのミッション
            </h2>
          </div>
          <p className="text-gray-700 text-xl md:text-2xl leading-relaxed">
            Makeooは「Make
            eco」、つまり「エコを作ろう」という想いから生まれました。
            日々の生活の中で出る廃材や不用品を、創造性豊かなDIYプロジェクトに変身させることで、
            環境への負荷を減らしながら、手作りの喜びを分かち合うことを目指しています。
          </p>
        </div>

        {/* 価値観 */}
        <div className="grid md:grid-cols-3 gap-16 mb-24">
          <div className="bg-white rounded-xl shadow-lg p-12 text-center zoom-in">
            <div className="w-28 h-28 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-10">
              <svg
                className="w-14 h-14 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold mb-8 text-gray-900">
              持続可能性
            </h3>
            <p className="text-gray-600 text-lg leading-relaxed">
              リサイクル・アップサイクルを通じて、資源を大切に使い続ける文化を育てます
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-12 text-center zoom-in fade-in-delay-1">
            <div className="w-28 h-28 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-10">
              <svg
                className="w-14 h-14 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold mb-8 text-gray-900">
              コミュニティ
            </h3>
            <p className="text-gray-600 text-lg leading-relaxed">
              DIY愛好者同士が知識とアイデアを共有し、お互いに学び合える場を提供します
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-12 text-center zoom-in fade-in-delay-2">
            <div className="w-28 h-28 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-10">
              <svg
                className="w-14 h-14 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold mb-8 text-gray-900">
              創造性
            </h3>
            <p className="text-gray-600 text-lg leading-relaxed">
              一人ひとりの創造力を大切にし、個性豊かなアイデアが生まれる環境を作ります
            </p>
          </div>
        </div>

        {/* チーム紹介 */}
        <div className="bg-white rounded-xl shadow-lg p-16 mb-20 slide-up slide-up-delay-1">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-16 text-center">
            私たちのチーム
          </h2>
          <div className="grid md:grid-cols-2 gap-16">
            <div className="text-center">
              <div className="w-36 h-36 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full mx-auto mb-10 flex items-center justify-center">
                <svg
                  className="w-18 h-18 text-white"
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
              <h3 className="text-2xl font-semibold mb-8">開発チーム</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                環境問題とテクノロジーに情熱を持つエンジニアたちが、
                使いやすく美しいプラットフォームを開発しています
              </p>
            </div>

            <div className="text-center">
              <div className="w-36 h-36 bg-gradient-to-br from-secondary-400 to-secondary-600 rounded-full mx-auto mb-10 flex items-center justify-center">
                <svg
                  className="w-18 h-18 text-white"
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
              </div>
              <h3 className="text-2xl font-semibold mb-8">DIYアドバイザー</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                経験豊富なDIY職人やデザイナーが、
                安全で実用的なレシピの監修とコミュニティサポートを行っています
              </p>
            </div>
          </div>
        </div>

        {/* 統計情報 */}
        <div className="bg-primary-600 rounded-xl shadow-lg p-16 mb-20 text-white slide-up slide-up-delay-2">
          <h2 className="text-3xl md:text-4xl font-bold mb-16 text-center">
            Makeooの実績
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-6">2,450+</div>
              <div className="text-primary-100 text-lg">投稿レシピ数</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-6">12,000+</div>
              <div className="text-primary-100 text-lg">登録ユーザー数</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-6">85,000+</div>
              <div className="text-primary-100 text-lg">月間閲覧数</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-6">340kg</div>
              <div className="text-primary-100 text-lg">削減廃棄物量</div>
            </div>
          </div>
        </div>

        {/* お問い合わせ */}
        <div className="bg-white rounded-xl shadow-lg p-16 text-center fade-in">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-10">
            一緒にエコな未来を作りませんか？
          </h2>
          <p className="text-gray-600 text-lg mb-16 leading-relaxed max-w-2xl mx-auto">
            ご質問、ご提案、パートナーシップに関するお問い合わせなど、
            お気軽にご連絡ください
          </p>
          <div className="flex flex-col sm:flex-row gap-8 justify-center">
            <button className="btn-primary text-lg px-12 py-4">
              お問い合わせ
            </button>
            <button className="btn-secondary text-lg px-12 py-4">
              コミュニティに参加
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
