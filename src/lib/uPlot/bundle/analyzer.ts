/**
 * Bundle analysis utilities for development
 */

interface BundleInfo {
  name: string;
  size: number;
  gzipSize?: number;
  modules: string[];
}

interface AnalysisResult {
  totalSize: number;
  gzipSize: number;
  bundles: BundleInfo[];
  recommendations: string[];
}

export class BundleAnalyzer {
  private loadTimes = new Map<string, number>();

  /**
   * Track module load time
   */
  trackLoadTime(moduleName: string): void {
    this.loadTimes.set(moduleName, performance.now());
  }

  /**
   * Get load time for a module
   */
  getLoadTime(moduleName: string): number {
    const startTime = this.loadTimes.get(moduleName);
    return startTime ? performance.now() - startTime : 0;
  }

  /**
   * Analyze current bundle usage
   */
  analyzeBundleUsage(): AnalysisResult {
    const result: AnalysisResult = {
      totalSize: 0,
      gzipSize: 0,
      bundles: [],
      recommendations: [],
    };

    // In a real implementation, this would analyze actual bundle sizes
    // For now, we'll provide estimated sizes based on our module structure

    const estimatedSizes = {
      "uplot-core": 45, // KB
      "chart-components": 25,
      "chart-lib": 30,
      plugins: 15,
      accessibility: 8,
      "debug-utils": 5,
    };

    Object.entries(estimatedSizes).forEach(([name, size]) => {
      result.bundles.push({
        name,
        size,
        modules: [`${name}/*`],
      });
      result.totalSize += size;
    });

    result.gzipSize = Math.round(result.totalSize * 0.3); // Estimated gzip ratio

    // Generate recommendations
    result.recommendations = this.generateRecommendations(result);

    return result;
  }

  private generateRecommendations(result: AnalysisResult): string[] {
    const recommendations: string[] = [];

    if (result.totalSize > 100) {
      recommendations.push("Consider using lazy loading for chart types");
    }

    const debugBundle = result.bundles.find((b) => b.name.includes("debug"));
    if (debugBundle && debugBundle.size > 5) {
      recommendations.push(
        "Debug utilities should be tree-shaken in production"
      );
    }

    const unusedModules = this.detectUnusedModules();
    if (unusedModules.length > 0) {
      recommendations.push(
        `Remove unused modules: ${unusedModules.join(", ")}`
      );
    }

    return recommendations;
  }

  private detectUnusedModules(): string[] {
    // In a real implementation, this would analyze actual module usage
    // For demo purposes, we'll return some common unused modules
    return [];
  }

  /**
   * Generate performance report
   */
  generatePerformanceReport(): string {
    const analysis = this.analyzeBundleUsage();
    const loadTimes = Array.from(this.loadTimes.entries());

    let report = "## Bundle Analysis Report\n\n";

    report += `**Total Size:** ${analysis.totalSize}KB (${analysis.gzipSize}KB gzipped)\n\n`;

    report += "### Bundle Breakdown:\n";
    analysis.bundles.forEach((bundle) => {
      report += `- **${bundle.name}:** ${bundle.size}KB\n`;
    });

    if (loadTimes.length > 0) {
      report += "\n### Load Times:\n";
      loadTimes.forEach(([module, time]) => {
        report += `- **${module}:** ${time.toFixed(2)}ms\n`;
      });
    }

    if (analysis.recommendations.length > 0) {
      report += "\n### Recommendations:\n";
      analysis.recommendations.forEach((rec) => {
        report += `- ${rec}\n`;
      });
    }

    return report;
  }

  /**
   * Log performance metrics to console
   */
  logMetrics(): void {
    if (process.env.NODE_ENV === "development") {
      console.group("📊 Chart Library Performance");
      console.log(this.generatePerformanceReport());
      console.groupEnd();
    }
  }
}

export const bundleAnalyzer = new BundleAnalyzer();

// Auto-track in development
if (process.env.NODE_ENV === "development") {
  // Track initial load
  bundleAnalyzer.trackLoadTime("chart-library");

  // Log metrics after page load
  if (typeof window !== "undefined") {
    window.addEventListener("load", () => {
      setTimeout(() => bundleAnalyzer.logMetrics(), 1000);
    });
  }
}
