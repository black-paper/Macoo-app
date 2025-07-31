/**
 * Global Error Handler Middleware
 * 統一されたエラーレスポンス処理
 */

import { NextFunction, Request, Response } from "express";
import { logger } from "../utils/logger";

export interface CustomError extends Error {
  status?: number;
  statusCode?: number;
  code?: string;
  keyValue?: Record<string, any>;
  path?: string;
  value?: any;
}

/**
 * エラーレスポンス形式
 */
interface ErrorResponse {
  success: false;
  error: {
    message: string;
    status: number;
    timestamp: string;
    path: string;
    requestId?: string;
    stack?: string;
    details?: any;
  };
}

/**
 * Prismaエラーハンドリング
 */
function handlePrismaError(error: any): {
  message: string;
  status: number;
  details?: any;
} {
  switch (error.code) {
    case "P2002":
      return {
        message: "既に存在するデータです",
        status: 409,
        details: { field: error.meta?.target },
      };
    case "P2025":
      return {
        message: "指定されたデータが見つかりません",
        status: 404,
      };
    case "P2003":
      return {
        message: "関連データが存在しないため操作できません",
        status: 400,
      };
    case "P2014":
      return {
        message: "データの依存関係エラーです",
        status: 400,
      };
    default:
      return {
        message: "データベースエラーが発生しました",
        status: 500,
        details: { code: error.code },
      };
  }
}

/**
 * バリデーションエラーハンドリング
 */
function handleValidationError(error: any): {
  message: string;
  status: number;
  details?: any;
} {
  if (error.name === "ValidationError") {
    const errors = Object.values(error.errors).map((val: any) => val.message);
    return {
      message: "バリデーションエラーです",
      status: 400,
      details: { fields: errors },
    };
  }

  if (error.details && Array.isArray(error.details)) {
    // Joi validation error
    const errors = error.details.map((detail: any) => ({
      field: detail.path.join("."),
      message: detail.message,
    }));
    return {
      message: "入力データに不正があります",
      status: 400,
      details: { validation: errors },
    };
  }

  return {
    message: "バリデーションエラーです",
    status: 400,
  };
}

/**
 * メインエラーハンドラー
 */
export function errorHandler(
  error: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  let status = error.status || error.statusCode || 500;
  let message = error.message || "サーバーエラーが発生しました";
  let details: any = undefined;

  // 特定のエラータイプに応じた処理
  if (error.name === "PrismaClientKnownRequestError") {
    const handled = handlePrismaError(error);
    status = handled.status;
    message = handled.message;
    details = handled.details;
  } else if (error.name === "ValidationError" || error.details) {
    const handled = handleValidationError(error);
    status = handled.status;
    message = handled.message;
    details = handled.details;
  } else if (error.name === "JsonWebTokenError") {
    status = 401;
    message = "認証トークンが無効です";
  } else if (error.name === "TokenExpiredError") {
    status = 401;
    message = "認証トークンの有効期限が切れています";
  } else if (error.name === "MulterError") {
    status = 400;
    if (error.code === "LIMIT_FILE_SIZE") {
      message = "ファイルサイズが制限を超えています";
    } else if (error.code === "LIMIT_FILE_COUNT") {
      message = "ファイル数が制限を超えています";
    } else {
      message = "ファイルアップロードエラーです";
    }
  }

  // エラーログ出力
  const logData = {
    error: {
      name: error.name,
      message: error.message,
      status,
      stack: error.stack,
    },
    request: {
      method: req.method,
      url: req.url,
      ip: req.ip,
      userAgent: req.get("User-Agent"),
    },
  };

  if (status >= 500) {
    logger.error("Server Error:", logData);
  } else if (status >= 400) {
    logger.warn("Client Error:", logData);
  }

  // エラーレスポンス構築
  const errorResponse: ErrorResponse = {
    success: false,
    error: {
      message,
      status,
      timestamp: new Date().toISOString(),
      path: req.originalUrl,
      requestId: req.headers["x-request-id"] as string,
    },
  };

  // 開発環境ではスタックトレースも含める
  if (process.env.NODE_ENV === "development") {
    errorResponse.error.stack = error.stack;
    if (details) {
      errorResponse.error.details = details;
    }
  }

  res.status(status).json(errorResponse);
}
