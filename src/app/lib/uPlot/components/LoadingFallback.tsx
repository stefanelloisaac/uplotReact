import React from "react";

interface LoadingFallbackProps {
  message?: string;
  className?: string;
}

export const LoadingFallback: React.FC<LoadingFallbackProps> = ({
  message = "Loading chart...",
  className = "w-full h-full min-h-0",
}) => {
  return (
    <div className={`flex items-center justify-center bg-inherit ${className}`}>
      <div className="text-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
        <div className="text-gray-500 text-sm">{message}</div>
      </div>
    </div>
  );
};

interface EmptyStateProps {
  message?: string;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  message = "No data available",
  className = "w-full h-full min-h-0",
}) => {
  return (
    <div
      className={`flex items-center justify-center bg-inherit border-2 border-dashed border-gray-300 rounded-lg ${className}`}
    >
      <div className="text-center p-4">
        <div className="text-gray-400 text-lg mb-2">📈</div>
        <div className="text-gray-500 text-sm">{message}</div>
      </div>
    </div>
  );
};
