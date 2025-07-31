/**
 * Category API Routes
 * カテゴリ関連のAPIエンドポイント
 */

import { Request, Response, Router } from "express";
import { param, validationResult } from "express-validator";
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
 * カテゴリ一覧取得
 * GET /categories
 */
router.get("/", async (req: Request, res: Response) => {
  try {
    // モックモード時はモックデータを返す
    if (process.env.MOCK_MODE === "true") {
      const mockCategories = [
        {
          id: "1",
          name: "ガーデニング",
          slug: "gardening",
          description: "植物やガーデン関連のDIYプロジェクト",
          iconName: "leaf",
          colorCode: "#22c55e",
          recipesCount: 15,
          sortOrder: 1,
        },
        {
          id: "2",
          name: "衣類・アクセサリー",
          slug: "clothing",
          description: "衣服やアクセサリーの制作・リメイク",
          iconName: "shirt",
          colorCode: "#f59e0b",
          recipesCount: 12,
          sortOrder: 2,
        },
        {
          id: "3",
          name: "インテリア",
          slug: "interior",
          description: "家具やインテリア雑貨の制作",
          iconName: "home",
          colorCode: "#8b5cf6",
          recipesCount: 18,
          sortOrder: 3,
        },
        {
          id: "4",
          name: "ペット用品",
          slug: "pet-supplies",
          description: "ペットのためのグッズ制作",
          iconName: "heart",
          colorCode: "#ef4444",
          recipesCount: 8,
          sortOrder: 4,
        },
        {
          id: "5",
          name: "クラフト",
          slug: "craft",
          description: "手工芸・クラフト作品の制作",
          iconName: "scissors",
          colorCode: "#06b6d4",
          recipesCount: 22,
          sortOrder: 5,
        },
      ];

      return res.json({
        success: true,
        data: mockCategories,
      });
    }

    const cacheKey = "categories:all";

    // キャッシュから取得を試行（モックモード時はスキップ）
    const cached = null; // await cacheManager.get(cacheKey);
    if (cached) {
      return res.json({
        success: true,
        data: cached,
        cached: true,
      });
    }

    const categories = await prisma.category.findMany({
      where: { isActive: true },
      include: {
        _count: {
          select: {
            recipes: {
              where: { status: "published" },
            },
          },
        },
      },
      orderBy: { sortOrder: "asc" },
    });

    const result = categories.map((category) => ({
      id: category.id.toString(),
      name: category.name,
      slug: category.slug,
      description: category.description,
      iconName: category.iconName,
      colorCode: category.colorCode,
      recipesCount: category._count.recipes,
      sortOrder: category.sortOrder,
    }));

    // キャッシュに保存（30分間）（モックモード時はスキップ）
    // await cacheManager.set(cacheKey, result, 1800);

    res.json({
      success: true,
      data: result,
    });

    logger.info(`Categories fetched: ${categories.length} items`);
  } catch (error) {
    logger.error("Error fetching categories:", error);
    res.status(500).json({
      success: false,
      error: "カテゴリの取得に失敗しました",
    });
  }
});

/**
 * 特定カテゴリ取得
 * GET /categories/:identifier
 */
router.get(
  "/:identifier",
  [param("identifier").isString().notEmpty()],
  handleValidationErrors,
  async (req: Request, res: Response) => {
    try {
      const { identifier } = req.params;
      const cacheKey = `category:${identifier}`;

      // キャッシュから取得を試行（モックモード時はスキップ）
      const cached = null; // await cacheManager.get(cacheKey);
      if (cached) {
        return res.json({
          success: true,
          data: cached,
          cached: true,
        });
      }

      // ID または slug で検索
      const isNumeric = /^\d+$/.test(identifier);
      const where = isNumeric
        ? { id: parseInt(identifier) }
        : { slug: identifier };

      const category = await prisma.category.findFirst({
        where: {
          ...where,
          isActive: true,
        },
        include: {
          _count: {
            select: {
              recipes: {
                where: { status: "published" },
              },
            },
          },
        },
      });

      if (!category) {
        return res.status(404).json({
          success: false,
          error: "カテゴリが見つかりません",
        });
      }

      const result = {
        id: category.id.toString(),
        name: category.name,
        slug: category.slug,
        description: category.description,
        iconName: category.iconName,
        colorCode: category.colorCode,
        recipesCount: category._count.recipes,
        sortOrder: category.sortOrder,
      };

      // キャッシュに保存（30分間）（モックモード時はスキップ）
      // await cacheManager.set(cacheKey, result, 1800);

      res.json({
        success: true,
        data: result,
      });

      logger.info(`Category fetched: ${category.name} (${category.id})`);
    } catch (error) {
      logger.error("Error fetching category:", error);
      res.status(500).json({
        success: false,
        error: "カテゴリの取得に失敗しました",
      });
    }
  }
);

export default router;
