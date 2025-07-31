/**
 * Health Check Routes
 * システム状態監視エンドポイント
 */

import { Request, Response, Router } from "express";
import { checkDBHealth, getDatabaseStats } from "../utils/database";
import { logger } from "../utils/logger";
import { checkRedisHealth } from "../utils/redis";

const router = Router();

/**
 * 基本ヘルスチェック
 * GET /health
 */
router.get("/", async (req: Request, res: Response) => {
  try {
    const [dbHealth, redisHealth] = await Promise.all([
      checkDBHealth(),
      checkRedisHealth(),
    ]);

    const isHealthy = dbHealth && redisHealth;
    const status = isHealthy ? 200 : 503;

    const healthData = {
      status: isHealthy ? "healthy" : "unhealthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.env.npm_package_version || "1.0.0",
      environment: process.env.NODE_ENV,
      services: {
        database: {
          status: dbHealth ? "up" : "down",
          type: "MySQL",
        },
        cache: {
          status: redisHealth ? "up" : "down",
          type: "Redis",
        },
      },
      system: {
        memory: {
          used:
            Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 100) /
            100,
          total:
            Math.round((process.memoryUsage().heapTotal / 1024 / 1024) * 100) /
            100,
          unit: "MB",
        },
        nodeVersion: process.version,
        platform: process.platform,
      },
    };

    res.status(status).json(healthData);

    if (!isHealthy) {
      logger.warn("Health check failed:", {
        database: dbHealth,
        redis: redisHealth,
      });
    }
  } catch (error) {
    logger.error("Health check error:", error);

    res.status(503).json({
      status: "error",
      timestamp: new Date().toISOString(),
      error: "Health check failed",
      services: {
        database: { status: "unknown" },
        cache: { status: "unknown" },
      },
    });
  }
});

/**
 * 詳細ヘルスチェック（データベース統計含む）
 * GET /health/detailed
 */
router.get("/detailed", async (req: Request, res: Response) => {
  try {
    const [dbHealth, redisHealth, dbStats] = await Promise.all([
      checkDBHealth(),
      checkRedisHealth(),
      getDatabaseStats().catch(() => null),
    ]);

    const isHealthy = dbHealth && redisHealth;

    res.status(isHealthy ? 200 : 503).json({
      status: isHealthy ? "healthy" : "unhealthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.env.npm_package_version || "1.0.0",
      environment: process.env.NODE_ENV,
      services: {
        database: {
          status: dbHealth ? "up" : "down",
          type: "MySQL",
          stats: dbStats,
        },
        cache: {
          status: redisHealth ? "up" : "down",
          type: "Redis",
        },
      },
      system: {
        memory: {
          used:
            Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 100) /
            100,
          total:
            Math.round((process.memoryUsage().heapTotal / 1024 / 1024) * 100) /
            100,
          external:
            Math.round((process.memoryUsage().external / 1024 / 1024) * 100) /
            100,
          unit: "MB",
        },
        cpu: {
          loadAverage:
            process.platform !== "win32" ? require("os").loadavg() : null,
          uptime: require("os").uptime(),
        },
        nodeVersion: process.version,
        platform: process.platform,
        arch: process.arch,
      },
    });
  } catch (error) {
    logger.error("Detailed health check error:", error);

    res.status(503).json({
      status: "error",
      timestamp: new Date().toISOString(),
      error: "Detailed health check failed",
    });
  }
});

/**
 * Readiness probe（k8s用）
 * GET /health/ready
 */
router.get("/ready", async (req: Request, res: Response) => {
  try {
    const [dbHealth, redisHealth] = await Promise.all([
      checkDBHealth(),
      checkRedisHealth(),
    ]);

    if (dbHealth && redisHealth) {
      res.status(200).json({ status: "ready" });
    } else {
      res.status(503).json({ status: "not ready" });
    }
  } catch (error) {
    res.status(503).json({ status: "not ready", error: "Check failed" });
  }
});

/**
 * Liveness probe（k8s用）
 * GET /health/live
 */
router.get("/live", (req: Request, res: Response) => {
  res.status(200).json({
    status: "alive",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

export default router;
