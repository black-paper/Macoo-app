/**
 * Recipe API Routes
 * レシピ関連のAPIエンドポイント
 */

import { Request, Response, Router } from "express";
import { body, param, query, validationResult } from "express-validator";
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
 * レシピ一覧取得
 * GET /recipes
 */
router.get(
  "/",
  [
    query("page").optional().isInt({ min: 1 }).toInt(),
    query("limit").optional().isInt({ min: 1, max: 50 }).toInt(),
    query("category").optional().isString(),
    query("difficulty")
      .optional()
      .isIn(["beginner", "intermediate", "advanced"]),
    query("search").optional().isString().trim(),
    query("sort").optional().isIn(["newest", "oldest", "popular", "likes"]),
    query("tags").optional().isString(),
  ],
  handleValidationErrors,
  async (req: Request, res: Response) => {
    try {
      interface RecipesQuery {
        page?: number;
        limit?: number;
        category?: string;
        difficulty?: string;
        search?: string;
        sort?: string;
        tags?: string;
      }

      const {
        page = 1,
        limit = 12,
        category,
        difficulty,
        search,
        sort = "newest",
        tags,
      } = req.query as RecipesQuery;

      // モックモード時はモックデータを返す
      if (process.env.MOCK_MODE === "true") {
        const mockRecipes = {
          recipes: [
            {
              id: "1",
              title: "ペットボトルで作るプランター",
              slug: "pet-bottle-planter",
              description:
                "使い終わったペットボトルを再利用して、おしゃれなプランターを作ります。初心者でも簡単に作れるエコプロジェクトです。",
              difficulty: "beginner",
              estimatedTimeMinutes: 30,
              category: {
                id: "1",
                name: "ガーデニング",
                slug: "gardening",
                iconName: "leaf",
                colorCode: "#22c55e",
              },
              author: {
                id: "1",
                username: "midori",
                displayName: "みどり",
                isVerified: true,
              },
              likesCount: 42,
              commentsCount: 8,
              viewsCount: 150,
              tags: [
                { id: "1", name: "エコ", slug: "eco" },
                { id: "2", name: "リサイクル", slug: "recycle" },
              ],
              publishedAt: "2025-01-20T10:00:00Z",
              createdAt: "2025-01-20T10:00:00Z",
              updatedAt: "2025-01-20T10:00:00Z",
            },
            {
              id: "2",
              title: "古着から作るエコバッグ",
              slug: "old-clothes-eco-bag",
              description:
                "着なくなったTシャツや布を使って、実用的なエコバッグを作ります。縫物初心者にもおすすめです。",
              difficulty: "beginner",
              estimatedTimeMinutes: 45,
              category: {
                id: "2",
                name: "衣類・アクセサリー",
                slug: "clothing",
                iconName: "shirt",
                colorCode: "#f59e0b",
              },
              author: {
                id: "2",
                username: "sakura",
                displayName: "さくら",
                isVerified: false,
              },
              likesCount: 28,
              commentsCount: 5,
              viewsCount: 89,
              tags: [
                { id: "1", name: "エコ", slug: "eco" },
                { id: "3", name: "ファッション", slug: "fashion" },
              ],
              publishedAt: "2025-01-19T14:30:00Z",
              createdAt: "2025-01-19T14:30:00Z",
              updatedAt: "2025-01-19T14:30:00Z",
            },
          ],
          pagination: {
            currentPage: page,
            totalPages: 1,
            totalItems: 2,
            hasNext: false,
            hasPrev: false,
            limit,
          },
        };

        return res.json({
          success: true,
          data: mockRecipes,
        });
      }

      // キャッシュキー生成
      const cacheKey = `recipes:${JSON.stringify(req.query)}`;

      // キャッシュから取得を試行
      const cached = await cacheManager.get(cacheKey);
      if (cached) {
        return res.json({
          success: true,
          data: cached,
          cached: true,
        });
      }

      // フィルター条件構築
      interface WhereCondition {
        status: string;
        categoryId?: string;
        difficulty?: string;
        OR?: Array<{
          title?: { contains: string; mode: string };
          description?: { contains: string; mode: string };
        }>;
        tags?: {
          some: { tag: { slug: { in: string[] } } };
        };
      }

      const where: WhereCondition = {
        status: "published",
      };

      if (category) {
        where.categoryId = category;
      }

      if (difficulty) {
        where.difficulty = difficulty;
      }

      if (search) {
        where.OR = [
          { title: { contains: search } },
          { description: { contains: search } },
        ];
      }

      if (tags) {
        const tagList = tags.split(",");
        where.tags = {
          some: {
            tag: {
              slug: { in: tagList },
            },
          },
        };
      }

      // ソート設定
      let orderBy: any = { createdAt: "desc" };
      switch (sort) {
        case "oldest":
          orderBy = { createdAt: "asc" };
          break;
        case "popular":
          orderBy = { viewsCount: "desc" };
          break;
        case "likes":
          orderBy = { likesCount: "desc" };
          break;
      }

      // ページネーション計算
      const skip = (page - 1) * limit;

      // データ取得
      const [recipes, totalCount] = await Promise.all([
        prisma.recipe.findMany({
          where,
          include: {
            category: {
              select: {
                id: true,
                name: true,
                slug: true,
                colorCode: true,
                iconName: true,
              },
            },
            author: {
              select: {
                id: true,
                username: true,
                displayName: true,
                isVerified: true,
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
              orderBy: {
                tag: {
                  usageCount: "desc",
                },
              },
              take: 10,
            },
            _count: {
              select: {
                materials: true,
                tools: true,
                steps: true,
                comments: true,
              },
            },
          },
          orderBy,
          skip,
          take: limit,
        }),
        prisma.recipe.count({ where }),
      ]);

      // レスポンス構築
      const totalPages = Math.ceil(totalCount / limit);
      const hasNext = page < totalPages;
      const hasPrev = page > 1;

      const result = {
        recipes: recipes.map((recipe) => ({
          id: recipe.id.toString(),
          title: recipe.title,
          slug: recipe.slug,
          description: recipe.description,
          difficulty: recipe.difficulty,
          estimatedTimeMinutes: recipe.estimatedTimeMinutes,
          category: recipe.category,
          author: recipe.author,
          likesCount: recipe.likesCount,
          commentsCount: recipe.commentsCount,
          viewsCount: recipe.viewsCount,
          tags: recipe.tags.map((rt) => rt.tag),
          publishedAt: recipe.publishedAt?.toISOString(),
          createdAt: recipe.createdAt.toISOString(),
          updatedAt: recipe.updatedAt.toISOString(),
          counts: recipe._count,
        })),
        pagination: {
          currentPage: page,
          totalPages,
          totalItems: totalCount,
          hasNext,
          hasPrev,
          limit,
        },
      };

      // キャッシュに保存（5分間）
      await cacheManager.set(cacheKey, result, 300);

      res.json({
        success: true,
        data: result,
      });

      logger.info(`Recipes fetched: ${recipes.length} items, page ${page}`);
    } catch (error) {
      logger.error("Error fetching recipes:", error);
      res.status(500).json({
        success: false,
        error: "レシピの取得に失敗しました",
      });
    }
  }
);

/**
 * 特定レシピ取得
 * GET /recipes/:identifier
 */
router.get(
  "/:identifier",
  [param("identifier").isString().notEmpty()],
  handleValidationErrors,
  async (req: Request, res: Response) => {
    try {
      const { identifier } = req.params;

      // モックモード時はモックデータを返す
      if (process.env.MOCK_MODE === "true") {
        const mockRecipe = {
          id: "1",
          title: "ペットボトルで作るプランター",
          slug: "pet-bottle-planter",
          description:
            "使い終わったペットボトルを再利用して、おしゃれなプランターを作ります。初心者でも簡単に作れるエコプロジェクトです。植物を育てる楽しみと、リサイクルの意識を同時に体験できる素晴らしいDIYプロジェクトです。",
          thumbnailUrl: null,
          difficulty: "beginner",
          estimatedTimeMinutes: 30,
          category: {
            id: "1",
            name: "ガーデニング",
            slug: "gardening",
            description: "植物やガーデン関連のDIYプロジェクト",
            iconName: "leaf",
            colorCode: "#22c55e",
          },
          author: {
            id: "1",
            username: "midori",
            displayName: "みどり",
            bio: "エコライフを愛するDIY愛好家です。身の回りのものを再利用して、新しい価値を生み出すことに情熱を注いでいます。",
            isVerified: true,
          },
          materials: [
            {
              id: "1",
              name: "2Lペットボトル",
              quantity: "1本",
              notes: "炭酸飲料のボトルがおすすめ",
              sortOrder: 1,
            },
            {
              id: "2",
              name: "培養土",
              quantity: "適量",
              notes: "植物用の栄養豊富な土を使用",
              sortOrder: 2,
            },
            {
              id: "3",
              name: "種または苗",
              quantity: "1つ",
              notes: "ハーブや小さな花がおすすめ",
              sortOrder: 3,
            },
          ],
          tools: [
            {
              id: "1",
              name: "カッター",
              isEssential: true,
              notes: "刃を新しくしておくと作業がスムーズ",
              sortOrder: 1,
            },
            {
              id: "2",
              name: "ハサミ",
              isEssential: false,
              notes: "仕上げ用に使用",
              sortOrder: 2,
            },
          ],
          steps: [
            {
              id: "1",
              stepNumber: 1,
              title: "ペットボトルの準備",
              description:
                "ペットボトルをよく洗い、ラベルを剥がします。完全に乾燥させてから次の工程に進みましょう。",
              tip: "お湯を使うとラベルが剥がしやすくなります",
              imageUrl: null,
              estimatedTimeMinutes: 5,
              sortOrder: 1,
            },
            {
              id: "2",
              stepNumber: 2,
              title: "排水穴を開ける",
              description:
                "ペットボトルの底に5-6箇所、直径5mm程度の穴を開けます。水はけを良くするために重要な工程です。",
              tip: "熱したキリを使うときれいに穴が開きます",
              imageUrl: null,
              estimatedTimeMinutes: 5,
              sortOrder: 2,
            },
            {
              id: "3",
              stepNumber: 3,
              title: "ボトルを切る",
              description:
                "ペットボトルの上部3分の1をカッターで切り取ります。切り口を滑らかにするためにハサミで仕上げてください。",
              tip: "マジックで切り取り線を描いてから切ると失敗しません",
              imageUrl: null,
              estimatedTimeMinutes: 10,
              sortOrder: 3,
            },
            {
              id: "4",
              stepNumber: 4,
              title: "土と植物を入れる",
              description:
                "培養土をプランターの7-8分目まで入れ、種を蒔くか苗を植えます。最後に軽く水をやって完成です。",
              tip: "最初の水やりは優しく、土が落ち着くまで様子を見てください",
              imageUrl: null,
              estimatedTimeMinutes: 10,
              sortOrder: 4,
            },
          ],
          tags: [
            {
              id: "1",
              name: "エコ",
              slug: "eco",
              usageCount: 45,
            },
            {
              id: "2",
              name: "リサイクル",
              slug: "recycle",
              usageCount: 32,
            },
            {
              id: "4",
              name: "ガーデニング",
              slug: "gardening",
              usageCount: 28,
            },
          ],
          likesCount: 42,
          commentsCount: 8,
          viewsCount: 150,
          status: "published",
          publishedAt: "2025-01-20T10:00:00Z",
          createdAt: "2025-01-20T10:00:00Z",
          updatedAt: "2025-01-20T10:00:00Z",
          comments: [
            {
              id: "1",
              content:
                "とても簡単で分かりやすい説明でした！実際に作ってみて、バジルを育てています。",
              author: {
                id: "2",
                username: "hana_diy",
                displayName: "はな",
                isVerified: false,
              },
              createdAt: "2025-01-21T09:15:00Z",
            },
            {
              id: "2",
              content:
                "子供と一緒に楽しく作れました。環境について話し合うきっかけにもなりました。",
              author: {
                id: "3",
                username: "papa_eco",
                displayName: "エコパパ",
                isVerified: true,
              },
              createdAt: "2025-01-22T14:30:00Z",
            },
          ],
        };

        // slug または id でモックデータを返す
        if (identifier === "pet-bottle-planter" || identifier === "1") {
          return res.json({
            success: true,
            data: mockRecipe,
          });
        } else {
          return res.status(404).json({
            success: false,
            error: "レシピが見つかりません",
          });
        }
      }

      // キャッシュキー
      const cacheKey = `recipe:${identifier}`;

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
        ? { id: BigInt(identifier) }
        : { slug: identifier };

      const recipe = await prisma.recipe.findFirst({
        where: {
          ...where,
          status: "published",
        },
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
              description: true,
              colorCode: true,
              iconName: true,
            },
          },
          author: {
            select: {
              id: true,
              username: true,
              displayName: true,
              bio: true,
              isVerified: true,
            },
          },
          materials: {
            orderBy: { sortOrder: "asc" },
            select: {
              id: true,
              name: true,
              quantity: true,
              notes: true,
              sortOrder: true,
            },
          },
          tools: {
            orderBy: { sortOrder: "asc" },
            select: {
              id: true,
              name: true,
              isEssential: true,
              notes: true,
              sortOrder: true,
            },
          },
          steps: {
            orderBy: { sortOrder: "asc" },
            select: {
              id: true,
              stepNumber: true,
              title: true,
              description: true,
              tip: true,
              imageUrl: true,
              estimatedTimeMinutes: true,
              sortOrder: true,
            },
          },
          tags: {
            include: {
              tag: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                  usageCount: true,
                },
              },
            },
            orderBy: {
              tag: {
                usageCount: "desc",
              },
            },
          },
          comments: {
            where: { isDeleted: false },
            include: {
              user: {
                select: {
                  id: true,
                  username: true,
                  displayName: true,
                },
              },
            },
            orderBy: { createdAt: "desc" },
            take: 20,
          },
        },
      });

      if (!recipe) {
        return res.status(404).json({
          success: false,
          error: "レシピが見つかりません",
        });
      }

      // ビュー数増加（非同期）
      prisma.recipe
        .update({
          where: { id: recipe.id },
          data: { viewsCount: { increment: 1 } },
        })
        .catch((error) => {
          logger.warn("Failed to increment view count:", error);
        });

      const result = {
        id: recipe.id.toString(),
        title: recipe.title,
        slug: recipe.slug,
        description: recipe.description,
        difficulty: recipe.difficulty,
        estimatedTimeMinutes: recipe.estimatedTimeMinutes,
        category: recipe.category,
        author: recipe.author,
        likesCount: recipe.likesCount,
        commentsCount: recipe.commentsCount,
        viewsCount: recipe.viewsCount + 1, // インクリメント後の値を返す
        materials: recipe.materials,
        tools: recipe.tools.map((tool) => ({
          ...tool,
          isRequired: tool.isEssential,
        })),
        steps: recipe.steps,
        tags: recipe.tags.map((rt) => rt.tag),
        comments: recipe.comments.map((comment) => ({
          id: comment.id.toString(),
          content: comment.content,
          likesCount: comment.likesCount,
          user: comment.user,
          createdAt: comment.createdAt.toISOString(),
          updatedAt: comment.updatedAt.toISOString(),
        })),
        publishedAt: recipe.publishedAt?.toISOString(),
        createdAt: recipe.createdAt.toISOString(),
        updatedAt: recipe.updatedAt.toISOString(),
      };

      // キャッシュに保存（10分間）
      await cacheManager.set(cacheKey, result, 600);

      res.json({
        success: true,
        data: result,
      });

      logger.info(`Recipe fetched: ${recipe.title} (${recipe.id})`);
    } catch (error) {
      logger.error("Error fetching recipe:", error);
      res.status(500).json({
        success: false,
        error: "レシピの取得に失敗しました",
      });
    }
  }
);

