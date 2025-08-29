import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ChartErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Chart Error Boundary caught an error:", error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex items-center justify-center h-full bg-inherit border-2 border-dashed border-gray-300 rounded-lg">
            <div className="text-center p-4">
              <div className="text-gray-500 text-sm mb-2">
                📊 Chart Failed to Load
              </div>
              <div className="text-gray-400 text-xs">
                {this.state.error?.message || "Unknown error occurred"}
              </div>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
