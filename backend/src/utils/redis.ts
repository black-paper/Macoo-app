/**
 * Redis connection and caching utilities
 * キャッシュ管理、セッション管理用
 */

import { createClient, RedisClientType } from "redis";
import { logger } from "./logger";

let redisClient: RedisClientType;

/**
 * Redis接続設定
 */
export async function connectRedis(): Promise<void> {
  try {
    const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

    redisClient = createClient({
      url: redisUrl,
      socket: {
        connectTimeout: 5000,
        reconnectStrategy: (retries) => {
          if (retries > 10) {
            logger.error("❌ Redis reconnection attempts exceeded");
            return false;
          }
          return Math.min(retries * 50, 1000);
        },
      },
    });

    // エラーハンドリング
    redisClient.on("error", (error) => {
      logger.error("❌ Redis error:", error);
    });

    redisClient.on("connect", () => {
      logger.info("🔄 Redis connecting...");
    });

    redisClient.on("ready", () => {
      logger.info("✅ Redis connected and ready");
    });

    redisClient.on("end", () => {
      logger.info("🔌 Redis connection ended");
    });

    redisClient.on("reconnecting", () => {
      logger.info("🔄 Redis reconnecting...");
    });

    // 接続実行
    await redisClient.connect();

    // 接続テスト
    await redisClient.ping();
    logger.info("✅ Redis connectivity test passed");
  } catch (error) {
    logger.error("❌ Redis connection failed:", error);
    throw error;
  }
}

/**
 * Redis切断
 */
export async function disconnectRedis(): Promise<void> {
  try {
    if (redisClient && redisClient.isOpen) {
      await redisClient.quit();
      logger.info("🔌 Redis disconnected");
    }
  } catch (error) {
    logger.error("❌ Redis disconnection failed:", error);
    throw error;
  }
}

/**
 * Redisヘルスチェック
 */
export async function checkRedisHealth(): Promise<boolean> {
  try {
    if (!redisClient || !redisClient.isOpen) {
      return false;
    }
    const response = await redisClient.ping();
    return response === "PONG";
  } catch (error) {
    logger.error("❌ Redis health check failed:", error);
    return false;
  }
}

/**
 * キャッシュ操作ユーティリティ
 */
export class CacheManager {
  /**
   * データをキャッシュに保存
   */
  static async set(
    key: string,
    value: any,
    ttlSeconds: number = 3600
  ): Promise<void> {
    try {
      const serializedValue = JSON.stringify(value);
      await redisClient.setEx(key, ttlSeconds, serializedValue);
      logger.debug(`📦 Cached data for key: ${key} (TTL: ${ttlSeconds}s)`);
    } catch (error) {
      logger.error(`❌ Failed to cache data for key: ${key}`, error);
      throw error;
    }
  }

  /**
   * キャッシュからデータを取得
   */
  static async get<T>(key: string): Promise<T | null> {
    try {
      const cachedValue = await redisClient.get(key);
      if (!cachedValue) {
        logger.debug(`📭 Cache miss for key: ${key}`);
        return null;
      }

      logger.debug(`📬 Cache hit for key: ${key}`);
      return JSON.parse(cachedValue) as T;
    } catch (error) {
      logger.error(`❌ Failed to get cached data for key: ${key}`, error);
      return null;
    }
  }

  /**
   * キャッシュを削除
   */
  static async delete(key: string): Promise<void> {
    try {
      await redisClient.del(key);
      logger.debug(`🗑️  Deleted cache for key: ${key}`);
    } catch (error) {
      logger.error(`❌ Failed to delete cache for key: ${key}`, error);
      throw error;
    }
  }

  /**
   * パターンマッチでキャッシュを削除
   */
  static async deletePattern(pattern: string): Promise<void> {
    try {
      const keys = await redisClient.keys(pattern);
      if (keys.length > 0) {
        await redisClient.del(keys);
        logger.debug(
          `🗑️  Deleted ${keys.length} cache entries matching pattern: ${pattern}`
        );
      }
    } catch (error) {
      logger.error(`❌ Failed to delete cache pattern: ${pattern}`, error);
      throw error;
    }
  }

  /**
   * キャッシュの存在確認
   */
  static async exists(key: string): Promise<boolean> {
    try {
      const exists = await redisClient.exists(key);
      return exists === 1;
    } catch (error) {
      logger.error(`❌ Failed to check cache existence for key: ${key}`, error);
      return false;
    }
  }

  /**
   * TTL取得
   */
  static async getTTL(key: string): Promise<number> {
    try {
      return await redisClient.ttl(key);
    } catch (error) {
      logger.error(`❌ Failed to get TTL for key: ${key}`, error);
      return -1;
    }
  }

  /**
   * 複数キー一括取得
   */
  static async getMultiple<T>(
    keys: string[]
  ): Promise<Record<string, T | null>> {
    try {
      const values = await redisClient.mGet(keys);
      const result: Record<string, T | null> = {};

      keys.forEach((key, index) => {
        const value = values[index];
        result[key] = value ? (JSON.parse(value) as T) : null;
      });

      return result;
    } catch (error) {
      logger.error("❌ Failed to get multiple cache entries", error);
      throw error;
    }
  }

  /**
   * 複数キー一括設定
   */
  static async setMultiple(
    entries: Record<string, any>,
    ttlSeconds: number = 3600
  ): Promise<void> {
    try {
      const pipeline = redisClient.multi();

      Object.entries(entries).forEach(([key, value]) => {
        const serializedValue = JSON.stringify(value);
        pipeline.setEx(key, ttlSeconds, serializedValue);
      });

      await pipeline.exec();
      logger.debug(`📦 Cached ${Object.keys(entries).length} entries`);
    } catch (error) {
      logger.error("❌ Failed to set multiple cache entries", error);
      throw error;
    }
  }
}

/**
 * セッション管理ユーティリティ
 */
export class SessionManager {
  private static SESSION_PREFIX = "session:";
  private static DEFAULT_TTL = 7 * 24 * 60 * 60; // 7日

  /**
   * セッション保存
   */
  static async setSession(
    sessionId: string,
    data: any,
    ttlSeconds: number = this.DEFAULT_TTL
  ): Promise<void> {
    const key = this.SESSION_PREFIX + sessionId;
    await CacheManager.set(key, data, ttlSeconds);
  }

  /**
   * セッション取得
   */
  static async getSession<T>(sessionId: string): Promise<T | null> {
    const key = this.SESSION_PREFIX + sessionId;
    return await CacheManager.get<T>(key);
  }

  /**
   * セッション削除
   */
  static async deleteSession(sessionId: string): Promise<void> {
    const key = this.SESSION_PREFIX + sessionId;
    await CacheManager.delete(key);
  }
}

// プロセス終了時の自動切断
process.on("beforeExit", async () => {
  await disconnectRedis();
});

export { redisClient };
export default CacheManager;
