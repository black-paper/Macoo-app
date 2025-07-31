/**
 * Database Seeding Script
 * 既存のフロントエンドハードコードデータをMySQLに投入
 */

import bcrypt from "bcrypt";
import slugify from "slugify";
import { prisma } from "./database";
import { logger } from "./logger";

// 既存のレシピデータ（フロントエンドから移行）
const recipesData = [
  {
    id: 1,
    title: "ペットボトルプランター",
    description:
      "使い終わったペットボトルを活用した環境に優しいプランターの作り方。初心者でも簡単に作れて、お家で野菜やハーブを育てることができます。",
    image: "planter",
    likes: 124,
    level: "初級",
    category: "ガーデニング",
    author: "山田太郎",
    time: "30分",
    difficulty: "beginner" as const,
    materials: [
      "2Lペットボトル × 1本",
      "土 × 適量",
      "種または苗 × 1つ",
      "小石または軽石 × 少々",
      "ビニールテープ × 1巻",
      "アクリル絵の具（お好みで）",
    ],
    tools: [
      "カッター",
      "はさみ",
      "ドリル（または千枚通し）",
      "定規",
      "ペン・マーカー",
      "ペイントブラシ（装飾する場合）",
    ],
    steps: [
      {
        step: 1,
        title: "ペットボトルのカット",
        description:
          "ペットボトルを上から1/3の位置でカットします。切り口はなめらかになるようにやすりをかけましょう。",
        tip: "子供と一緒に作る場合は、大人がカット作業を行ってください。",
      },
      {
        step: 2,
        title: "排水穴の作成",
        description:
          "ボトルの底の部分に、ドリルまたは千枚通しで5〜6個の穴をあけます。水はけを良くするための重要な工程です。",
        tip: "穴は直径3-4mm程度が適切です。大きすぎると土が流れ出てしまいます。",
      },
      {
        step: 3,
        title: "装飾（オプション）",
        description:
          "お好みでアクリル絵の具を使ってペットボトルをデコレーションします。完全に乾くまで待ちましょう。",
        tip: "マスキングテープを使えば、きれいな模様を描くことができます。",
      },
      {
        step: 4,
        title: "土と種の準備",
        description:
          "底に小石を敷き、その上に土を入れます。種を植えるか、苗を植えて軽く水をあげましょう。",
        tip: "土は野菜用の培養土を使用することをおすすめします。",
      },
      {
        step: 5,
        title: "完成・管理",
        description:
          "日当たりの良い場所に置き、適度に水やりをしながら育てましょう。成長を楽しみに待ちます！",
        tip: "水やりは土が乾いたらたっぷりと。毎日の観察が成功の秘訣です。",
      },
    ],
    tags: [
      "エコ",
      "ガーデニング",
      "初心者",
      "リサイクル",
      "ペットボトル",
      "野菜",
      "ハーブ",
    ],
    createdAt: "2024-01-15",
    views: 1456,
    comments: [
      {
        author: "田中みか",
        content:
          "とても分かりやすい説明で、子供と一緒に作ることができました！バジルを植えて、今では料理に使えるほど育っています。",
        date: "2024-01-20",
        likes: 12,
      },
      {
        author: "佐藤けん",
        content:
          "排水穴のサイズが参考になりました。最初失敗したのですが、アドバイス通りにしたらうまくいきました。",
        date: "2024-01-22",
        likes: 8,
      },
      {
        author: "山本さくら",
        content:
          "プランターを買う必要がなくて経済的ですね。いろんな野菜で試してみたいと思います！",
        date: "2024-01-25",
        likes: 15,
      },
    ],
  },
  {
    id: 2,
    title: "古着リメイクバッグ",
    description:
      "着なくなった古着を使ったエコバッグの作り方とデザインアイデア。お気に入りの服を新しい形で生まれ変わらせましょう。",
    image: "bag",
    likes: 89,
    level: "中級",
    category: "衣類・アクセサリー",
    author: "佐藤花子",
    time: "90分",
    difficulty: "intermediate" as const,
    materials: ["古いTシャツ", "糸", "ボタン（オプション）"],
    tools: ["ミシン", "はさみ", "まち針"],
    steps: [
      {
        step: 1,
        title: "デザイン決め",
        description: "どのような形のバッグにするか決めます。",
      },
      {
        step: 2,
        title: "パターン作成",
        description: "型紙を作成します。",
      },
      {
        step: 3,
        title: "裁断",
        description: "生地を型紙に合わせて裁断します。",
      },
    ],
    tags: ["リメイク", "古着", "バッグ", "中級"],
    createdAt: "2024-01-10",
    views: 890,
    comments: [],
  },
  {
    id: 3,
    title: "廃材ウッドシェルフ",
    description:
      "廃材を使ったシンプルでおしゃれな壁掛けシェルフの制作方法。工具の使い方も詳しく説明しています。",
    image: "shelf",
    likes: 156,
    level: "上級",
    category: "家具・インテリア",
    author: "田中和也",
    time: "180分",
    difficulty: "advanced" as const,
    materials: ["廃材（木材）", "ネジ", "L字金具", "ワックス"],
    tools: ["のこぎり", "ドリル", "やすり", "メジャー"],
    steps: [
      {
        step: 1,
        title: "設計",
        description: "シェルフの寸法を決めて設計します。",
      },
      {
        step: 2,
        title: "材料準備",
        description: "廃材を必要なサイズにカットします。",
      },
      {
        step: 3,
        title: "組み立て",
        description: "L字金具を使って組み立てます。",
      },
    ],
    tags: ["廃材", "木工", "シェルフ", "上級"],
    createdAt: "2024-01-05",
    views: 2340,
    comments: [],
  },
  {
    id: 4,
    title: "カーペット端材でコースター",
    description:
      "カーペットの端材を使った可愛いコースターの作り方。短時間で作れるのでプレゼントにもおすすめです。",
    image: "coaster",
    likes: 67,
    level: "初級",
    category: "家具・インテリア",
    author: "鈴木みか",
    time: "45分",
    difficulty: "beginner" as const,
    materials: ["カーペット端材", "ボンド", "はさみ"],
    tools: ["定規", "ペン"],
    steps: [
      {
        step: 1,
        title: "サイズ決め",
        description: "コースターのサイズを決めて型紙を作ります。",
      },
    ],
    tags: ["端材", "コースター", "初心者", "プレゼント"],
    createdAt: "2024-01-12",
    views: 567,
    comments: [],
  },
  {
    id: 5,
    title: "段ボール収納ボックス",
    description:
      "段ボールをおしゃれに変身させる収納ボックスのDIY。子供と一緒に作れる楽しいプロジェクトです。",
    image: "storage",
    likes: 203,
    level: "中級",
    category: "収納・整理",
    author: "高橋一郎",
    time: "120分",
    difficulty: "intermediate" as const,
    materials: ["段ボール", "装飾紙", "のり"],
    tools: ["カッター", "定規"],
    steps: [
      {
        step: 1,
        title: "設計図作成",
        description: "収納ボックスの設計図を作成します。",
      },
    ],
    tags: ["段ボール", "収納", "中級", "子供"],
    createdAt: "2024-01-08",
    views: 1234,
    comments: [],
  },
  {
    id: 6,
    title: "ワイン瓶キャンドルホルダー",
    description:
      "ワインボトルを再利用したおしゃれなキャンドルホルダー。ロマンチックな雰囲気作りにぴったりです。",
    image: "candle",
    likes: 91,
    level: "中級",
    category: "ライト・照明",
    author: "中村さくら",
    time: "60分",
    difficulty: "intermediate" as const,
    materials: ["ワインボトル", "キャンドル"],
    tools: ["ボトルカッター", "やすり"],
    steps: [
      {
        step: 1,
        title: "ボトル準備",
        description: "ワインボトルをきれいに洗います。",
      },
    ],
    tags: ["ワインボトル", "キャンドル", "中級", "ロマンチック"],
    createdAt: "2024-01-18",
    views: 789,
    comments: [],
  },
];

