/**
 * 再利用可能なErrorMessageコンポーネント
 */

import React from "react";
import Button from "./Button";

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  className?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  onRetry,
  className = "",
}) => {
  return (
    <div className={`text-center ${className}`}>
      <div className="w-32 h-32 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-8">
        <svg
          className="w-16 h-16 text-red-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <h2 className="text-3xl font-bold text-gray-900 mb-4">
        エラーが発生しました
      </h2>
      <p className="text-gray-600 text-lg mb-8">{message}</p>
      {onRetry && (
        <Button variant="primary" size="lg" onClick={onRetry}>
          再試行
        </Button>
      )}
    </div>
  );
};

export default ErrorMessage;
