import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import About from "./pages/About";
import Home from "./pages/Home";
import RecipeDetail from "./pages/RecipeDetail";
import Recipes from "./pages/Recipes";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="recipes" element={<Recipes />} />
          <Route path="recipe/:id" element={<RecipeDetail />} />
          <Route path="about" element={<About />} />
          {/* 404ページ */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
};

// 404 Not Foundページコンポーネント
const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-20">
      <div className="text-center fade-in">
        <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-8">
          <svg
            className="w-12 h-12 text-primary-600"
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
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          ページが見つかりません
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto">
          申し訳ございませんが、お探しのページは存在しないか、移動した可能性があります。
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => window.history.back()}
            className="btn-secondary text-lg px-8 py-3"
          >
            前のページに戻る
          </button>
          <a
            href="/"
            className="btn-primary text-lg px-8 py-3 no-underline inline-block text-center"
          >
            ホームに戻る
          </a>
        </div>
      </div>
    </div>
  );
};

export default App;
