/**
 * Root library exports
 * Main entry point for the chart library
 */

export * from "./uPlot";

export { default as StyledChart } from "./uPlot/styled/StyledChart";
export { default as UPlot } from "./uPlot/core/UplotReact";

export type {
  StyledChartProps,
  ChartTheme,
  ResponsiveConfig,
} from "./uPlot/types";

export { themes, defaultTheme } from "./uPlot/config/themes";

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
