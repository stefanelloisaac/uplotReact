import uPlot from "uplot";
import type { ChartTheme, ResponsiveConfig } from "@/lib/uPlot/types";

export type ChartType = "line" | "area" | "bar" | "pie" | "scatter";

export type ThemeName =
  | "Default"
  | "City Park"
  | "Classroom"
  | "Colorblind Safe"
  | "Electric"
  | "High Contrast"
  | "Sunset"
  | "Twilight";

export interface ChartSeries {
  label: string;
  data?: number[];
  color?: string;
  fill?: string;
  stroke?: string;
  width?: number;
  pointSize?: number;
  smooth?: boolean;
}

export interface ChartProps {
  type: ChartType;
  data: uPlot.AlignedData;
  series?: ChartSeries[];
  chartTheme?: ThemeName | Partial<ChartTheme>;
  width?: number;
  height?: number;
  title?: string;
  className?: string;
  responsive?: boolean | Partial<ResponsiveConfig>;
  enableExport?: boolean;
  enableAccessibility?: boolean;
  enableCaching?: boolean;
  enableLazyLoading?: boolean;
  loadOnHover?: boolean;
  loadOnVisible?: boolean;
  preloadDelay?: number;
  loadingFallback?: React.ReactNode;
  errorFallback?: React.ReactNode;
  emptyFallback?: React.ReactNode;
  onError?: (error: Error) => void;
  onCreate?: (chart: uPlot) => void;
  onDelete?: (chart: uPlot) => void;
  debug?: boolean;
  plugins?: uPlot.Plugin[];
  customOptions?: Partial<uPlot.Options>;
}

export interface ThemeColors {
  grid: string;
  axis: string;
  tick: string;
}