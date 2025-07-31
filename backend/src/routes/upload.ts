/**
 * Upload API Routes
 * ファイルアップロード関連のAPIエンドポイント
 */

import { Request, Response, Router } from "express";
import { logger } from "../utils/logger";

const router = Router();

/**
 * ファイルアップロード
 * POST /upload
 */
router.post("/", async (req: Request, res: Response) => {
  try {
    // TODO: multer とsharpを使った画像アップロード処理を実装
    res.status(501).json({
      success: false,
      error: "ファイルアップロード機能は未実装です",
      message: "今後のアップデートで実装予定です",
    });

    logger.info("File upload attempted (not implemented)");
  } catch (error) {
    logger.error("Error in upload:", error);
    res.status(500).json({
      success: false,
      error: "アップロード処理でエラーが発生しました",
    });
  }
});

/**
 * 画像最適化アップロード
 * POST /upload/images
 */
router.post("/images", async (req: Request, res: Response) => {
  try {
    // TODO: 画像の最適化処理を実装
    res.status(501).json({
      success: false,
      error: "画像アップロード機能は未実装です",
      message: "今後のアップデートで実装予定です",
    });

    logger.info("Image upload attempted (not implemented)");
  } catch (error) {
    logger.error("Error in image upload:", error);
    res.status(500).json({
      success: false,
      error: "画像アップロード処理でエラーが発生しました",
    });
  }
});

export default router;
