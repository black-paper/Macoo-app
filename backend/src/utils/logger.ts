/**
 * Logger utility using Winston
 * 構造化ログとファイル出力対応
 */

import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

const logLevel = process.env.LOG_LEVEL || "info";
const isDevelopment = process.env.NODE_ENV === "development";

// ログフォーマット設定
const logFormat = winston.format.combine(
  winston.format.timestamp({
    format: "YYYY-MM-DD HH:mm:ss",
  }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
  winston.format.colorize({ all: isDevelopment })
);

// 開発環境用の簡単なフォーマット
const devFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({
    format: "HH:mm:ss",
  }),
  winston.format.printf(({ timestamp, level, message, stack }) => {
    return `${timestamp} [${level}]: ${stack || message}`;
  })
);

// ログ出力設定
const transports: winston.transport[] = [
  new winston.transports.Console({
    level: logLevel,
    format: isDevelopment ? devFormat : logFormat,
  }),
];

// 本番環境ではファイル出力も追加
if (!isDevelopment) {
  // エラーログファイル
  transports.push(
    new DailyRotateFile({
      filename: "logs/error-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      level: "error",
      maxFiles: "30d",
      maxSize: "20m",
      format: logFormat,
    })
  );

  // 全ログファイル
  transports.push(
    new DailyRotateFile({
      filename: "logs/app-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      maxFiles: "14d",
      maxSize: "20m",
      format: logFormat,
    })
  );
}

// Winstonインスタンス作成
export const logger = winston.createLogger({
  level: logLevel,
  format: logFormat,
  transports,
  exitOnError: false,
  // 未処理例外をキャッチ
  exceptionHandlers: [
    new winston.transports.Console({
      format: isDevelopment ? devFormat : logFormat,
    }),
  ],
  // 未処理Promise rejectionsをキャッチ
  rejectionHandlers: [
    new winston.transports.Console({
      format: isDevelopment ? devFormat : logFormat,
    }),
  ],
});

// 開発環境でのデバッグ情報表示
if (isDevelopment) {
  logger.debug("🔧 Logger initialized in development mode");
  logger.debug(`📊 Log level: ${logLevel}`);
}

export default logger;
