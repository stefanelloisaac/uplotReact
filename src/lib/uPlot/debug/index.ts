/**
 * Debug utilities for chart development and troubleshooting
 */

import uPlot from "uplot";

export interface DebugConfig {
  enabled: boolean;
  logLevel: "error" | "warn" | "info" | "debug";
  showPerformanceMetrics: boolean;
  showDataValidation: boolean;
}

class ChartDebugger {
  private config: DebugConfig = {
    enabled: process.env.NODE_ENV === "development",
    logLevel: "info",
    showPerformanceMetrics: true,
    showDataValidation: true,
  };

  private performanceMarks = new Map<string, number>();

  configure(config: Partial<DebugConfig>) {
    this.config = { ...this.config, ...config };
  }

  log(level: DebugConfig["logLevel"], message: string, ...args: any[]) {
    if (!this.config.enabled) return;

    const levels = { error: 0, warn: 1, info: 2, debug: 3 };
    const currentLevel = levels[this.config.logLevel];
    const messageLevel = levels[level];

    if (messageLevel <= currentLevel) {
      const prefix = `[uPlot Debug ${level.toUpperCase()}]`;
      console[level === "debug" ? "log" : level](prefix, message, ...args);
    }
  }

  startPerformance(label: string) {
    if (!this.config.enabled || !this.config.showPerformanceMetrics) return;
    this.performanceMarks.set(label, performance.now());
  }

  endPerformance(label: string) {
    if (!this.config.enabled || !this.config.showPerformanceMetrics) return;

    const start = this.performanceMarks.get(label);
    if (start) {
      const duration = performance.now() - start;
      this.log("debug", `Performance: ${label} took ${duration.toFixed(2)}ms`);
      this.performanceMarks.delete(label);
    }
  }

  validateData(data: uPlot.AlignedData, name?: string): boolean {
    if (!this.config.enabled || !this.config.showDataValidation) return true;

    const prefix = name ? `[${name}]` : "[Chart Data]";

    if (!Array.isArray(data)) {
      this.log("error", `${prefix} Data must be an array`);
      return false;
    }

    if (data.length === 0) {
      this.log("warn", `${prefix} Data array is empty`);
      return false;
    }

    if (!data[0] || data[0].length === 0) {
      this.log("warn", `${prefix} No data points found`);
      return false;
    }

    const expectedLength = data[0].length;
    for (let i = 1; i < data.length; i++) {
      if (data[i].length !== expectedLength) {
        this.log(
          "error",
          `${prefix} Series ${i} length mismatch: expected ${expectedLength}, got ${data[i].length}`
        );
        return false;
      }
    }

    this.log(
      "debug",
      `${prefix} Validation passed: ${data.length} series, ${expectedLength} points each`
    );
    return true;
  }

  validateOptions(options: uPlot.Options, name?: string): boolean {
    if (!this.config.enabled) return true;

    const prefix = name ? `[${name}]` : "[Chart Options]";

    if (!options.width || !options.height) {
      this.log("warn", `${prefix} Missing width or height`);
    }

    if (!options.series || options.series.length === 0) {
      this.log("error", `${prefix} No series defined`);
      return false;
    }

    this.log(
      "debug",
      `${prefix} Validation passed: ${options.series.length} series configured`
    );
    return true;
  }

  inspectChart(chart: uPlot, name?: string) {
    if (!this.config.enabled) return;

    const prefix = name ? `[${name}]` : "[Chart]";

    this.log("info", `${prefix} Chart instance created`);
    this.log("debug", `${prefix} DOM element:`, chart.root);
    this.log("debug", `${prefix} Data:`, chart.data);
    this.log("debug", `${prefix} Series count:`, chart.series.length);
  }

  logError(error: Error, context?: string) {
    if (!this.config.enabled) return;

    const prefix = context ? `[${context}]` : "[Chart Error]";
    this.log("error", `${prefix} ${error.message}`);
    this.log("debug", `${prefix} Stack:`, error.stack);
  }

  logDataUpdate(
    oldData: uPlot.AlignedData,
    newData: uPlot.AlignedData,
    name?: string
  ) {
    if (!this.config.enabled || this.config.logLevel !== "debug") return;

    const prefix = name ? `[${name}]` : "[Data Update]";

    this.log("debug", `${prefix} Data updated`);
    this.log("debug", `${prefix} Old points: ${oldData[0]?.length || 0}`);
    this.log("debug", `${prefix} New points: ${newData[0]?.length || 0}`);
    this.log("debug", `${prefix} Series: ${newData.length}`);
  }
}

export const chartDebugger = new ChartDebugger();

export const debug = chartDebugger.log.bind(chartDebugger, "debug");
export const info = chartDebugger.log.bind(chartDebugger, "info");
export const warn = chartDebugger.log.bind(chartDebugger, "warn");
export const error = chartDebugger.log.bind(chartDebugger, "error");
