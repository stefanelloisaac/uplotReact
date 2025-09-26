import React, { useMemo, useRef, useCallback } from "react";
import uPlot from "uplot";
import UplotReact from "@/lib/uPlot/core/UplotReact";
import { ChartErrorBoundary } from "@/lib/uPlot/components/ErrorBoundary";
import {
  LoadingFallback,
  EmptyState,
  LoadingOverlay,
} from "@/lib/uPlot/components/LoadingFallback";
import { validateChartData } from "@/lib/uPlot/helpers/chartHelpers";
import { chartDebugger } from "@/lib/uPlot/debug";
import { PREDEFINED_THEMES } from "./themes";
import { useChartTheme } from "./hooks/useChartTheme";
import { useChartDimensions } from "./hooks/useChartDimensions";
import { useChartOptions } from "./hooks/useChartOptions";
import type { ChartProps, ThemeName } from "./types";

export const ChartCore: React.FC<ChartProps> = ({
  type,
  data,
  series = [],
  chartTheme = "Default",
  width,
  height,
  title,
  className = "",
  responsive = true,
  enableExport = false,
  enableAccessibility = true,
  enableCaching = true,
  loadingFallback,
  errorFallback,
  emptyFallback,
  onError,
  onCreate,
  onDelete,
  debug = false,
  plugins = [],
  customOptions = {},
}) => {
  const chartRef = useRef<uPlot | null>(null);
  
  // Use custom hooks
  const { 
    isThemeLoading, 
    isPending, 
    chartColors, 
    deferredStableTheme 
  } = useChartTheme();
  
  const { dimensions, responsiveConfig, containerRef } = useChartDimensions(responsive);

  // Data validation
  const isValidData = useMemo(() => {
    const valid = validateChartData(data);
    if (!valid && debug) {
      chartDebugger.logError(new Error("Invalid chart data provided"));
    }
    return valid;
  }, [data, debug]);

  const hasData = isValidData && data && data.length > 0 && data[0] && data[0].length > 0;

  // Theme colors from predefined themes
  const themeColors = useMemo(() => {
    return typeof chartTheme === "string"
      ? PREDEFINED_THEMES[chartTheme as ThemeName] || PREDEFINED_THEMES["Default"]
      : chartTheme.colors || PREDEFINED_THEMES["Default"];
  }, [chartTheme]);

  // Chart options
  const chartOptions = useChartOptions({
    type,
    series,
    themeColors,
    chartColors,
    width,
    height,
    dimensions,
    responsiveConfig,
    customOptions,
    plugins,
    enableAccessibility,
    enableExport,
    enableCaching,
    hasData,
    isThemeLoading,
    deferredStableTheme,
    title,
    debug,
    data,
  });

  // Event handlers
  const handleCreate = useCallback(
    (chart: uPlot) => {
      chartRef.current = chart;
      onCreate?.(chart);

      if (debug) {
        chartDebugger.log("info", "Chart created", {
          type,
          dimensions: { width: chart.width, height: chart.height },
          series: chart.series.length,
        });
      }
    },
    [onCreate, type, debug]
  );

  const handleDelete = useCallback(
    (chart: uPlot) => {
      chartRef.current = null;
      onDelete?.(chart);

      if (debug) {
        chartDebugger.log("info", "Chart destroyed", { type });
      }
    },
    [onDelete, type, debug]
  );

  const handleError = useCallback(
    (error: Error) => {
      onError?.(error);

      if (debug) {
        chartDebugger.logError(error, "Chart error");
      }
    },
    [onError, debug]
  );

  // Container style
  const containerStyle = useMemo(
    () => ({
      backgroundColor: "var(--chart-background)",
    }),
    []
  );

  // Invalid data fallback
  if (!isValidData) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground border border-destructive/20 rounded-lg p-4">
        <div className="text-center">
          <div className="text-destructive text-sm mb-1">
            Invalid Chart Data
          </div>
          <div className="text-xs opacity-60">
            Please check your data format
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`chart-container w-full h-full ${className} transition-all duration-300 ease-in-out ${
        isThemeLoading || isPending ? "opacity-90" : "opacity-100"
      }`}
      style={containerStyle}
      data-chart-type={type}
    >
      {title && (
        <h3 className="chart-title text-lg font-semibold mb-4 text-foreground">
          {title}
        </h3>
      )}

      <ChartErrorBoundary fallback={errorFallback} onError={handleError}>
        {!hasData ? (
          emptyFallback || (
            <EmptyState message="No data to display" className="h-full" />
          )
        ) : !chartOptions ? (
          loadingFallback || (
            <LoadingFallback
              message="Preparing chart..."
              className="h-full"
              type="data"
            />
          )
        ) : (
          <div className="relative chart-wrapper w-full h-full">
            <UplotReact
              data={data}
              options={chartOptions}
              onCreate={handleCreate}
              onDelete={handleDelete}
            />
            {(isThemeLoading || isPending) && (
              <LoadingOverlay
                message={isPending ? "Updating theme..." : "Applying theme..."}
                type="theme"
                className="transition-opacity duration-200 ease-out"
              />
            )}
          </div>
        )}
      </ChartErrorBoundary>
    </div>
  );
};