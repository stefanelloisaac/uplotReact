import uPlot from "uplot";
import { ChartSeries, ThemeColors } from "./types";

export const createAdvancedLineConfig = (
  series: ChartSeries[],
  colors: string[],
  chartColors: ThemeColors
): Partial<uPlot.Options> => {
  return {
    series: [
      {},
      ...series.map((s, idx) => ({
        label: s.label,
        stroke: s.stroke || s.color || colors[idx % colors.length],
        width: s.width || 2,
        points: { show: false },
      })),
    ],
    scales: {
      x: { time: false },
      y: { auto: true },
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
      },
    ],
  };
};

export const createAdvancedAreaConfig = (
  series: ChartSeries[],
  colors: string[],
  chartColors: ThemeColors
): Partial<uPlot.Options> => {
  return {
    series: [
      {},
      ...series.map((s, idx) => {
        const color = s.stroke || s.color || colors[idx % colors.length];
        const fillColor =
          s.fill ||
          (color.includes("oklch")
            ? color.replace("oklch(", "oklch(").replace(")", " / 0.4)")
            : color + "40");

        return {
          label: s.label,
          stroke: color,
          fill: fillColor,
          width: s.width || 2,
          paths: s.smooth !== false ? uPlot.paths?.spline?.() : undefined,
        };
      }),
    ],
    scales: {
      x: { time: false },
      y: { auto: true },
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
      },
    ],
  };
};

export const createAdvancedScatterConfig = (
  series: ChartSeries[],
  colors: string[],
  chartColors: ThemeColors
): Partial<uPlot.Options> => {
  return {
    series: [
      {},
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
      })),
    ],
    scales: {
      x: { time: false },
      y: { auto: true },
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
      },
    ],
  };
};

export const createBarConfig = (
  series: ChartSeries[],
  colors: string[],
  chartColors: ThemeColors
): Partial<uPlot.Options> => {
  return {
    series: [
      {},
      ...series.map((s, idx) => ({
        label: s.label,
        stroke: s.stroke || s.color || colors[idx % colors.length],
        fill: s.fill || s.color || colors[idx % colors.length],
        paths: uPlot.paths?.bars?.({ size: [0.6] }),
      })),
    ],
    scales: {
      x: { time: false },
      y: { auto: true },
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
      },
    ],
  };
};

export const createPieConfig = (
  series: ChartSeries[],
  colors: string[]
): Partial<uPlot.Options> => {
  return {
    series: [
      {},
      ...series.map((s, idx) => ({
        label: s.label,
        stroke: colors[idx % colors.length],
        fill: colors[idx % colors.length],
      })),
    ],
  };
};
