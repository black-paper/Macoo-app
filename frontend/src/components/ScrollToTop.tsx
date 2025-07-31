import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * ページ遷移時に自動的にページトップにスクロールするコンポーネント
 * React Routerの location が変更されるたびに window.scrollTo(0, 0) を実行
 */
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // ページ遷移時にページトップにスムーズスクロール
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, [pathname]);

  return null;
};

export default ScrollToTop;