/**
 * パスワードハッシュ化
 */
async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
}

/**
 * スラッグ生成
 */
function generateSlug(text: string): string {
  return slugify(text, {
    lower: true,
    strict: true,
    locale: "ja",
  });
}

/**
 * シードデータ投入メイン処理
 */
async function seedDatabase() {
  try {
    logger.info("🌱 Database seeding started...");

    // 1. 既存データクリア
    logger.info("🧹 Cleaning existing data...");
    await prisma.recipeView.deleteMany();
    await prisma.commentLike.deleteMany();
    await prisma.recipeComment.deleteMany();
    await prisma.recipeLike.deleteMany();
    await prisma.recipeTag.deleteMany();
    await prisma.recipeStep.deleteMany();
    await prisma.recipeTool.deleteMany();
    await prisma.recipeMaterial.deleteMany();
    await prisma.recipe.deleteMany();
    await prisma.tag.deleteMany();
    await prisma.category.deleteMany();
    await prisma.user.deleteMany();

    // 2. カテゴリ作成
    logger.info("📂 Creating categories...");
    const categories = await Promise.all([
      prisma.category.create({
        data: {
          name: "ガーデニング",
          slug: "gardening",
          description: "植物やガーデン関連のDIYプロジェクト",
          iconName: "leaf",
          colorCode: "#22c55e",
          sortOrder: 1,
        },
      }),
      prisma.category.create({
        data: {
          name: "衣類・アクセサリー",
          slug: "clothing-accessories",
          description: "古着リメイクやアクセサリー制作",
          iconName: "shirt",
          colorCode: "#3b82f6",
          sortOrder: 2,
        },
      }),
      prisma.category.create({
        data: {
          name: "家具・インテリア",
          slug: "furniture-interior",
          description: "家具制作やインテリアデザイン",
          iconName: "home",
          colorCode: "#f97316",
          sortOrder: 3,
        },
      }),
      prisma.category.create({
        data: {
          name: "収納・整理",
          slug: "storage-organization",
          description: "収納ボックスや整理用品の制作",
          iconName: "archive",
          colorCode: "#6b7280",
          sortOrder: 4,
        },
      }),
      prisma.category.create({
        data: {
          name: "ライト・照明",
          slug: "lighting",
          description: "照明器具やキャンドルホルダーなど",
          iconName: "lightbulb",
          colorCode: "#fbbf24",
          sortOrder: 5,
        },
      }),
    ]);

    // 3. タグ作成
    logger.info("🏷️ Creating tags...");
    const tagNames = [
      "エコ",
      "リサイクル",
      "初心者",
      "中級",
      "上級",
      "ペットボトル",
      "古着",
      "廃材",
      "木工",
      "裁縫",
      "リメイク",
      "バッグ",
      "シェルフ",
      "端材",
      "コースター",
      "プレゼント",
      "段ボール",
      "収納",
      "子供",
      "ワインボトル",
      "キャンドル",
      "ロマンチック",
      "ガーデニング",
      "ハーブ",
      "野菜",
    ];

    const tags = await Promise.all(
      tagNames.map((name) =>
        prisma.tag.create({
          data: {
            name,
            slug: generateSlug(name),
          },
        })
      )
    );

    // 4. ユーザー作成
    logger.info("👥 Creating users...");
    const users = await Promise.all([
      prisma.user.create({
        data: {
          username: "yamada_taro",
          email: "yamada@example.com",
          passwordHash: await hashPassword("password123"),
          displayName: "山田太郎",
          bio: "DIY初心者ですが、頑張って投稿しています！",
          isVerified: true,
        },
      }),
      prisma.user.create({
        data: {
          username: "sato_hanako",
          email: "sato@example.com",
          passwordHash: await hashPassword("password123"),
          displayName: "佐藤花子",
          bio: "古着リメイクが得意です。環境に優しいDIYを心がけています。",
          isVerified: true,
        },
      }),
      prisma.user.create({
        data: {
          username: "tanaka_kazuya",
          email: "tanaka@example.com",
          passwordHash: await hashPassword("password123"),
          displayName: "田中和也",
          bio: "木工職人です。廃材を使った家具作りを教えています。",
          isVerified: true,
        },
      }),
      prisma.user.create({
        data: {
          username: "suzuki_mika",
          email: "suzuki@example.com",
          passwordHash: await hashPassword("password123"),
          displayName: "鈴木みか",
          bio: "手芸が趣味です。小物作りが得意です。",
          isVerified: false,
        },
      }),
      prisma.user.create({
        data: {
          username: "takahashi_ichiro",
          email: "takahashi@example.com",
          passwordHash: await hashPassword("password123"),
          displayName: "高橋一郎",
          bio: "収納の専門家です。整理整頓のコツをシェアします。",
          isVerified: true,
        },
      }),
      prisma.user.create({
        data: {
          username: "nakamura_sakura",
          email: "nakamura@example.com",
          passwordHash: await hashPassword("password123"),
          displayName: "中村さくら",
          bio: "インテリアデザイナーです。おしゃれなDIYを提案します。",
          isVerified: true,
        },
      }),
    ]);

    // 5. レシピ作成
    logger.info("📝 Creating recipes...");
    for (const recipeData of recipesData) {
      // 作者を検索
      const author = users.find((u) => u.displayName === recipeData.author);
      if (!author) {
        logger.warn(`Author not found: ${recipeData.author}`);
        continue;
      }

      // カテゴリを検索
      const category = categories.find((c) => c.name === recipeData.category);
      if (!category) {
        logger.warn(`Category not found: ${recipeData.category}`);
        continue;
      }

      // レシピ作成
      const recipe = await prisma.recipe.create({
        data: {
          title: recipeData.title,
          slug: generateSlug(recipeData.title),
          description: recipeData.description,
          difficulty: recipeData.difficulty,
          estimatedTimeMinutes: parseInt(recipeData.time.replace("分", "")),
          categoryId: category.id,
          authorId: author.id,
          status: "published",
          likesCount: recipeData.likes,
          viewsCount: recipeData.views,
          publishedAt: new Date(recipeData.createdAt),
        },
      });

      // 材料追加
      if (recipeData.materials) {
        await Promise.all(
          recipeData.materials.map((material, index) =>
            prisma.recipeMaterial.create({
              data: {
                recipeId: recipe.id,
                name: material,
                sortOrder: index,
              },
            })
          )
        );
      }

      // 道具追加
      if (recipeData.tools) {
        await Promise.all(
          recipeData.tools.map((tool, index) =>
            prisma.recipeTool.create({
              data: {
                recipeId: recipe.id,
                name: tool,
                sortOrder: index,
              },
            })
          )
        );
      }

      // 手順追加
      if (recipeData.steps) {
        await Promise.all(
          recipeData.steps.map((step, index) =>
            prisma.recipeStep.create({
              data: {
                recipeId: recipe.id,
                stepNumber: step.step,
                title: step.title,
                description: step.description,
                tip: step.tip,
                sortOrder: index,
              },
            })
          )
        );
      }

      // タグ追加
      if (recipeData.tags) {
        const recipeTags = tags.filter((tag) =>
          recipeData.tags.includes(tag.name)
        );
        await Promise.all(
          recipeTags.map((tag) =>
            prisma.recipeTag.create({
              data: {
                recipeId: recipe.id,
                tagId: tag.id,
              },
            })
          )
        );

        // タグ使用回数更新
        await Promise.all(
          recipeTags.map((tag) =>
            prisma.tag.update({
              where: { id: tag.id },
              data: { usageCount: { increment: 1 } },
            })
          )
        );
      }

      // コメント追加
      if (recipeData.comments) {
        for (const commentData of recipeData.comments) {
          // コメント作者を検索（存在しない場合は新規作成）
          let commentAuthor = users.find(
            (u) => u.displayName === commentData.author
          );
          if (!commentAuthor) {
            commentAuthor = await prisma.user.create({
              data: {
                username: generateSlug(commentData.author),
                email: `${generateSlug(commentData.author)}@example.com`,
                passwordHash: await hashPassword("password123"),
                displayName: commentData.author,
                isVerified: false,
              },
            });
          }

          await prisma.recipeComment.create({
            data: {
              recipeId: recipe.id,
              userId: commentAuthor.id,
              content: commentData.content,
              likesCount: commentData.likes,
              createdAt: new Date(commentData.date),
            },
          });
        }

        // レシピのコメント数更新
        await prisma.recipe.update({
          where: { id: recipe.id },
          data: { commentsCount: recipeData.comments.length },
        });
      }

      logger.info(`✅ Recipe created: ${recipe.title}`);
    }

    // 6. 統計データ更新
    logger.info("📊 Updating statistics...");
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await prisma.dailyStat.create({
      data: {
        date: today,
        totalRecipes: await prisma.recipe.count(),
        totalUsers: await prisma.user.count(),
        totalViews: recipesData.reduce((sum, recipe) => sum + recipe.views, 0),
        totalLikes: recipesData.reduce((sum, recipe) => sum + recipe.likes, 0),
        totalComments: recipesData.reduce(
          (sum, recipe) => sum + recipe.comments.length,
          0
        ),
      },
    });

    logger.info("🎉 Database seeding completed successfully!");

    // 投入結果サマリー
    const summary = {
      users: await prisma.user.count(),
      categories: await prisma.category.count(),
      tags: await prisma.tag.count(),
      recipes: await prisma.recipe.count(),
      comments: await prisma.recipeComment.count(),
      materials: await prisma.recipeMaterial.count(),
      tools: await prisma.recipeTool.count(),
      steps: await prisma.recipeStep.count(),
    };

    logger.info("📈 Seeding Summary:", summary);
  } catch (error) {
    logger.error("❌ Database seeding failed:", error);
    throw error;
  }
}

// スクリプト実行
if (require.main === module) {
  seedDatabase()
    .then(() => {
      logger.info("✅ Seed script completed");
      process.exit(0);
    })
    .catch((error) => {
      logger.error("❌ Seed script failed:", error);
      process.exit(1);
    });
}

export { seedDatabase };
