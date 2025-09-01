/**
 * Main entry point for uPlot React library
 * Provides clean, tree-shakable exports
 */

export { default as UplotReact } from "./core/UplotReact";
export { default as StyledChart } from "./styled/StyledChart";

export { ChartErrorBoundary } from "./components/ErrorBoundary";
export { LoadingFallback, EmptyState } from "./components/LoadingFallback";

export type {
  UplotReactProps,
  StyledChartProps,
  BaseChartProps,
  ChartTheme,
  ResponsiveConfig,
  ChartConfig,
  OptionsUpdateState,
  DataMatchOptions,
} from "./types";

export { defaultTheme, darkTheme, lightTheme, themes } from "./config/themes";
export {
  defaultResponsive,
  defaultDimensions,
  defaultChartConfig,
  chartTypeDefaults,
} from "./config/defaults";

export { dataMatch, optionsUpdateState } from "./utils";

export {
  createLineChartConfig,
  createAreaChartConfig,
  createScatterChartConfig,
  mergeChartConfigs,
  validateChartData,
  debugChart,
} from "./helpers/chartHelpers";

export { chartPool } from "./performance/ChartPool";
export { processedDataCache, optionsCache } from "./performance/DataCache";

export { exportPlugin, ChartExporter } from "./plugins/exportPlugin";
export { accessibilityPlugin, ChartAccessibility } from "./accessibility";

export { chartDebugger, debug, info, warn, error } from "./debug";

export * from "./lazy";
