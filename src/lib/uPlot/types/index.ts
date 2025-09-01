import uPlot from "uplot";

// Base chart types
export interface ChartTheme {
  gridColor: string;
  axisColor: string;
  tickColor?: string;
  backgroundColor?: string;
  colors?: string[];
}

export interface ChartDimensions {
  width: number;
  height: number;
}

export interface ResponsiveConfig {
  minWidth?: number;
  minHeight?: number;
  aspectRatio?: number;
  legendSpace?: number;
}

// Core uPlot React component props
export interface UplotReactProps {
  options: uPlot.Options;
  data: uPlot.AlignedData;
  target?: HTMLElement | ((self: uPlot, init: Function) => void);
  onDelete?: (chart: uPlot) => void;
  onCreate?: (chart: uPlot) => void;
}

// Styled chart component props
export interface StyledChartProps {
  data: uPlot.AlignedData;
  options: uPlot.Options;
  theme?: Partial<ChartTheme>;
  responsive?: Partial<ResponsiveConfig>;
  className?: string;
}

// Chart configuration types
export interface ChartConfig {
  theme: ChartTheme;
  responsive: ResponsiveConfig;
  defaults: {
    width: number;
    height: number;
  };
}

// Utility function types
export type OptionsUpdateState = "keep" | "update" | "create";

export interface DataMatchOptions {
  strict?: boolean;
  skipEmptyCheck?: boolean;
}

// Chart-specific prop types
export interface BaseChartProps {
  data?: uPlot.AlignedData;
  theme?: Partial<ChartTheme>;
  responsive?: Partial<ResponsiveConfig>;
}
