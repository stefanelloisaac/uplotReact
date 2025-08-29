/**
 * Lazy loading utilities for chart components
 */

import React, { lazy } from "react";
import { StyledChartProps } from "../types";

export const LazyLineChart = lazy(
  () => import("../../../components/LineChart")
);
export const LazyAreaChart = lazy(
  () => import("../../../components/AreaChart")
);
export const LazyScatterChart = lazy(
  () => import("../../../components/ScatterChart")
);
export const LazyBarChart = lazy(() => import("../../../components/BarChart"));

export type ChartType = "line" | "area" | "scatter" | "bar";

interface ChartTypeConfig {
  component: React.LazyExoticComponent<any>;
  preload: () => Promise<any>;
  size: number;
}

export const CHART_TYPES: Record<ChartType, ChartTypeConfig> = {
  line: {
    component: LazyLineChart,
    preload: () => import("../../../components/LineChart"),
    size: 8,
  },
  area: {
    component: LazyAreaChart,
    preload: () => import("../../../components/AreaChart"),
    size: 12,
  },
  scatter: {
    component: LazyScatterChart,
    preload: () => import("../../../components/ScatterChart"),
    size: 15,
  },
  bar: {
    component: LazyBarChart,
    preload: () => import("../../../components/BarChart"),
    size: 20,
  },
};

export class ChartPreloader {
  private preloadedTypes = new Set<ChartType>();

  async preloadType(type: ChartType): Promise<void> {
    if (this.preloadedTypes.has(type)) return;

    try {
      await CHART_TYPES[type].preload();
      this.preloadedTypes.add(type);
    } catch (error) {
      console.warn(`Failed to preload ${type} chart:`, error);
    }
  }

  async preloadTypes(types: ChartType[]): Promise<void> {
    await Promise.all(types.map((type) => this.preloadType(type)));
  }

  async preloadAll(): Promise<void> {
    const allTypes: ChartType[] = ["line", "area", "scatter", "bar"];
    await this.preloadTypes(allTypes);
  }

  setupIntersectionPreloading(): void {
    if (!("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const chartType = entry.target.getAttribute(
              "data-chart-type"
            ) as ChartType;
            if (chartType && CHART_TYPES[chartType]) {
              this.preloadType(chartType);
            }
          }
        });
      },
      {
        rootMargin: "100px",
      }
    );

    // Observe all chart containers
    document.querySelectorAll("[data-chart-type]").forEach((el) => {
      observer.observe(el);
    });
  }

  getLoadedSize(): number {
    return Array.from(this.preloadedTypes).reduce(
      (total, type) => total + CHART_TYPES[type].size,
      0
    );
  }

  getStatus(): Record<ChartType, boolean> {
    const status: Record<ChartType, boolean> = {} as any;
    Object.keys(CHART_TYPES).forEach((type) => {
      status[type as ChartType] = this.preloadedTypes.has(type as ChartType);
    });
    return status;
  }
}

export const chartPreloader = new ChartPreloader();

export function useLazyChart(type: ChartType) {
  const ChartComponent = CHART_TYPES[type].component;

  React.useEffect(() => {
    chartPreloader.preloadType(type);
  }, [type]);

  return ChartComponent;
}

interface DynamicChartProps extends StyledChartProps {
  type: ChartType;
  fallback?: React.ReactNode;
}

export const DynamicChart: React.FC<DynamicChartProps> = ({
  type,
  fallback = React.createElement("div", {}, "Loading chart..."),
  data,
  theme,
  responsive,
}) => {
  const ChartComponent = CHART_TYPES[type].component;

  return React.createElement(
    React.Suspense,
    { fallback },
    React.createElement(ChartComponent as any, {
      data,
      theme,
      responsive,
    })
  );
};
