/**
 * Database connection and utilities
 * Prisma Client管理
 */

import { PrismaClient } from "@prisma/client";
import { logger } from "./logger";

// Prismaクライアントのシングルトンインスタンス
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "info", "warn", "error"]
        : ["warn", "error"],
    errorFormat: "pretty",
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

/**
 * データベース接続確認
 */
export async function connectDB(): Promise<void> {
  try {
    await prisma.$connect();
    logger.info("🗄️  Database connection established");

    // 接続テスト
    await prisma.$queryRaw`SELECT 1`;
    logger.info("✅ Database connectivity test passed");
  } catch (error) {
    logger.error("❌ Database connection failed:", error);
    throw error;
  }
}

/**
 * データベース切断
 */
export async function disconnectDB(): Promise<void> {
  try {
    await prisma.$disconnect();
    logger.info("🔌 Database disconnected");
  } catch (error) {
    logger.error("❌ Database disconnection failed:", error);
    throw error;
  }
}

/**
 * ヘルスチェック用のデータベース接続確認
 */
export async function checkDBHealth(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    logger.error("❌ Database health check failed:", error);
    return false;
  }
}

/**
 * データベース統計情報を取得
 */
export async function getDatabaseStats() {
  try {
    const [userCount, recipeCount, categoryCount, tagCount, activeRecipeCount] =
      await Promise.all([
        prisma.user.count(),
        prisma.recipe.count(),
        prisma.category.count(),
        prisma.tag.count(),
        prisma.recipe.count({
          where: { status: "published" },
        }),
      ]);

    return {
      users: userCount,
      recipes: recipeCount,
      categories: categoryCount,
      tags: tagCount,
      activeRecipes: activeRecipeCount,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    logger.error("❌ Failed to get database stats:", error);
    throw error;
  }
}

/**
 * データベーストランザクション実行ヘルパー
 */
export async function executeTransaction<T>(
  operation: (
    tx: Omit<
      PrismaClient,
      "$connect" | "$disconnect" | "$on" | "$transaction" | "$use"
    >
  ) => Promise<T>
): Promise<T> {
  return await prisma.$transaction(operation);
}

// プロセス終了時の自動切断
process.on("beforeExit", async () => {
  await disconnectDB();
});

export default prisma;
