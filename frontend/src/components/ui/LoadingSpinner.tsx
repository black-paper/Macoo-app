/**
 * 再利用可能なLoadingSpinnerコンポーネント
 */

import React from "react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "md",
  className = "",
  message,
}) => {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-32 w-32",
    lg: "h-48 w-48",
  };

  const containerClasses = {
    sm: "text-center",
    md: "text-center",
    lg: "text-center",
  };

  const textClasses = {
    sm: "text-sm",
    md: "text-xl",
    lg: "text-2xl",
  };

  return (
    <div className={`${containerClasses[size]} ${className}`}>
      <div
        className={`animate-spin rounded-full border-b-2 border-primary-600 mx-auto mb-4 ${sizeClasses[size]}`}
      ></div>
      {message && (
        <p className={`text-gray-600 ${textClasses[size]}`}>{message}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;
