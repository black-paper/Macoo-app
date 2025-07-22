import React, { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";

const Layout: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";

      // フォーカストラップ
      const focusableElements =
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
      const modal = document.querySelector("#mobile-menu");
      const firstFocusableElement = modal?.querySelectorAll(
        focusableElements
      )[0] as HTMLElement;
      const focusableContent = modal?.querySelectorAll(focusableElements);
      const lastFocusableElement = focusableContent?.[
        focusableContent.length - 1
      ] as HTMLElement;

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          setIsMobileMenuOpen(false);
        }
        if (e.key === "Tab") {
          if (e.shiftKey) {
            if (document.activeElement === firstFocusableElement) {
              lastFocusableElement?.focus();
              e.preventDefault();
            }
          } else {
            if (document.activeElement === lastFocusableElement) {
              firstFocusableElement?.focus();
              e.preventDefault();
            }
          }
        }
      };

      document.addEventListener("keydown", handleKeyDown);
      firstFocusableElement?.focus();

      return () => {
        document.removeEventListener("keydown", handleKeyDown);
      };
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isMobileMenuOpen]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-white/95 backdrop-blur-md shadow-lg" : "bg-white"
        } border-b border-gray-200`}
      >
        <nav className="container-custom">
          <div className="flex items-center justify-between h-20 py-4">
            {/* ロゴ */}
            <Link
              to="/"
              className="flex items-center space-x-4 text-2xl font-bold text-primary-600 no-underline hover:text-primary-700 transition-colors"
            >
              <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center">
                <svg
                  className="w-7 h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                  />
                </svg>
              </div>
              <span className="hidden sm:block">Makeoo</span>
            </Link>

            {/* デスクトップナビ */}
            <div className="hidden md:flex items-center space-x-12">
              <Link
                to="/"
                className="text-gray-700 hover:text-primary-600 font-medium transition-colors text-lg no-underline py-2"
              >
                ホーム
              </Link>
              <Link
                to="/recipes"
                className="text-gray-700 hover:text-primary-600 font-medium transition-colors text-lg no-underline py-2"
              >
                レシピ一覧
              </Link>
              <Link
                to="/about"
                className="text-gray-700 hover:text-primary-600 font-medium transition-colors text-lg no-underline py-2"
              >
                Makeooとは
              </Link>
              <button className="btn-primary text-lg px-8 py-3">
                レシピを投稿
              </button>
            </div>

            {/* モバイルメニューボタン */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-3 rounded-md text-gray-600 hover:text-primary-600 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
              aria-label={
                isMobileMenuOpen ? "メニューを閉じる" : "メニューを開く"
              }
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
            >
              <span className="sr-only">メニュー</span>
              <div className="w-7 h-7 relative">
                <span
                  className={`absolute top-1 left-0 w-full h-0.5 bg-current transform transition-all duration-300 ${
                    isMobileMenuOpen ? "rotate-45 translate-y-2.5" : ""
                  }`}
                ></span>
                <span
                  className={`absolute top-3 left-0 w-full h-0.5 bg-current transition-all duration-300 ${
                    isMobileMenuOpen ? "opacity-0" : ""
                  }`}
                ></span>
                <span
                  className={`absolute top-5 left-0 w-full h-0.5 bg-current transform transition-all duration-300 ${
                    isMobileMenuOpen ? "-rotate-45 -translate-y-2.5" : ""
                  }`}
                ></span>
              </div>
            </button>
          </div>
        </nav>
      </header>

      {/* モバイルメニューオーバーレイ */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={toggleMobileMenu}
          aria-hidden="true"
        />
      )}

      {/* モバイルメニュー */}
      <div
        id="mobile-menu"
        className={`fixed top-20 left-0 right-0 bg-white z-50 md:hidden transform transition-all duration-300 shadow-lg ${
          isMobileMenuOpen
            ? "translate-y-0 opacity-100"
            : "-translate-y-full opacity-0 pointer-events-none"
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-menu-title"
      >
        <div className="px-8 py-12 space-y-8">
          <h2 id="mobile-menu-title" className="sr-only">
            ナビゲーションメニュー
          </h2>

          <Link
            to="/"
            className="block text-gray-900 hover:text-primary-600 font-medium text-xl py-4 border-b border-gray-100 transition-colors no-underline"
            onClick={toggleMobileMenu}
          >
            ホーム
          </Link>
          <Link
            to="/recipes"
            className="block text-gray-900 hover:text-primary-600 font-medium text-xl py-4 border-b border-gray-100 transition-colors no-underline"
            onClick={toggleMobileMenu}
          >
            レシピ一覧
          </Link>
          <Link
            to="/about"
            className="block text-gray-900 hover:text-primary-600 font-medium text-xl py-4 border-b border-gray-100 transition-colors no-underline"
            onClick={toggleMobileMenu}
          >
            Makeooとは
          </Link>

          <div className="pt-8">
            <button
              className="w-full btn-primary text-lg py-4"
              onClick={toggleMobileMenu}
            >
              レシピを投稿
            </button>
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <main>
        <Outlet />
      </main>

      {/* フッター */}
      <footer className="bg-gray-900 text-white section-padding">
        <div className="container-custom">
          <div className="grid md:grid-cols-4 gap-16">
            {/* ブランド */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-4 mb-10">
                <div className="w-14 h-14 bg-primary-600 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                    />
                  </svg>
                </div>
                <span className="text-3xl font-bold">Makeoo</span>
              </div>
              <p className="text-gray-300 text-lg leading-relaxed max-w-lg">
                環境に優しいDIYレシピを通じて、持続可能な暮らしを提案するプラットフォームです。
                <br className="hidden sm:block" />
                手作りの楽しさと環境への配慮を両立しましょう。
              </p>
            </div>

            {/* リンク */}
            <div>
              <h3 className="text-xl font-semibold mb-8">サイトマップ</h3>
              <ul className="space-y-6">
                <li>
                  <Link
                    to="/"
                    className="text-gray-300 hover:text-white transition-colors text-lg no-underline py-1 block"
                  >
                    ホーム
                  </Link>
                </li>
                <li>
                  <Link
                    to="/recipes"
                    className="text-gray-300 hover:text-white transition-colors text-lg no-underline py-1 block"
                  >
                    レシピ一覧
                  </Link>
                </li>
                <li>
                  <Link
                    to="/about"
                    className="text-gray-300 hover:text-white transition-colors text-lg no-underline py-1 block"
                  >
                    Makeooとは
                  </Link>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-white transition-colors text-lg no-underline py-1 block"
                  >
                    利用規約
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-white transition-colors text-lg no-underline py-1 block"
                  >
                    プライバシーポリシー
                  </a>
                </li>
              </ul>
            </div>

            {/* SNS */}
            <div>
              <h3 className="text-xl font-semibold mb-8">フォローする</h3>
              <div className="flex space-x-8">
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-lg"
                >
                  <span className="sr-only">Twitter</span>
                  <svg
                    className="w-8 h-8"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-lg"
                >
                  <span className="sr-only">Instagram</span>
                  <svg
                    className="w-8 h-8"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.151 14.81 3.5 13.549 3.5 12.108c0-1.441.651-2.702 1.626-3.583.975-.807 2.126-1.297 3.323-1.297 1.297 0 2.448.49 3.323 1.297.975.881 1.626 2.142 1.626 3.583 0 1.441-.651 2.702-1.626 3.583-.875.807-2.026 1.297-3.323 1.297z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-lg"
                >
                  <span className="sr-only">YouTube</span>
                  <svg
                    className="w-8 h-8"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* コピーライト */}
          <div className="border-t border-gray-800 mt-20 pt-16 text-center">
            <p className="text-gray-400 text-lg">
              © 2024 Makeoo. All rights reserved. Made with ❤️ for sustainable
              living.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
