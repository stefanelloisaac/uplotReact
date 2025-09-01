/**
 * Type definitions and documentation for uPlot React components
 */

import uPlot from "uplot";

/**
 * Theme configuration for chart styling
 */
export interface ChartTheme {
  gridColor: string;
  axisColor: string;
  backgroundColor?: string;
}

/**
 * Responsive behavior configuration
 */
export interface ResponsiveConfig {
  minWidth?: number;
  minHeight?: number;
  aspectRatio?: number;
  legendSpace?: number;
}

/**
 * Props for the core UplotReact component
 */
export interface UplotReactProps {
  options: uPlot.Options;
  data: uPlot.AlignedData;
  target?: HTMLElement | ((self: uPlot, init: Function) => void);
  onDelete?: (chart: uPlot) => void;
  onCreate?: (chart: uPlot) => void;
}

/**
 * Props for the styled chart component
 */
export interface StyledChartProps {
  data: uPlot.AlignedData;
  options: uPlot.Options;
  theme?: Partial<ChartTheme>;
  responsive?: Partial<ResponsiveConfig>;
  className?: string;
}

/**
 * Base props interface for individual chart components
 */
export interface BaseChartProps {
  data?: uPlot.AlignedData;
  theme?: Partial<ChartTheme>;
  responsive?: Partial<ResponsiveConfig>;
}

/**
 * Options for data comparison utilities
 */
export interface DataMatchOptions {
  strict?: boolean;
  skipEmptyCheck?: boolean;
}

/**
 * Chart creation state for optimization
 */
export type OptionsUpdateState = "keep" | "update" | "create";

/**
 * Configuration for complete chart setup
 */
export interface ChartConfig {
  theme: ChartTheme;
  responsive: ResponsiveConfig;
  defaults: {
    width: number;
    height: number;
  };
}
