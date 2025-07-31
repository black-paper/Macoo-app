/**
 * User API Routes
 * ユーザー関連のAPIエンドポイント
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
 * ユーザープロフィール取得
 * GET /users/:identifier
 */
router.get(
  "/:identifier",
  [param("identifier").isString().notEmpty()],
  handleValidationErrors,
  async (req: Request, res: Response) => {
    try {
      const { identifier } = req.params;
      const cacheKey = `user:${identifier}`;

      // キャッシュから取得を試行
      const cached = await CacheManager.get(cacheKey);
      if (cached) {
        return res.json({
          success: true,
          data: cached,
          cached: true,
        });
      }

      // username または ID で検索
      const isNumeric = /^\d+$/.test(identifier);
      const where = isNumeric
        ? { id: BigInt(identifier) }
        : { username: identifier };

      const user = await prisma.user.findFirst({
        where: {
          ...where,
          isActive: true,
        },
        select: {
          id: true,
          username: true,
          displayName: true,
          bio: true,
          avatarUrl: true,
          location: true,
          websiteUrl: true,
          isVerified: true,
          createdAt: true,
          _count: {
            select: {
              recipes: {
                where: { status: "published" },
              },
              likes: true,
              comments: true,
            },
          },
        },
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          error: "ユーザーが見つかりません",
        });
      }

      const result = {
        id: user.id.toString(),
        username: user.username,
        displayName: user.displayName,
        bio: user.bio,
        avatarUrl: user.avatarUrl,
        location: user.location,
        websiteUrl: user.websiteUrl,
        isVerified: user.isVerified,
        createdAt: user.createdAt.toISOString(),
        stats: {
          recipesCount: user._count.recipes,
          likesGiven: user._count.likes,
          commentsCount: user._count.comments,
        },
      };

      // キャッシュに保存（10分間）
      await cacheManager.set(cacheKey, result, 600);

      res.json({
        success: true,
        data: result,
      });

      logger.info(`User profile fetched: ${user.username} (${user.id})`);
    } catch (error) {
      logger.error("Error fetching user:", error);
      res.status(500).json({
        success: false,
        error: "ユーザー情報の取得に失敗しました",
      });
    }
  }
);

/**
 * ユーザーのレシピ一覧取得
 * GET /users/:identifier/recipes
 */
router.get(
  "/:identifier/recipes",
  [param("identifier").isString().notEmpty()],
  handleValidationErrors,
  async (req: Request, res: Response) => {
    try {
      const { identifier } = req.params;

      interface UserRecipesQuery {
        page?: number;
        limit?: number;
      }

      const { page = 1, limit = 12 } = req.query as UserRecipesQuery;

      // ユーザー検索
      const isNumeric = /^\d+$/.test(identifier);
      const userWhere = isNumeric
        ? { id: BigInt(identifier) }
        : { username: identifier };

      const user = await prisma.user.findFirst({
        where: {
          ...userWhere,
          isActive: true,
        },
        select: { id: true, username: true, displayName: true },
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          error: "ユーザーが見つかりません",
        });
      }

      // ページネーション計算
      const skip = (parseInt(page) - 1) * parseInt(limit);

      // レシピ取得
      const [recipes, totalCount] = await Promise.all([
        prisma.recipe.findMany({
          where: {
            authorId: user.id,
            status: "published",
          },
          include: {
            category: {
              select: {
                id: true,
                name: true,
                slug: true,
                colorCode: true,
              },
            },
            tags: {
              include: {
                tag: {
                  select: {
                    id: true,
                    name: true,
                    slug: true,
                  },
                },
              },
              take: 5,
            },
          },
          orderBy: { createdAt: "desc" },
          skip,
          take: parseInt(limit),
        }),
        prisma.recipe.count({
          where: {
            authorId: user.id,
            status: "published",
          },
        }),
      ]);

      // レスポンス構築
      const totalPages = Math.ceil(totalCount / parseInt(limit));

      const result = {
        user: {
          id: user.id.toString(),
          username: user.username,
          displayName: user.displayName,
        },
        recipes: recipes.map((recipe) => ({
          id: recipe.id.toString(),
          title: recipe.title,
          slug: recipe.slug,
          description: recipe.description,
          difficulty: recipe.difficulty,
          estimatedTimeMinutes: recipe.estimatedTimeMinutes,
          category: recipe.category,
          likesCount: recipe.likesCount,
          commentsCount: recipe.commentsCount,
          viewsCount: recipe.viewsCount,
          tags: recipe.tags.map((rt) => rt.tag),
          publishedAt: recipe.publishedAt?.toISOString(),
          createdAt: recipe.createdAt.toISOString(),
        })),
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalItems: totalCount,
          hasNext: parseInt(page) < totalPages,
          hasPrev: parseInt(page) > 1,
          limit: parseInt(limit),
        },
      };

      res.json({
        success: true,
        data: result,
      });

      logger.info(
        `User recipes fetched: ${user.username}, ${recipes.length} items`
      );
    } catch (error) {
      logger.error("Error fetching user recipes:", error);
      res.status(500).json({
        success: false,
        error: "ユーザーレシピの取得に失敗しました",
      });
    }
  }
);

export default router;
