import uPlot from "uplot";
import { ChartTheme } from "../types";
import { chartTypeDefaults } from "../config/defaults";

/**
 * Creates a line chart configuration with sensible defaults
 */
export const createLineChartConfig = (
  series: Array<{ label: string; stroke?: string; width?: number }>,
  theme?: Partial<ChartTheme>
): Partial<uPlot.Options> => {
  return {
    series: [
      {},
      ...series.map((s, idx) => ({
        label: s.label,
        stroke: s.stroke || `hsl(${idx * 60}, 70%, 50%)`,
        width: s.width || chartTypeDefaults.line.strokeWidth,
        points: { show: false },
      })),
    ],
    axes: [
      { stroke: theme?.axisColor || "#6b7280" },
      {
        stroke: theme?.axisColor || "#6b7280",
        grid: { stroke: theme?.gridColor || "#374151" },
      },
    ],
  };
};

export const createAreaChartConfig = (
  series: Array<{
    label: string;
    stroke?: string;
    fill?: string;
    smooth?: boolean;
  }>,
  theme?: Partial<ChartTheme>
): Partial<uPlot.Options> => {
  return {
    series: [
      {},
      ...series.map((s, idx) => ({
        label: s.label,
        stroke: s.stroke || `hsl(${idx * 60}, 70%, 50%)`,
        fill:
          s.fill ||
          `hsla(${idx * 60}, 70%, 50%, ${chartTypeDefaults.area.fillOpacity})`,
        width: chartTypeDefaults.area.strokeWidth,
        paths: s.smooth !== false ? uPlot.paths?.spline?.() : undefined,
      })),
    ],
    axes: [
      { stroke: theme?.axisColor || "#6b7280" },
      {
        stroke: theme?.axisColor || "#6b7280",
        grid: { stroke: theme?.gridColor || "#374151" },
      },
    ],
  };
};

export const createScatterChartConfig = (
  series: Array<{
    label: string;
    stroke?: string;
    fill?: string;
    pointSize?: number;
  }>,
  theme?: Partial<ChartTheme>
): Partial<uPlot.Options> => {
  return {
    series: [
      {},
      ...series.map((s, idx) => ({
        label: s.label,
        stroke: "transparent",
        points: {
          show: true,
          size: s.pointSize || chartTypeDefaults.scatter.pointSize,
          fill: s.fill || `hsl(${idx * 60}, 70%, 50%)`,
          stroke: s.stroke || `hsl(${idx * 60}, 70%, 40%)`,
          width: chartTypeDefaults.scatter.strokeWidth,
        },
      })),
    ],
    axes: [
      { stroke: theme?.axisColor || "#6b7280" },
      {
        stroke: theme?.axisColor || "#6b7280",
        grid: { stroke: theme?.gridColor || "#374151" },
      },
    ],
  };
};

export const mergeChartConfigs = (
  ...configs: Partial<uPlot.Options>[]
): uPlot.Options => {
  const merged = configs.reduce((acc, config) => {
    return {
      ...acc,
      ...config,
      series: [...(acc.series || []), ...(config.series || [])],
      axes: config.axes || acc.axes,
    };
  }, {} as Partial<uPlot.Options>);

  return {
    width: 600,
    height: 300,
    ...merged,
  } as uPlot.Options;
};

export const validateChartData = (data: uPlot.AlignedData): boolean => {
  if (!Array.isArray(data) || data.length === 0) {
    console.warn("Chart data must be a non-empty array");
    return false;
  }

  if (!data[0] || data[0].length === 0) {
    console.warn("Chart data must have at least one data point");
    return false;
  }

  const expectedLength = data[0].length;
  for (let i = 1; i < data.length; i++) {
    if (data[i].length !== expectedLength) {
      console.warn(
        `Series ${i} has ${data[i].length} points, expected ${expectedLength}`
      );
      return false;
    }
  }

  return true;
};

export const debugChart = (
  data: uPlot.AlignedData,
  options: uPlot.Options,
  name?: string
) => {
  if (process.env.NODE_ENV === "development") {
    const prefix = name ? `[${name}]` : "[Chart]";
    console.group(`${prefix} Debug Info`);
    console.log("Data points:", data[0]?.length || 0);
    console.log("Series count:", data.length);
    console.log("Dimensions:", `${options.width}x${options.height}`);
    console.log("Data:", data);
    console.log("Options:", options);
    console.groupEnd();
  }
};
