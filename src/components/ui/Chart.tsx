"use client";

import React, { useEffect, useRef, useState, useCallback, useMemo, Suspense } from "react";
import uPlot from "uplot";
import "uplot/dist/uPlot.min.css";

// Import ALL existing uPlot library components and utilities
import UplotReact from "@/lib/uPlot/core/UplotReact";
import { ChartErrorBoundary } from "@/lib/uPlot/components/ErrorBoundary";
import { LoadingFallback, EmptyState } from "@/lib/uPlot/components/LoadingFallback";
import { optionsCache } from "@/lib/uPlot/performance/DataCache";
import { 
  validateChartData, 
  debugChart, 
  createLineChartConfig, 
  createAreaChartConfig, 
  createScatterChartConfig,
  mergeChartConfigs 
} from "@/lib/uPlot/helpers/chartHelpers";
import { accessibilityPlugin } from "@/lib/uPlot/accessibility";
import { exportPlugin } from "@/lib/uPlot/plugins/exportPlugin";
import { defaultResponsive, defaultDimensions } from "@/lib/uPlot/config/defaults";
import { chartDebugger } from "@/lib/uPlot/debug";
import type { 
  ChartTheme, 
  ResponsiveConfig
} from "@/lib/uPlot/types";

// Chart type definitions
export type ChartType = "line" | "area" | "bar" | "pie" | "scatter";

// Theme names matching the predefined themes
export type ThemeName = 
  | "Default" 
  | "City Park" 
  | "Classroom" 
  | "Colorblind Safe" 
  | "Electric" 
  | "High Contrast" 
  | "Sunset" 
  | "Twilight";

// Predefined themes using CSS custom properties
const PREDEFINED_THEMES: Record<ThemeName, string[]> = {
  "Default": [
    "oklch(0.674 0.419 185.4)",
    "oklch(0.286 0.064 216.1)",
    "oklch(0.620 0.677 29.8)",
    "oklch(0.820 0.816 89.8)",
    "oklch(0.443 0.049 213.1)",
    "oklch(0.810 0.253 227.2)",
    "oklch(0.721 0.544 50.3)",
    "oklch(0.524 0.357 333.4)"
  ],
  "City Park": [
    "oklch(0.683 0.531 135.9)",
    "oklch(0.383 0.308 286.5)",
    "oklch(0.816 0.666 90.6)",
    "oklch(0.502 0.594 31.3)",
    "oklch(0.692 0.324 259.2)",
    "oklch(0.536 0.572 305.5)",
    "oklch(0.719 0.485 60.3)",
    "oklch(0.819 0.294 163.4)"
  ],
  "Classroom": [
    "oklch(0.577 0.467 274.5)",
    "oklch(0.399 0.277 282.8)",
    "oklch(0.823 0.817 89.8)",
    "oklch(0.555 0.576 29.3)",
    "oklch(0.638 0.463 163.0)",
    "oklch(0.785 0.259 254.7)",
    "oklch(0.669 0.449 58.1)",
    "oklch(0.501 0.398 323.5)"
  ],
  "Colorblind Safe": [
    "oklch(0.267 0.183 218.1)",
    "oklch(0.547 0.331 196.4)",
    "oklch(0.661 0.634 350.1)",
    "oklch(0.814 0.328 346.0)",
    "oklch(0.217 0.818 312.2)",
    "oklch(0.607 0.617 300.0)",
    "oklch(0.819 0.184 254.1)",
    "oklch(0.730 0.262 249.4)"
  ],
  "Electric": [
    "oklch(0.566 0.769 264.3)",
    "oklch(0.252 0.373 313.4)",
    "oklch(0.513 0.632 343.2)",
    "oklch(0.730 0.586 49.4)",
    "oklch(0.747 0.470 186.7)",
    "oklch(0.825 0.435 160.6)",
    "oklch(0.327 0.261 259.7)",
    "oklch(0.544 0.673 23.0)"
  ],
  "High Contrast": [
    "oklch(0.422 0.664 136.0)",
    "oklch(0.119 0.228 254.9)",
    "oklch(0.320 0.713 36.6)",
    "oklch(0.274 0.345 306.2)",
    "oklch(0.230 0.228 197.7)",
    "oklch(0.512 0.573 256.8)",
    "oklch(0.551 0.637 30.5)",
    "oklch(0.379 0.555 310.4)"
  ],
  "Sunset": [
    "oklch(0.848 0.201 280.0)",
    "oklch(0.327 0.261 259.7)",
    "oklch(0.732 0.586 49.4)",
    "oklch(0.513 0.632 343.2)",
    "oklch(0.882 0.191 329.7)",
    "oklch(0.858 0.373 187.0)",
    "oklch(0.639 0.369 222.5)",
    "oklch(0.892 0.434 95.0)"
  ],
  "Twilight": [
    "oklch(0.603 0.592 47.6)",
    "oklch(0.221 0.170 193.1)",
    "oklch(0.700 0.692 96.8)",
    "oklch(0.305 0.040 251.6)",
    "oklch(0.453 0.694 27.7)",
    "oklch(0.837 0.162 188.2)",
    "oklch(0.406 0.330 128.2)",
    "oklch(0.678 0.344 187.8)"
  ]
};

