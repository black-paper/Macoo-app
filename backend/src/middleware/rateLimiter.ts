/**
 * Rate Limiting Middleware
 * API レート制限とDDoS防護
 */

import { Request } from "express";
import rateLimit from "express-rate-limit";

// 基本的なレート制限設定
const windowMs = Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000; // 15分
const maxRequests = Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 100; // 100リクエスト

/**
 * 一般APIエンドポイント用レート制限
 */
export const rateLimiter = rateLimit({
  windowMs,
  max: maxRequests,
  message: {
    success: false,
    error: {
      message:
        "リクエスト制限に達しました。しばらく時間をおいてから再試行してください。",
      status: 429,
      timestamp: new Date().toISOString(),
      retryAfter: Math.ceil(windowMs / 1000),
    },
  },
  standardHeaders: true, // `RateLimit-*` headers を返す
  legacyHeaders: false, // `X-RateLimit-*` headers を無効化
  keyGenerator: (req: Request): string => {
    // IPアドレスとUser-Agentでキーを生成（より精密な制御）
    return `${req.ip}-${req.get("User-Agent") || "unknown"}`;
  },
  skip: (req: Request): boolean => {
    // ヘルスチェックエンドポイントはスキップ
    return req.path === "/health";
  },
});

/**
 * 認証エンドポイント用厳格なレート制限
 */
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分
  max: 5, // 5回まで
  message: {
    success: false,
    error: {
      message: "認証試行回数が上限に達しました。15分後に再試行してください。",
      status: 429,
      timestamp: new Date().toISOString(),
      retryAfter: 900, // 15分
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: Request): string => {
    return `auth-${req.ip}`;
  },
});

/**
 * ファイルアップロード用レート制限
 */
export const uploadRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1分
  max: 10, // 10ファイルまで
  message: {
    success: false,
    error: {
      message:
        "ファイルアップロード制限に達しました。1分後に再試行してください。",
      status: 429,
      timestamp: new Date().toISOString(),
      retryAfter: 60,
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: Request): string => {
    return `upload-${req.ip}`;
  },
});

/**
 * 検索エンドポイント用レート制限
 */
export const searchRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1分
  max: 30, // 30回まで
  message: {
    success: false,
    error: {
      message: "検索リクエスト制限に達しました。1分後に再試行してください。",
      status: 429,
      timestamp: new Date().toISOString(),
      retryAfter: 60,
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: Request): string => {
    return `search-${req.ip}`;
  },
});
