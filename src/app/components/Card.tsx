import React from "react";

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ title, children, className = "" }) => {
  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 h-full flex flex-col ${className}`}
    >
      {title && (
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>
        </div>
      )}
      <div className="p-4 flex-1 min-h-0">{children}</div>
    </div>
  );
};

export default Card;
