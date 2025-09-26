import React, { useRef, useState, useLayoutEffect, Suspense } from "react";
import "uplot/dist/uPlot.min.css";
import { LoadingFallback } from "@/lib/uPlot/components/LoadingFallback";
import { ChartCore } from "./chart/ChartCore";
import { LazyChartWrapper } from "./chart/LazyChartWrapper";
import type { ChartProps } from "./chart/types";

// Re-export types and themes
export type { ChartType, ChartProps, ChartSeries, ThemeName } from "./chart/types";
export { PREDEFINED_THEMES } from "./chart/themes";

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

  // Simplified lazy loading with better cleanup
  useLayoutEffect(() => {
    if (!enableLazyLoading || shouldLoad) return;

    const container = containerRef.current;
    if (!container) return;

    const cleanup: (() => void)[] = [];

    // Intersection Observer for visibility-based loading
    if (loadOnVisible) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setShouldLoad(true);
          }
        },
        { rootMargin: "100px", threshold: 0.1 }
      );

      observer.observe(container);
      cleanup.push(() => observer.disconnect());
    }

    // Hover-based loading
    if (loadOnHover) {
      let hoverTimeout: NodeJS.Timeout;

      const handleMouseEnter = () => {
        hoverTimeout = setTimeout(() => setShouldLoad(true), preloadDelay);
      };

      const handleMouseLeave = () => {
        if (hoverTimeout) clearTimeout(hoverTimeout);
      };

      container.addEventListener("mouseenter", handleMouseEnter);
      container.addEventListener("mouseleave", handleMouseLeave);

      cleanup.push(() => {
        container.removeEventListener("mouseenter", handleMouseEnter);
        container.removeEventListener("mouseleave", handleMouseLeave);
        if (hoverTimeout) clearTimeout(hoverTimeout);
      });
    }

    return () => cleanup.forEach((fn) => fn());
  }, [enableLazyLoading, loadOnVisible, loadOnHover, preloadDelay, shouldLoad]);

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

export default Chart;
