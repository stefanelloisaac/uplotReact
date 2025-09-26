import React from "react";
import { LoadingFallback } from "@/lib/uPlot/components/LoadingFallback";
import { ChartCore } from "./ChartCore";
import type { ChartProps } from "./types";

interface LazyChartWrapperProps extends ChartProps {
  shouldLoad: boolean;
}

export const LazyChartWrapper: React.FC<LazyChartWrapperProps> = ({
  shouldLoad,
  loadOnHover,
  ...props
}) => {
  return (
    <div className="relative chart-wrapper w-full h-full">
      <ChartCore {...props} />
      {!shouldLoad && (
        <div className="absolute inset-0 z-10">
          <LoadingFallback
            message={loadOnHover ? "Hover to load chart" : "Chart loading..."}
            className="h-full"
            type="data"
          />
        </div>
      )}
    </div>
  );
};