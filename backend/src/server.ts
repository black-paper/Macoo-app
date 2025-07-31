/**
 * Makeoo DIY Platform - Backend Server
 * Express.js + TypeScript + Prisma
 */

import compression from "compression";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import "express-async-errors";
import helmet from "helmet";
import morgan from "morgan";

import { errorHandler } from "./middleware/errorHandler";
import { notFound } from "./middleware/notFound";
import { rateLimiter } from "./middleware/rateLimiter";
import { connectDB } from "./utils/database";
import { logger } from "./utils/logger";
import { connectRedis } from "./utils/redis";

// Routes
import categoryRoutes from "./routes/categories";
import healthRoutes from "./routes/health";
import recipeRoutes from "./routes/recipes";
import tagRoutes from "./routes/tags";
import uploadRoutes from "./routes/upload";
import userRoutes from "./routes/users";

// 環境変数読み込み
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const MOCK_MODE = process.env.MOCK_MODE === "true";

// =================================
// ミドルウェア設定
// =================================

// セキュリティヘッダー
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginEmbedderPolicy: false,
  })
);

// CORS設定
app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",") || [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5175",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

// 圧縮
app.use(compression());

// JSONパース
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ログ設定
const morganFormat = process.env.NODE_ENV === "production" ? "combined" : "dev";

app.use(
  morgan(morganFormat, {
    stream: {
      write: (message: string) => logger.info(message.trim()),
    },
  })
);

// レート制限
app.use("/api/", rateLimiter);

// 静的ファイル配信（アップロード画像など）
app.use("/uploads", express.static("uploads"));

// =================================
// API ルート設定
// =================================

// ヘルスチェック
app.use("/health", healthRoutes);

// API v1 ルート
const apiV1 = express.Router();

apiV1.use("/recipes", recipeRoutes);
apiV1.use("/users", userRoutes);
apiV1.use("/categories", categoryRoutes);
apiV1.use("/tags", tagRoutes);
apiV1.use("/upload", uploadRoutes);

app.use("/api/v1", apiV1);

// API情報エンドポイント
app.get("/api", (req, res) => {
  res.json({
    name: "Makeoo DIY Platform API",
    version: "1.0.0",
    status: "running",
    environment: process.env.NODE_ENV,
    endpoints: {
      health: "/health",
      docs: "/api/docs",
      v1: {
        recipes: "/api/v1/recipes",
        users: "/api/v1/users",
        categories: "/api/v1/categories",
        tags: "/api/v1/tags",
        upload: "/api/v1/upload",
      },
    },
    timestamp: new Date().toISOString(),
  });
});

// =================================
// エラーハンドリング
// =================================

// 404エラー
app.use(notFound);

// グローバルエラーハンドラー
app.use(errorHandler);

// =================================
// サーバー起動
// =================================

async function startServer() {
  try {
    if (MOCK_MODE) {
      logger.info("🎭 モックモードで起動しています（データベース接続なし）");
    } else {
      logger.info("📊 データベースに接続しています...");
      await connectDB();
      logger.info("✅ データベース接続成功");
    }

    // Redis接続（モックモード時はスキップ）
    if (!MOCK_MODE) {
      await connectRedis();
      logger.info("✅ Redis connected successfully");
    } else {
      logger.info("🎭 モックモード: Redis接続をスキップしています");
    }

    // サーバー起動
    const server = app.listen(PORT, () => {
      logger.info(`🚀 Makeoo API Server running on port ${PORT}`);
      logger.info(`📱 Environment: ${process.env.NODE_ENV}`);
      logger.info(`🌐 API URL: http://localhost:${PORT}/api`);
      logger.info(`🏥 Health Check: http://localhost:${PORT}/health`);

      if (process.env.NODE_ENV === "development") {
        logger.info(`📊 phpMyAdmin: http://localhost:8080`);
        logger.info(`🔧 Adminer: http://localhost:8081`);
        logger.info(`📮 Redis Commander: http://localhost:8082`);
      }
      if (MOCK_MODE) {
        logger.info("🎭 モックモード: フロントエンドのモックデータを使用");
      }
    });

    // Graceful shutdown
    process.on("SIGTERM", () => {
      logger.info("⏹️  SIGTERM received, shutting down gracefully");
      server.close(() => {
        logger.info("✅ Server closed");
        process.exit(0);
      });
    });

    process.on("SIGINT", () => {
      logger.info("⏹️  SIGINT received, shutting down gracefully");
      server.close(() => {
        logger.info("✅ Server closed");
        process.exit(0);
      });
    });
  } catch (error) {
    logger.error("❌ Failed to start server:", error);
    if (!MOCK_MODE) {
      logger.info(
        "💡 モックモードで再試行してください: MOCK_MODE=true npm run dev"
      );
    }
    process.exit(1);
  }
}

// サーバー起動実行
startServer();