// Chart configuration interfaces
export interface ChartSeries {
  label: string;
  data?: number[];
  color?: string;
  fill?: string;
  stroke?: string;
  width?: number;
  pointSize?: number;
  smooth?: boolean;
}

// Enhanced ChartProps with all library features
export interface ChartProps {
  type: ChartType;
  data: uPlot.AlignedData;
  series?: ChartSeries[];
  theme?: ThemeName | Partial<ChartTheme>;
  width?: number;
  height?: number;
  title?: string;
  className?: string;
  responsive?: boolean | Partial<ResponsiveConfig>;
  enableExport?: boolean;
  enableAccessibility?: boolean;
  enableCaching?: boolean;
  enableLazyLoading?: boolean;
  loadOnHover?: boolean;
  loadOnVisible?: boolean;
  preloadDelay?: number;
  loadingFallback?: React.ReactNode;
  errorFallback?: React.ReactNode;
  emptyFallback?: React.ReactNode;
  onError?: (error: Error) => void;
  onCreate?: (chart: uPlot) => void;
  onDelete?: (chart: uPlot) => void;
  debug?: boolean;
  plugins?: uPlot.Plugin[];
  customOptions?: Partial<uPlot.Options>;
}



// Get computed CSS variable values at runtime
const getComputedChartColors = () => {
  if (typeof window === 'undefined') {
    return {
      grid: 'red', // fallback for SSR
      axis: 'red',
      tick: 'red'
    };
  }
  
  const styles = getComputedStyle(document.documentElement);
  return {
    grid: styles.getPropertyValue('--chart-grid').trim() || 'red',
    axis: styles.getPropertyValue('--chart-axis').trim() || 'red', 
    tick: styles.getPropertyValue('--chart-tick').trim() || 'red'
  };
};

// Enhanced chart configurations using existing helpers
const createAdvancedLineConfig = (series: ChartSeries[], colors: string[]): Partial<uPlot.Options> => {
  const chartColors = getComputedChartColors();
  return {
    series: [
      {}, // x-axis
      ...series.map((s, idx) => ({
        label: s.label,
        stroke: s.stroke || s.color || colors[idx % colors.length],
        width: s.width || 2,
        points: { show: false },
      }))
    ],
    scales: {
      x: { time: false },
      y: { auto: true }
    },
    axes: [
      {
        stroke: chartColors.axis,
        grid: { stroke: chartColors.grid, width: 1 },
        ticks: { stroke: chartColors.tick, width: 1 },
      },
      {
        stroke: chartColors.axis,
        grid: { stroke: chartColors.grid, width: 1 },
        ticks: { stroke: chartColors.tick, width: 1 },
      }
    ]
  };
};

