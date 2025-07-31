/**
 * 404 Not Found Middleware
 * 存在しないエンドポイントへのアクセス処理
 */

import { NextFunction, Request, Response } from "express";

export function notFound(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const message = `エンドポイント ${req.originalUrl} は存在しません`;

  res.status(404).json({
    success: false,
    error: {
      message,
      status: 404,
      path: req.originalUrl,
      method: req.method,
      timestamp: new Date().toISOString(),
      availableEndpoints: {
        api: "/api",
        health: "/health",
        v1: {
          recipes: "/api/v1/recipes",
          users: "/api/v1/users",
          categories: "/api/v1/categories",
          tags: "/api/v1/tags",
          upload: "/api/v1/upload",
        },
      },
    },
  });
}