/**
 * レシピ作成
 * POST /recipes
 */
router.post(
  "/",
  [
    body("title").isString().isLength({ min: 1, max: 200 }).trim(),
    body("description").isString().isLength({ min: 10 }).trim(),
    body("difficulty").isIn(["beginner", "intermediate", "advanced"]),
    body("estimatedTimeMinutes").isInt({ min: 1 }),
    body("categoryId").isInt(),
    body("materials").isArray(),
    body("tools").isArray(),
    body("steps").isArray(),
    body("tags").optional().isArray(),
  ],
  handleValidationErrors,
  async (req: Request, res: Response) => {
    try {
      const {
        title,
        description,
        difficulty,
        estimatedTimeMinutes,
        categoryId,
        materials,
        tools,
        steps,
        tags = [],
      } = req.body;

      // TODO: 認証実装時にauthorIdを取得
      const authorId = BigInt(1); // 仮のユーザーID

      // スラッグ生成
      const slug = `${title.replace(/\s+/g, "-").toLowerCase()}-${Date.now()}`;

      // トランザクション実行
      const recipe = await prisma.$transaction(async (tx) => {
        // レシピ作成
        const newRecipe = await tx.recipe.create({
          data: {
            title,
            slug,
            description,
            difficulty,
            estimatedTimeMinutes,
            categoryId,
            authorId,
            status: "published",
            publishedAt: new Date(),
          },
        });

        // 材料追加
        if (materials.length > 0) {
          await tx.recipeMaterial.createMany({
            data: materials.map((material: any, index: number) => ({
              recipeId: newRecipe.id,
              name: material.name,
              quantity: material.quantity,
              notes: material.notes,
              sortOrder: index,
            })),
          });
        }

        // 道具追加
        if (tools.length > 0) {
          await tx.recipeTool.createMany({
            data: tools.map((tool: any, index: number) => ({
              recipeId: newRecipe.id,
              name: tool.name,
              isEssential: tool.isRequired !== false,
              notes: tool.notes,
              sortOrder: index,
            })),
          });
        }

        // 手順追加
        if (steps.length > 0) {
          await tx.recipeStep.createMany({
            data: steps.map((step: any, index: number) => ({
              recipeId: newRecipe.id,
              stepNumber: index + 1,
              title: step.title,
              description: step.description,
              tip: step.tip,
              sortOrder: index,
            })),
          });
        }

        // タグ追加
        if (tags.length > 0) {
          const tagRecords = await Promise.all(
            tags.map(async (tagName: string) => {
              const tag = await tx.tag.upsert({
                where: { name: tagName },
                update: { usageCount: { increment: 1 } },
                create: {
                  name: tagName,
                  slug: tagName.toLowerCase().replace(/\s+/g, "-"),
                  usageCount: 1,
                },
              });
              return tag;
            })
          );

          await tx.recipeTag.createMany({
            data: tagRecords.map((tag) => ({
              recipeId: newRecipe.id,
              tagId: tag.id,
            })),
          });
        }

        return newRecipe;
      });

      // キャッシュクリア
      await cacheManager.deletePattern("recipes:*");

      res.status(201).json({
        success: true,
        data: {
          id: recipe.id.toString(),
          title: recipe.title,
          slug: recipe.slug,
        },
        message: "レシピが作成されました",
      });

      logger.info(`Recipe created: ${recipe.title} (${recipe.id})`);
    } catch (error) {
      logger.error("Error creating recipe:", error);
      res.status(500).json({
        success: false,
        error: "レシピの作成に失敗しました",
      });
    }
  }
);