const createAdvancedAreaConfig = (series: ChartSeries[], colors: string[]): Partial<uPlot.Options> => {
  const chartColors = getComputedChartColors();
  return {
    series: [
      {}, // x-axis
      ...series.map((s, idx) => {
        const color = s.stroke || s.color || colors[idx % colors.length];
        // Convert oklch color to rgba with opacity for fill
        const fillColor = s.fill || (color.includes('oklch') ? 
          color.replace('oklch(', 'oklch(').replace(')', ' / 0.4)') : 
          color + '40');
        
        return {
          label: s.label,
          stroke: color,
          fill: fillColor,
          width: s.width || 2,
          paths: s.smooth !== false ? uPlot.paths?.spline?.() : undefined,
        };
      })
    ],
    scales: {
      x: { time: false },
      y: { auto: true }
    },
    axes: [
      {
        stroke: chartColors.axis,
        grid: { stroke: chartColors.grid, width: 1 },
        ticks: { stroke: chartColors.tick, width: 1 },
      },
      {
        stroke: chartColors.axis,
        grid: { stroke: chartColors.grid, width: 1 },
        ticks: { stroke: chartColors.tick, width: 1 },
      }
    ]
  };
};

const createAdvancedScatterConfig = (series: ChartSeries[], colors: string[]): Partial<uPlot.Options> => {
  const chartColors = getComputedChartColors();
  return {
    series: [
      {}, // x-axis
      ...series.map((s, idx) => ({
        label: s.label,
        stroke: "transparent",
        points: {
          show: true,
          size: s.pointSize || 8,
          fill: s.fill || s.color || colors[idx % colors.length],
          stroke: s.stroke || colors[idx % colors.length],
          width: 2,
        },
      }))
    ],
    scales: {
      x: { time: false },
      y: { auto: true }
    },
    axes: [
      {
        stroke: chartColors.axis,
        grid: { stroke: chartColors.grid, width: 1 },
        ticks: { stroke: chartColors.tick, width: 1 },
      },
      {
        stroke: chartColors.axis,
        grid: { stroke: chartColors.grid, width: 1 },
        ticks: { stroke: chartColors.tick, width: 1 },
      }
    ]
  };
};

const createBarConfig = (series: ChartSeries[], colors: string[]): Partial<uPlot.Options> => {
  const chartColors = getComputedChartColors();
  return {
    series: [
      {},
      ...series.map((s, idx) => ({
        label: s.label,
        stroke: s.stroke || s.color || colors[idx % colors.length],
        fill: s.fill || s.color || colors[idx % colors.length],
        paths: uPlot.paths?.bars?.({ size: [0.6] }),
      }))
    ],
    scales: {
      x: { time: false },
      y: { auto: true }
    },
    axes: [
      {
        stroke: chartColors.axis,
        grid: { stroke: chartColors.grid, width: 1 },
        ticks: { stroke: chartColors.tick, width: 1 },
      },
      {
        stroke: chartColors.axis,
        grid: { stroke: chartColors.grid, width: 1 },
        ticks: { stroke: chartColors.tick, width: 1 },
      }
    ]
  };
};

const createPieConfig = (series: ChartSeries[], colors: string[]): Partial<uPlot.Options> => {
  return {
    series: [
      {},
      ...series.map((s, idx) => ({
        label: s.label,
        stroke: colors[idx % colors.length],
        fill: colors[idx % colors.length],
      }))
    ]
  };
};

// Lazy loading wrapper component
const LazyChartWrapper: React.FC<ChartProps & { shouldLoad: boolean }> = ({ 
  shouldLoad, 
  loadingFallback, 
  loadOnHover,
  ...props 
}) => {
  if (!shouldLoad) {
    return (
      <div className="chart-placeholder flex items-center justify-center border border-dashed border-muted-foreground/25 rounded-lg bg-muted/5">
        <div className="text-center p-8">
          <div className="text-muted-foreground text-sm mb-2">
            {loadOnHover ? "Hover to load chart" : "Chart loading..."}
          </div>
          <div className="w-12 h-12 mx-auto bg-muted rounded animate-pulse" />
        </div>
      </div>
    );
  }

  return <ChartCore {...props} />;
};

