import React, { useState, useCallback, useLayoutEffect, useMemo, useRef } from "react";
import { defaultResponsive } from "@/lib/uPlot/config/defaults";
import type { ResponsiveConfig } from "@/lib/uPlot/types";

export interface UseChartDimensionsReturn {
  dimensions: { width: number; height: number };
  responsiveConfig: ResponsiveConfig;
  containerRef: React.RefObject<HTMLDivElement>;
}

export const useChartDimensions = (
  responsive: boolean | Partial<ResponsiveConfig>
) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const responsiveConfig = useMemo(() => {
    if (typeof responsive === "boolean") {
      return responsive
        ? defaultResponsive
        : { minWidth: 0, minHeight: 0, aspectRatio: undefined, legendSpace: 0 };
    }
    return { ...defaultResponsive, ...responsive };
  }, [responsive]);

  const updateDimensions = useCallback(() => {
    if (
      containerRef.current &&
      (typeof responsive === "boolean" ? responsive : true)
    ) {
      const { clientWidth, clientHeight } = containerRef.current;
      if (clientWidth > 0 && clientHeight > 0) {
        setDimensions({ width: clientWidth, height: clientHeight });
      }
    }
  }, [responsive]);

  // Use layoutEffect for resize observer to avoid layout thrashing
  useLayoutEffect(() => {
    const container = containerRef.current;
    const shouldObserve =
      container && (typeof responsive === "boolean" ? responsive : true);

    if (!shouldObserve) return;

    const observer = new ResizeObserver(updateDimensions);
    observer.observe(container);
    updateDimensions(); // Initial measurement

    return () => observer.disconnect();
  }, [updateDimensions, responsive]);

  return {
    dimensions,
    responsiveConfig,
    containerRef,
  };
};