/**
 * レシピのいいね/いいね取り消し
 * POST /recipes/:id/like
 * DELETE /recipes/:id/like
 */
router.post(
  "/:id/like",
  [param("id").isString().notEmpty()],
  handleValidationErrors,
  async (req: Request, res: Response) => {
    try {
      const recipeId = BigInt(req.params.id);
      // TODO: 認証実装時にuserIdを取得
      const userId = BigInt(1); // 仮のユーザーID

      // 既存のいいねをチェック
      const existingLike = await prisma.recipeLike.findUnique({
        where: {
          recipeId_userId: {
            recipeId,
            userId,
          },
        },
      });

      let liked: boolean;
      let likesCount: number;

      if (existingLike) {
        // いいね取り消し
        await Promise.all([
          prisma.recipeLike.delete({
            where: { id: existingLike.id },
          }),
          prisma.recipe.update({
            where: { id: recipeId },
            data: { likesCount: { decrement: 1 } },
          }),
        ]);
        liked = false;
      } else {
        // いいね追加
        await Promise.all([
          prisma.recipeLike.create({
            data: { recipeId, userId },
          }),
          prisma.recipe.update({
            where: { id: recipeId },
            data: { likesCount: { increment: 1 } },
          }),
        ]);
        liked = true;
      }

      // 更新後のいいね数を取得
      const recipe = await prisma.recipe.findUnique({
        where: { id: recipeId },
        select: { likesCount: true },
      });

      likesCount = recipe?.likesCount || 0;

      // キャッシュクリア
      await cacheManager.deletePattern(`recipe:*${recipeId}*`);

      res.json({
        success: true,
        data: { liked, likesCount },
      });

      logger.info(`Recipe ${liked ? "liked" : "unliked"}: ${recipeId}`);
    } catch (error) {
      logger.error("Error toggling recipe like:", error);
      res.status(500).json({
        success: false,
        error: "いいねの処理に失敗しました",
      });
    }
  }
);