// Core chart component with all integrated logic
const ChartCore: React.FC<ChartProps> = ({
  type,
  data,
  series = [],
  theme = "Default",
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
  // Refs and state for responsive behavior
  const containerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<uPlot | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [themeKey, setThemeKey] = useState(0);

  // Validate data
  const isValidData = useMemo(() => {
    const valid = validateChartData(data);
    if (!valid && debug) {
      chartDebugger.logError(new Error("Invalid chart data provided"));
    }
    return valid;
  }, [data, debug]);

  const hasData = isValidData && data && data.length > 0 && data[0] && data[0].length > 0;

  // Theme colors only
  const themeColors = useMemo(() => {
    return typeof theme === "string" 
      ? (PREDEFINED_THEMES[theme] || PREDEFINED_THEMES["Default"])
      : (theme.colors || PREDEFINED_THEMES["Default"]);
  }, [theme]);

  // Responsive configuration
  const responsiveConfig = useMemo(() => {
    if (typeof responsive === "boolean") {
      return responsive ? defaultResponsive : { minWidth: 0, minHeight: 0, aspectRatio: undefined, legendSpace: 0 };
    }
    return { ...defaultResponsive, ...responsive };
  }, [responsive]);

  // Dimension updates
  const updateDimensions = useCallback(() => {
    if (containerRef.current && (typeof responsive === "boolean" ? responsive : true)) {
      const { clientWidth, clientHeight } = containerRef.current;
      if (clientWidth > 0 && clientHeight > 0) {
        setDimensions({ width: clientWidth, height: clientHeight });
      }
    }
  }, [responsive]);


  // Listen for theme changes
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          const target = mutation.target as HTMLElement;
          if (target === document.documentElement) {
            // Force chart re-render when theme changes
            setThemeKey(prev => prev + 1);
          }
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  // Setup resize observer
  useEffect(() => {
    if (containerRef.current && (typeof responsive === "boolean" ? responsive : true)) {
      resizeObserverRef.current = new ResizeObserver(updateDimensions);
      resizeObserverRef.current.observe(containerRef.current);
      updateDimensions();
    }

    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
    };
  }, [updateDimensions]);

  // Create chart options with caching
  const chartOptions = useMemo(() => {
    if (!hasData) return null;

    const cacheKey = `${type}_${JSON.stringify(series)}_${JSON.stringify(themeColors)}_${width}_${height}_${dimensions.width}_${dimensions.height}_${themeKey}`;
    
    if (enableCaching) {
      const cached = optionsCache.get(cacheKey);
      if (cached) {
        if (debug) chartDebugger.log("info", "Using cached options", { cacheKey });
        return cached;
      }
    }

    let baseConfig: Partial<uPlot.Options>;
    
    switch (type) {
      case "line":
        baseConfig = createAdvancedLineConfig(series, themeColors);
        break;
      case "area":
        baseConfig = createAdvancedAreaConfig(series, themeColors);
        break;
      case "scatter":
        baseConfig = createAdvancedScatterConfig(series, themeColors);
        break;
      case "bar":
        baseConfig = createBarConfig(series, themeColors);
        break;
      case "pie":
        baseConfig = createPieConfig(series, themeColors);
        break;
      default:
        baseConfig = createAdvancedLineConfig(series, themeColors);
    }

    // Calculate final dimensions
    const finalWidth = width || (dimensions.width > 0 ? dimensions.width : defaultDimensions.width);
    const finalHeight = height || (dimensions.height > 0 ? 
      Math.max(dimensions.height - responsiveConfig.legendSpace!, responsiveConfig.minHeight!) : 
      defaultDimensions.height);

    // Merge all configurations
    const options: uPlot.Options = mergeChartConfigs(
      {
        width: Math.max(finalWidth, responsiveConfig.minWidth!),
        height: finalHeight,
      },
      baseConfig,
      customOptions,
      {
        plugins: [
          ...plugins,
          ...(enableAccessibility ? [accessibilityPlugin()] : []),
          ...(enableExport ? [exportPlugin()] : []),
        ]
      }
    );

    if (enableCaching) {
      optionsCache.set(cacheKey, options);
    }

    if (debug) {
      debugChart(data, options, title || `${type} chart`);
    }

    return options;
  }, [
    type, series, themeColors, width, height, dimensions, responsiveConfig, 
    customOptions, plugins, enableAccessibility, enableExport, hasData, 
    enableCaching, data, title, debug, themeKey
  ]);

  // Chart lifecycle handlers
  const handleCreate = useCallback((chart: uPlot) => {
    chartRef.current = chart;
    onCreate?.(chart);
    
    if (debug) {
      chartDebugger.log("info", "Chart created", { 
        type, 
        dimensions: { width: chart.width, height: chart.height },
        series: chart.series.length 
      });
    }
  }, [onCreate, type, debug]);

  const handleDelete = useCallback((chart: uPlot) => {
    chartRef.current = null;
    onDelete?.(chart);
    
    if (debug) {
      chartDebugger.log("info", "Chart destroyed", { type });
    }
  }, [onDelete, type, debug]);

  const handleError = useCallback((error: Error) => {
    onError?.(error);
    
    if (debug) {
      chartDebugger.logError(error, "Chart error");
    }
  }, [onError, debug]);

  // Container style
  const containerStyle = useMemo(() => ({
    backgroundColor: "var(--chart-background)",
  }), []);

  if (!isValidData) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground border border-destructive/20 rounded-lg p-4">
        <div className="text-center">
          <div className="text-destructive text-sm mb-1">Invalid Chart Data</div>
          <div className="text-xs opacity-60">Please check your data format</div>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef} 
      className={`chart-container ${className}`} 
      style={containerStyle}
      data-chart-type={type}
    >
      {title && (
        <h3 className="chart-title text-lg font-semibold mb-4 text-foreground">
          {title}
        </h3>
      )}
      
      <ChartErrorBoundary 
        fallback={errorFallback}
        onError={handleError}
      >
        {!hasData ? (
          emptyFallback || <EmptyState message="No data to display" className="h-full" />
        ) : !chartOptions ? (
          loadingFallback || <LoadingFallback message="Preparing chart..." className="h-full" />
        ) : (
          <div className="chart-wrapper bg-card border border-border rounded-lg p-4">
            <UplotReact
              key={`chart-${themeKey}`}
              data={data}
              options={chartOptions}
              onCreate={handleCreate}
              onDelete={handleDelete}
            />
          </div>
        )}
      </ChartErrorBoundary>
    </div>
  );
};

