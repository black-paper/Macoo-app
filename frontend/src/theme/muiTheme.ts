/**
 * MUIテーマ設定
 * 現在のサイトの色味とスタイルを保持
 */

import { createTheme } from "@mui/material/styles";

// 現在のサイトの色定義
const colors = {
  primary: {
    50: "#f0fdf4",
    100: "#dcfce7",
    500: "#22c55e",
    600: "#16a34a",
    700: "#15803d",
  },
  secondary: {
    50: "#fff7ed",
    100: "#ffedd5",
    500: "#f97316",
    600: "#ea580c",
  },
  gray: {
    50: "#f9fafb",
    100: "#f3f4f6",
    200: "#e5e7eb",
    300: "#d1d5db",
    400: "#9ca3af",
    500: "#6b7280",
    600: "#4b5563",
    700: "#374151",
    800: "#1f2937",
    900: "#111827",
  },
};

const muiTheme = createTheme({
  // カラーパレット
  palette: {
    primary: {
      main: colors.primary[500],
      light: colors.primary[100],
      dark: colors.primary[700],
      contrastText: "#ffffff",
    },
    secondary: {
      main: colors.secondary[500],
      light: colors.secondary[100],
      dark: colors.secondary[600],
      contrastText: "#ffffff",
    },
    background: {
      default: "#ffffff",
      paper: "#ffffff",
    },
    text: {
      primary: colors.gray[900],
      secondary: colors.gray[600],
    },
    grey: colors.gray,
  },

  // タイポグラフィ
  typography: {
    fontFamily: '"Inter", system-ui, -apple-system, sans-serif',
    h1: {
      fontSize: "3rem",
      fontWeight: 700,
      lineHeight: 1.2,
      "@media (max-width:768px)": {
        fontSize: "2.5rem",
      },
    },
    h2: {
      fontSize: "2.25rem",
      fontWeight: 700,
      lineHeight: 1.3,
      "@media (max-width:768px)": {
        fontSize: "2rem",
      },
    },
    h3: {
      fontSize: "1.875rem",
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h4: {
      fontSize: "1.5rem",
      fontWeight: 600,
      lineHeight: 1.5,
    },
    h5: {
      fontSize: "1.25rem",
      fontWeight: 600,
      lineHeight: 1.5,
    },
    h6: {
      fontSize: "1.125rem",
      fontWeight: 600,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.6,
    },
    body2: {
      fontSize: "0.875rem",
      lineHeight: 1.6,
    },
  },

  // コンポーネントのデフォルトスタイル
  components: {
    // ボタン
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: "0.5rem",
          fontWeight: 600,
          padding: "0.75rem 1.5rem",
        },
        contained: {
          boxShadow:
            "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
          "&:hover": {
            boxShadow:
              "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          },
        },
        outlined: {
          borderWidth: "2px",
          "&:hover": {
            borderWidth: "2px",
          },
        },
      },
    },

    // カード
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "1rem",
          boxShadow:
            "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
          "&:hover": {
            boxShadow:
              "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
            transform: "translateY(-2px)",
            transition: "all 0.2s ease-in-out",
          },
        },
      },
    },

    // App Bar
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#ffffff",
          color: colors.gray[900],
          boxShadow:
            "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
        },
      },
    },

    // Chip
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: "9999px",
          fontWeight: 600,
        },
      },
    },

    // Paper
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: "1rem",
        },
      },
    },

    // Container
    MuiContainer: {
      styleOverrides: {
        root: {
          "@media (min-width: 1200px)": {
            maxWidth: "1200px",
          },
          "@media (min-width: 1536px)": {
            maxWidth: "1536px",
          },
        },
      },
    },
  },

  // ブレークポイント
  breakpoints: {
    values: {
      xs: 0,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
    },
  },

  // スペーシング
  spacing: 8,
});

export default muiTheme;
