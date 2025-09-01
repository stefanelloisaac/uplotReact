import { ResponsiveConfig } from "../types";

export const defaultResponsive: ResponsiveConfig = {
  minWidth: 200,
  minHeight: 150,
  aspectRatio: 2,
  legendSpace: 60, // More generous space for legend
};

export const defaultDimensions = {
  width: 600,
  height: 300,
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
