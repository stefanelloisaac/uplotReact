import { useMemo, useRef, useDeferredValue } from "react";
import uPlot from "uplot";
import { optionsCache } from "@/lib/uPlot/performance/DataCache";
import { mergeChartConfigs, debugChart } from "@/lib/uPlot/helpers/chartHelpers";
import { accessibilityPlugin } from "@/lib/uPlot/accessibility";
import { exportPlugin } from "@/lib/uPlot/plugins/exportPlugin";
import { defaultDimensions } from "@/lib/uPlot/config/defaults";
import { chartDebugger } from "@/lib/uPlot/debug";
import { 
  createAdvancedLineConfig,
  createAdvancedAreaConfig,
  createAdvancedScatterConfig,
  createBarConfig,
  createPieConfig
} from "../chartConfigs";
import type { ChartType, ChartSeries, ThemeColors } from "../types";
import type { ResponsiveConfig } from "@/lib/uPlot/types";

export interface UseChartOptionsProps {
  type: ChartType;
  series: ChartSeries[];
  themeColors: string[];
  chartColors: ThemeColors;
  width?: number;
  height?: number;
  dimensions: { width: number; height: number };
  responsiveConfig: ResponsiveConfig;
  customOptions: Partial<uPlot.Options>;
  plugins: uPlot.Plugin[];
  enableAccessibility: boolean;
  enableExport: boolean;
  enableCaching: boolean;
  hasData: boolean;
  isThemeLoading: boolean;
  deferredStableTheme: string | undefined;
  title?: string;
  debug: boolean;
  data: uPlot.AlignedData;
}

export const useChartOptions = ({
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
}: UseChartOptionsProps) => {
  // Store options reference to prevent unnecessary regeneration
  const optionsRef = useRef<uPlot.Options | null>(null);
  const lastCacheKeyRef = useRef<string>("");

  // Defer expensive calculations during theme changes
  const deferredThemeColors = useDeferredValue(themeColors);

  return useMemo(() => {
    if (!hasData) return null;

    const cacheKey = `${type}_${JSON.stringify(series)}_${JSON.stringify(
      deferredThemeColors
    )}_${width}_${height}_${dimensions.width}_${
      dimensions.height
    }_${deferredStableTheme}`;

    // If cache key hasn't changed, return existing options to preserve chart state
    if (lastCacheKeyRef.current === cacheKey && optionsRef.current) {
      return optionsRef.current;
    }

    if (enableCaching && !isThemeLoading) {
      const cached = optionsCache.get(cacheKey);
      if (cached) {
        if (debug)
          chartDebugger.log("info", "Using cached options", { cacheKey });
        
        optionsRef.current = cached;
        lastCacheKeyRef.current = cacheKey;
        return cached;
      }
    }

    let baseConfig: Partial<uPlot.Options>;

    switch (type) {
      case "line":
        baseConfig = createAdvancedLineConfig(
          series,
          deferredThemeColors,
          chartColors
        );
        break;
      case "area":
        baseConfig = createAdvancedAreaConfig(
          series,
          deferredThemeColors,
          chartColors
        );
        break;
      case "scatter":
        baseConfig = createAdvancedScatterConfig(
          series,
          deferredThemeColors,
          chartColors
        );
        break;
      case "bar":
        baseConfig = createBarConfig(series, deferredThemeColors, chartColors);
        break;
      case "pie":
        baseConfig = createPieConfig(series, deferredThemeColors);
        break;
      default:
        baseConfig = createAdvancedLineConfig(
          series,
          deferredThemeColors,
          chartColors
        );
    }

    const finalWidth =
      width ||
      (dimensions.width > 0 ? dimensions.width - 16 : defaultDimensions.width);
    const finalHeight =
      height ||
      (dimensions.height > 0
        ? Math.max(
            dimensions.height - 20, // Account for padding only
            responsiveConfig.minHeight!
          )
        : defaultDimensions.height);

    const options: uPlot.Options = mergeChartConfigs(
      {
        width: Math.max(finalWidth, responsiveConfig.minWidth!),
        height: finalHeight,
        legend: {
          show: true,
          live: true,
          markers: {
            show: true,
            width: 2,
          },
        },
        cursor: {
          drag: {
            setScale: false,
          },
        },
      },
      baseConfig,
      customOptions,
      {
        plugins: [
          ...plugins,
          ...(enableAccessibility ? [accessibilityPlugin()] : []),
          ...(enableExport ? [exportPlugin()] : []),
        ],
      }
    );

    if (enableCaching && !isThemeLoading) {
      optionsCache.set(cacheKey, options);
    }

    if (debug) {
      debugChart(data, options, title || `${type} chart`);
    }

    // Store the new options and cache key
    optionsRef.current = options;
    lastCacheKeyRef.current = cacheKey;
    
    return options;
  }, [
    type,
    series,
    deferredThemeColors,
    width,
    height,
    dimensions.width,
    dimensions.height,
    responsiveConfig,
    customOptions,
    plugins,
    enableAccessibility,
    enableExport,
    hasData,
    enableCaching,
    title,
    debug,
    deferredStableTheme,
    chartColors,
    isThemeLoading,
    data,
  ]);
};