// Main Chart component with lazy loading support
export const Chart: React.FC<ChartProps> = (props) => {
  const {
    enableLazyLoading = false,
    loadOnHover = false,
    loadOnVisible = true,
    preloadDelay = 300,
    ...coreProps
  } = props;

  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(!enableLazyLoading);
  const chartId = useMemo(() => `${props.type}-${Math.random().toString(36).substr(2, 9)}`, [props.type]);

  // Lazy loading logic
  useEffect(() => {
    if (!enableLazyLoading) return;

    const container = containerRef.current;
    if (!container) return;

    let intersectionObserver: IntersectionObserver;
    let hoverTimeout: NodeJS.Timeout;

    // Intersection observer for visibility-based loading
    if (loadOnVisible && !shouldLoad) {
      intersectionObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setShouldLoad(true);
            }
          });
        },
        { rootMargin: "100px", threshold: 0.1 }
      );
      intersectionObserver.observe(container);
    }

    // Hover-based loading
    if (loadOnHover && !shouldLoad) {
      const handleMouseEnter = () => {
        hoverTimeout = setTimeout(() => setShouldLoad(true), preloadDelay);
      };
      const handleMouseLeave = () => {
        if (hoverTimeout) clearTimeout(hoverTimeout);
      };

      container.addEventListener("mouseenter", handleMouseEnter);
      container.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        container.removeEventListener("mouseenter", handleMouseEnter);
        container.removeEventListener("mouseleave", handleMouseLeave);
        if (hoverTimeout) clearTimeout(hoverTimeout);
      };
    }

    return () => {
      if (intersectionObserver) {
        intersectionObserver.disconnect();
      }
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
      }
    };
  }, [enableLazyLoading, loadOnVisible, loadOnHover, preloadDelay, shouldLoad, chartId]);

  if (!enableLazyLoading) {
    return <ChartCore {...coreProps} />;
  }

  return (
    <div ref={containerRef}>
      <Suspense fallback={props.loadingFallback || <LoadingFallback />}>
        <LazyChartWrapper {...props} shouldLoad={shouldLoad} />
      </Suspense>
    </div>
  );
};

// Export utilities and types
export { PREDEFINED_THEMES };
export default Chart;