/**
 * Root library exports
 * Main entry point for the chart library
 */

export * from "./uPlot";

export { default as Chart } from "./uPlot/styled/StyledChart";
export { default as UPlot } from "./uPlot/core/UplotReact";

export type {
  StyledChartProps as ChartProps,
  ChartTheme,
  ResponsiveConfig,
} from "./uPlot/types";

export { themes, defaultTheme } from "./uPlot/config/themes";
