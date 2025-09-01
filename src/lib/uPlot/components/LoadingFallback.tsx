import React from "react";

export type LoaderType = "data" | "theme" | "default";

interface LoadingFallbackProps {
  message?: string;
  className?: string;
  type?: LoaderType;
}

export const LoadingFallback: React.FC<LoadingFallbackProps> = ({
  message = "Loading chart...",
  className = "w-full h-full min-h-0",
  type = "default",
}) => {
  const getLoaderContent = () => {
    switch (type) {
      case "theme":
        return (
          <div className="text-center">
            <div className="relative mx-auto mb-3">
              <div className="w-8 h-8 border-3 border-muted/30 rounded-full"></div>
              <div className="absolute inset-0 w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
            <div className="text-muted-foreground text-sm font-medium">
              {message || "Applying theme..."}
            </div>
            <div className="text-muted-foreground/70 text-xs mt-1">
              Updating chart colors
            </div>
          </div>
        );

      case "data":
        return (
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 mb-3">
              <div
                className="w-1.5 h-6 bg-primary rounded-sm animate-pulse"
                style={{ animationDelay: "0ms" }}
              ></div>
              <div
                className="w-1.5 h-4 bg-primary/70 rounded-sm animate-pulse"
                style={{ animationDelay: "150ms" }}
              ></div>
              <div
                className="w-1.5 h-8 bg-primary rounded-sm animate-pulse"
                style={{ animationDelay: "300ms" }}
              ></div>
              <div
                className="w-1.5 h-3 bg-primary/70 rounded-sm animate-pulse"
                style={{ animationDelay: "450ms" }}
              ></div>
              <div
                className="w-1.5 h-5 bg-primary rounded-sm animate-pulse"
                style={{ animationDelay: "600ms" }}
              ></div>
            </div>
            <div className="text-muted-foreground text-sm font-medium">
              {message || "Processing data..."}
            </div>
            <div className="text-muted-foreground/70 text-xs mt-1">
              Preparing visualization
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center">
            <div className="relative mx-auto mb-3 w-6 h-6">
              <div className="absolute inset-0 rounded-full border-2 border-primary/30"></div>
              <div className="absolute inset-0 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
            </div>
            <div className="text-muted-foreground text-sm font-medium">
              {message}
            </div>
          </div>
        );
    }
  };

  return (
    <div
      className={`flex items-center justify-center bg-card/50 backdrop-blur-sm rounded-lg border border-border/50 ${className}`}
    >
      {getLoaderContent()}
    </div>
  );
};

// New overlay loader that preserves container height
interface LoadingOverlayProps {
  message?: string;
  type?: LoaderType;
  className?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  message = "Loading...",
  type = "default",
  className = "",
}) => {
  const getLoaderContent = () => {
    switch (type) {
      case "theme":
        return (
          <div className="text-center">
            <div className="relative mx-auto mb-2">
              <div className="w-8 h-8 border-3 border-background/30 rounded-full"></div>
              <div className="absolute inset-0 w-8 h-8 border-3 border-foreground border-t-transparent rounded-full animate-spin"></div>
            </div>
            <div className="text-foreground text-sm font-medium drop-shadow-sm">
              {message || "Applying theme..."}
            </div>
          </div>
        );

      case "data":
        return (
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 mb-2">
              <div
                className="w-1.5 h-6 bg-foreground/80 rounded-sm animate-pulse drop-shadow-sm"
                style={{ animationDelay: "0ms" }}
              ></div>
              <div
                className="w-1.5 h-4 bg-foreground/60 rounded-sm animate-pulse drop-shadow-sm"
                style={{ animationDelay: "150ms" }}
              ></div>
              <div
                className="w-1.5 h-8 bg-foreground/80 rounded-sm animate-pulse drop-shadow-sm"
                style={{ animationDelay: "300ms" }}
              ></div>
              <div
                className="w-1.5 h-3 bg-foreground/60 rounded-sm animate-pulse drop-shadow-sm"
                style={{ animationDelay: "450ms" }}
              ></div>
              <div
                className="w-1.5 h-5 bg-foreground/80 rounded-sm animate-pulse drop-shadow-sm"
                style={{ animationDelay: "600ms" }}
              ></div>
            </div>
            <div className="text-foreground text-sm font-medium drop-shadow-sm">
              {message || "Processing data..."}
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center">
            <div className="relative mx-auto mb-2 w-6 h-6">
              <div className="absolute inset-0 rounded-full border-2 border-background/30"></div>
              <div className="absolute inset-0 rounded-full border-2 border-foreground border-t-transparent animate-spin"></div>
            </div>
            <div className="text-foreground text-sm font-medium drop-shadow-sm">
              {message}
            </div>
          </div>
        );
    }
  };

  return (
    <div
      className={`absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-lg z-10 transition-all duration-200 ease-in-out ${className}`}
    >
      {getLoaderContent()}
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
      className={`flex items-center justify-center bg-muted/30 border-2 border-dashed border-muted-foreground/25 rounded-lg ${className}`}
    >
      <div className="text-center p-6">
        <div className="text-4xl mb-3 opacity-50">📊</div>
        <div className="text-muted-foreground text-sm font-medium mb-1">
          {message}
        </div>
        <div className="text-muted-foreground/70 text-xs">
          Check your data source
        </div>
      </div>
    </div>
  );
};
