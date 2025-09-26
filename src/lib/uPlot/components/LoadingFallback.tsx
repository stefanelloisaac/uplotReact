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
            <div className="relative mx-auto mb-4 w-8 h-8">
              <div className="absolute inset-0 w-8 h-8 border-2 border-muted/20 rounded-full"></div>
              <div className="absolute inset-0 w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin duration-700 ease-linear"></div>
            </div>
            <div className="text-muted-foreground text-sm font-medium animate-pulse">
              {message || "Applying theme..."}
            </div>
            <div className="text-muted-foreground/70 text-xs mt-2 animate-pulse" style={{ animationDelay: "200ms" }}>
              Updating chart colors
            </div>
          </div>
        );

      case "data":
        return (
          <div className="text-center">
            <div className="flex items-end justify-center space-x-1 mb-4 h-8">
              <div
                className="w-1.5 bg-primary rounded-sm transition-all duration-1000 ease-in-out"
                style={{ 
                  height: "1.5rem",
                  animation: "pulse 1.4s ease-in-out infinite",
                  animationDelay: "0ms"
                }}
              ></div>
              <div
                className="w-1.5 bg-primary/80 rounded-sm transition-all duration-1000 ease-in-out"
                style={{ 
                  height: "1rem",
                  animation: "pulse 1.4s ease-in-out infinite",
                  animationDelay: "200ms"
                }}
              ></div>
              <div
                className="w-1.5 bg-primary rounded-sm transition-all duration-1000 ease-in-out"
                style={{ 
                  height: "2rem",
                  animation: "pulse 1.4s ease-in-out infinite",
                  animationDelay: "400ms"
                }}
              ></div>
              <div
                className="w-1.5 bg-primary/80 rounded-sm transition-all duration-1000 ease-in-out"
                style={{ 
                  height: "0.75rem",
                  animation: "pulse 1.4s ease-in-out infinite",
                  animationDelay: "600ms"
                }}
              ></div>
              <div
                className="w-1.5 bg-primary rounded-sm transition-all duration-1000 ease-in-out"
                style={{ 
                  height: "1.25rem",
                  animation: "pulse 1.4s ease-in-out infinite",
                  animationDelay: "800ms"
                }}
              ></div>
            </div>
            <div className="text-muted-foreground text-sm font-medium animate-pulse">
              {message || "Processing data..."}
            </div>
            <div className="text-muted-foreground/70 text-xs mt-2 animate-pulse" style={{ animationDelay: "300ms" }}>
              Preparing visualization
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center">
            <div className="relative mx-auto mb-4 w-8 h-8">
              <div className="absolute inset-0 rounded-full border-2 border-primary/20"></div>
              <div className="absolute inset-0 rounded-full border-2 border-primary border-t-transparent animate-spin duration-700 ease-linear"></div>
            </div>
            <div className="text-muted-foreground text-sm font-medium animate-pulse">
              {message}
            </div>
          </div>
        );
    }
  };

  return (
    <div
      className={`flex items-center justify-center bg-card/30 backdrop-blur-sm rounded-lg border border-border/30 transition-all duration-200 ease-out ${className}`}
    >
      <div className="p-6">
        {getLoaderContent()}
      </div>
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
            <div className="relative mx-auto mb-3 w-8 h-8">
              <div className="absolute inset-0 w-8 h-8 border-2 border-background/20 rounded-full"></div>
              <div className="absolute inset-0 w-8 h-8 border-2 border-foreground border-t-transparent rounded-full animate-spin duration-700 ease-linear"></div>
            </div>
            <div className="text-foreground text-sm font-medium drop-shadow-sm animate-pulse">
              {message || "Applying theme..."}
            </div>
          </div>
        );

      case "data":
        return (
          <div className="text-center">
            <div className="flex items-end justify-center space-x-1 mb-3 h-8">
              <div
                className="w-1.5 bg-foreground/80 rounded-sm drop-shadow-sm transition-all duration-1000 ease-in-out"
                style={{ 
                  height: "1.5rem",
                  animation: "pulse 1.4s ease-in-out infinite",
                  animationDelay: "0ms"
                }}
              ></div>
              <div
                className="w-1.5 bg-foreground/60 rounded-sm drop-shadow-sm transition-all duration-1000 ease-in-out"
                style={{ 
                  height: "1rem",
                  animation: "pulse 1.4s ease-in-out infinite",
                  animationDelay: "200ms"
                }}
              ></div>
              <div
                className="w-1.5 bg-foreground/80 rounded-sm drop-shadow-sm transition-all duration-1000 ease-in-out"
                style={{ 
                  height: "2rem",
                  animation: "pulse 1.4s ease-in-out infinite",
                  animationDelay: "400ms"
                }}
              ></div>
              <div
                className="w-1.5 bg-foreground/60 rounded-sm drop-shadow-sm transition-all duration-1000 ease-in-out"
                style={{ 
                  height: "0.75rem",
                  animation: "pulse 1.4s ease-in-out infinite",
                  animationDelay: "600ms"
                }}
              ></div>
              <div
                className="w-1.5 bg-foreground/80 rounded-sm drop-shadow-sm transition-all duration-1000 ease-in-out"
                style={{ 
                  height: "1.25rem",
                  animation: "pulse 1.4s ease-in-out infinite",
                  animationDelay: "800ms"
                }}
              ></div>
            </div>
            <div className="text-foreground text-sm font-medium drop-shadow-sm animate-pulse">
              {message || "Processing data..."}
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center">
            <div className="relative mx-auto mb-3 w-8 h-8">
              <div className="absolute inset-0 rounded-full border-2 border-background/20"></div>
              <div className="absolute inset-0 rounded-full border-2 border-foreground border-t-transparent animate-spin duration-700 ease-linear"></div>
            </div>
            <div className="text-foreground text-sm font-medium drop-shadow-sm animate-pulse">
              {message}
            </div>
          </div>
        );
    }
  };

  return (
    <div
      className={`absolute inset-0 flex items-center justify-center bg-background/85 backdrop-blur-sm rounded-lg z-10 transition-all duration-300 ease-out ${className}`}
    >
      <div className="p-4">
        {getLoaderContent()}
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
