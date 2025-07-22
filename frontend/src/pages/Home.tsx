import React, { useEffect } from "react";
import { Link } from "react-router-dom";

const Home: React.FC = () => {
  useEffect(() => {
    document.title = "Makeoo - エコフレンドリーなDIYレシピプラットフォーム";
  }, []);

  return (
    <div className="page-content">
      {/* ヒーローセクション */}
      <section className="bg-gradient-to-br from-primary-50 to-primary-100 section-padding">
        <div className="container-custom text-center">
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-8 slide-up">
            環境に優しい<span className="text-primary-600">DIY</span>を<br />
            みんなでシェアしよう
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto slide-up slide-up-delay-1 leading-relaxed">
            Makeooは、手作りの楽しさと環境への配慮を両立する
            <br className="hidden md:block" />
            DIYレシピ投稿・閲覧プラットフォームです
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center slide-up slide-up-delay-2">
            <Link
              to="/recipes"
              className="btn-primary text-lg px-10 py-4 no-underline"
            >
              レシピを投稿する
            </Link>
            <Link
              to="/recipes"
              className="btn-secondary text-lg px-10 py-4 no-underline"
            >
              レシピを探す
            </Link>
          </div>
        </div>
      </section>

      {/* 特徴紹介セクション */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <h3 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-16 fade-in">
            Makeooの特徴
          </h3>
          <div className="grid md:grid-cols-3 gap-12">
            {/* 特徴1 */}
            <div className="card text-center zoom-in">
              <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-8">
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
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h4 className="text-2xl font-semibold mb-6">豊富なレシピ</h4>
              <p className="text-gray-600 text-lg leading-relaxed">
                初心者から上級者まで、様々なレベルのDIYレシピを投稿・閲覧できます
              </p>
            </div>

            {/* 特徴2 */}
            <div className="card text-center zoom-in fade-in-delay-1">
              <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-8">
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
                    d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9"
                  />
                </svg>
              </div>
              <h4 className="text-2xl font-semibold mb-6">エコフレンドリー</h4>
              <p className="text-gray-600 text-lg leading-relaxed">
                環境に配慮した材料や手法を使ったDIYレシピに特化しています
              </p>
            </div>

            {/* 特徴3 */}
            <div className="card text-center zoom-in fade-in-delay-2">
              <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-8">
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
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h4 className="text-2xl font-semibold mb-6">コミュニティ</h4>
              <p className="text-gray-600 text-lg leading-relaxed">
                いいねやコメント機能で、DIY好きな仲間と交流できます
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 人気レシピセクション */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <h3 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-16 fade-in">
            人気のレシピ
          </h3>
          <div className="grid md:grid-cols-3 gap-12">
            {/* サンプルレシピカード1 */}
            <Link
              to="/recipe/1"
              className="card hover:shadow-xl transition-all duration-500 zoom-in no-underline group"
            >
              <div className="h-56 bg-gradient-to-br from-green-200 to-green-300 rounded-lg mb-6 flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform duration-500">
                <div className="text-gray-600 text-center">
                  <div className="w-20 h-20 bg-white bg-opacity-50 rounded-full flex items-center justify-center mx-auto mb-4">
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
                  </div>
                  <span className="text-base font-medium">プランター</span>
                </div>
              </div>
              <h4 className="text-xl font-semibold mb-4 text-gray-900">
                ペットボトルプランター
              </h4>
              <p className="text-gray-600 mb-6 line-clamp-2 leading-relaxed">
                使い終わったペットボトルを活用した環境に優しいプランターの作り方
              </p>
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
                  124
                </span>
                <span className="text-primary-600 font-medium bg-primary-50 px-4 py-2 rounded-lg">
                  初級
                </span>
              </div>
            </Link>

            {/* サンプルレシピカード2 */}
            <Link
              to="/recipe/2"
              className="card hover:shadow-xl transition-all duration-500 zoom-in fade-in-delay-1 no-underline group"
            >
              <div className="h-56 bg-gradient-to-br from-blue-200 to-blue-300 rounded-lg mb-6 flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform duration-500">
                <div className="text-gray-600 text-center">
                  <div className="w-20 h-20 bg-white bg-opacity-50 rounded-full flex items-center justify-center mx-auto mb-4">
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
                  </div>
                  <span className="text-base font-medium">エコバッグ</span>
                </div>
              </div>
              <h4 className="text-xl font-semibold mb-4 text-gray-900">
                古着リメイクバッグ
              </h4>
              <p className="text-gray-600 mb-6 line-clamp-2 leading-relaxed">
                着なくなった古着を使ったエコバッグの作り方とデザインアイデア
              </p>
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
                  89
                </span>
                <span className="text-blue-600 font-medium bg-blue-50 px-4 py-2 rounded-lg">
                  中級
                </span>
              </div>
            </Link>

            {/* サンプルレシピカード3 */}
            <Link
              to="/recipe/3"
              className="card hover:shadow-xl transition-all duration-500 zoom-in fade-in-delay-2 no-underline group"
            >
              <div className="h-56 bg-gradient-to-br from-orange-200 to-orange-300 rounded-lg mb-6 flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform duration-500">
                <div className="text-gray-600 text-center">
                  <div className="w-20 h-20 bg-white bg-opacity-50 rounded-full flex items-center justify-center mx-auto mb-4">
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
                  </div>
                  <span className="text-base font-medium">ウッドシェルフ</span>
                </div>
              </div>
              <h4 className="text-xl font-semibold mb-4 text-gray-900">
                廃材ウッドシェルフ
              </h4>
              <p className="text-gray-600 mb-6 line-clamp-2 leading-relaxed">
                廃材を使ったシンプルでおしゃれな壁掛けシェルフの制作方法
              </p>
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
                  156
                </span>
                <span className="text-orange-600 font-medium bg-orange-50 px-4 py-2 rounded-lg">
                  上級
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* CTAセクション */}
      <section className="section-padding bg-primary-600">
        <div className="container-narrow text-center fade-in">
          <h3 className="text-4xl md:text-5xl font-bold text-white mb-8 slide-up">
            今すぐMakeooを始めよう
          </h3>
          <p className="text-primary-100 text-xl md:text-2xl mb-12 slide-up slide-up-delay-1 leading-relaxed">
            あなただけのエコフレンドリーなDIYレシピを投稿して、
            コミュニティと共有しましょう
          </p>
          <Link
            to="/auth/register"
            className="bg-white text-primary-600 font-semibold px-12 py-4 rounded-lg hover:bg-gray-100 transition-all duration-300 hover:scale-110 pulse-glow slide-up slide-up-delay-2 no-underline inline-block text-xl"
          >
            無料で始める
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
