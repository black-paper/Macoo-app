/**
 * 再利用可能なCardコンポーネント
 */

import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: "sm" | "md" | "lg";
}

const Card: React.FC<CardProps> = ({
  children,
  className = "",
  hover = true,
  padding = "md",
}) => {
  const baseClasses =
    "rounded-xl border border-gray-100 bg-white shadow-lg transition-all duration-300";

  const hoverClasses = hover ? "hover:-translate-y-1 hover:shadow-xl" : "";

  const paddingClasses = {
    sm: "p-4",
    md: "p-8",
    lg: "p-12",
  };

  const combinedClasses = `${baseClasses} ${hoverClasses} ${paddingClasses[padding]} ${className}`;

  return <div className={combinedClasses}>{children}</div>;
};

export default Card;
