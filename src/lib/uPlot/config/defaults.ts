import { ResponsiveConfig, ChartConfig } from "../types";
import { defaultTheme } from "./themes";

export const defaultResponsive: ResponsiveConfig = {
  minWidth: 200,
  minHeight: 150,
  aspectRatio: 2,
  legendSpace: 30,
};

export const defaultDimensions = {
  width: 600,
  height: 300,
};

export const defaultChartConfig: ChartConfig = {
  theme: defaultTheme,
  responsive: defaultResponsive,
  defaults: defaultDimensions,
};

export const chartTypeDefaults = {
  line: {
    strokeWidth: 2,
    pointSize: 0,
  },
  area: {
    strokeWidth: 2,
    fillOpacity: 0.3,
  },
  scatter: {
    pointSize: 8,
    strokeWidth: 2,
  },
  bar: {
    barWidth: 0.8,
    groupSpacing: 0.1,
  },
} as const;
