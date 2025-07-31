/**
 * Tag API Routes
 * タグ関連のAPIエンドポイント
 */

import { Request, Response, Router } from "express";
import { query, validationResult } from "express-validator";
import { prisma } from "../utils/database";
import { logger } from "../utils/logger";
import { CacheManager } from "../utils/redis";

const router = Router();
const cacheManager = new CacheManager();

// バリデーションエラーハンドラー
const handleValidationErrors = (
  req: Request,
  res: Response,
  next: Function
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: "バリデーションエラー",
      details: errors.array(),
    });
  }
  next();
};

/**
 * タグ一覧取得
 * GET /tags
 */
router.get(
  "/",
  [
    query("search").optional().isString().trim(),
    query("limit").optional().isInt({ min: 1, max: 100 }).toInt(),
    query("popular").optional().isBoolean().toBoolean(),
  ],
  handleValidationErrors,
  async (req: Request, res: Response) => {
    try {
      interface TagsQuery {
        search?: string;
        limit?: number;
        popular?: boolean;
      }

      const { search, limit = 50, popular = false } = req.query as TagsQuery;

      // キャッシュキー生成
      const cacheKey = `tags:${JSON.stringify(req.query)}`;

      // キャッシュから取得を試行
      const cached = await CacheManager.get(cacheKey);
      if (cached) {
        return res.json({
          success: true,
          data: cached,
          cached: true,
        });
      }

      // フィルター条件構築
      interface WhereCondition {
        name?: { contains: string };
        usageCount?: { gt: number };
      }

      const where: WhereCondition = {};

      if (search) {
        where.name = { contains: search };
      }

      if (popular) {
        where.usageCount = { gt: 0 };
      }

      // ソート設定
      const orderBy = popular
        ? { usageCount: "desc" as const }
        : { name: "asc" as const };

      const tags = await prisma.tag.findMany({
        where,
        orderBy,
        take: limit,
      });

      const result = tags.map((tag) => ({
        id: tag.id.toString(),
        name: tag.name,
        slug: tag.slug,
        usageCount: tag.usageCount,
      }));

      // キャッシュに保存（15分間）
      await cacheManager.set(cacheKey, result, 900);

      res.json({
        success: true,
        data: result,
      });

      logger.info(`Tags fetched: ${tags.length} items`);
    } catch (error) {
      logger.error("Error fetching tags:", error);
      res.status(500).json({
        success: false,
        error: "タグの取得に失敗しました",
      });
    }
  }
);

export default router;