router.delete(
  "/:id/like",
  router.stack.find(
    (layer) => layer.route?.path === "/:id/like" && layer.route?.methods.post
  )?.route?.stack[1].handle ||
    ((req, res) => {
      res.status(405).json({
        success: false,
        error: "Method not implemented",
      });
    })
);

/**
 * コメント追加
 * POST /recipes/:id/comments
 */
router.post(
  "/:id/comments",
  [
    param("id").isString().notEmpty(),
    body("content").isString().isLength({ min: 1, max: 1000 }).trim(),
  ],
  handleValidationErrors,
  async (req: Request, res: Response) => {
    try {
      const recipeId = BigInt(req.params.id);
      const { content } = req.body;
      // TODO: 認証実装時にuserIdを取得
      const userId = BigInt(1); // 仮のユーザーID

      // コメント作成とレシピのコメント数更新
      const [comment] = await Promise.all([
        prisma.recipeComment.create({
          data: {
            recipeId,
            userId,
            content,
          },
          include: {
            user: {
              select: {
                id: true,
                username: true,
                displayName: true,
              },
            },
          },
        }),
        prisma.recipe.update({
          where: { id: recipeId },
          data: { commentsCount: { increment: 1 } },
        }),
      ]);

      // キャッシュクリア
      await cacheManager.deletePattern(`recipe:*${recipeId}*`);

      res.status(201).json({
        success: true,
        data: {
          id: comment.id.toString(),
          content: comment.content,
          likesCount: comment.likesCount,
          user: comment.user,
          createdAt: comment.createdAt.toISOString(),
          updatedAt: comment.updatedAt.toISOString(),
        },
      });

      logger.info(`Comment added to recipe ${recipeId} by user ${userId}`);
    } catch (error) {
      logger.error("Error adding comment:", error);
      res.status(500).json({
        success: false,
        error: "コメントの投稿に失敗しました",
      });
    }
  }
);

export default router;
