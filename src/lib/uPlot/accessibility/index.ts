import uPlot from "uplot";

export interface AccessibilityOptions {
  title?: string;
  description?: string;
  keyboardNavigation?: boolean;
  announceUpdates?: boolean;
  seriesLabels?: string[];
}

export class ChartAccessibility {
  private chart: uPlot;
  private options: AccessibilityOptions;
  private ariaLiveRegion?: HTMLElement;
  private styleElement?: HTMLStyleElement;

  constructor(chart: uPlot, options: AccessibilityOptions = {}) {
    this.chart = chart;
    this.options = {
      keyboardNavigation: true,
      announceUpdates: true,
      ...options,
    };

    this.init();
  }

  private init(): void {
    this.setupARIA();
    this.setupKeyboardNavigation();
    this.setupLiveRegion();
  }

  private setupARIA(): void {
    const root = this.chart.root;

    root.setAttribute("tabindex", "0");
    root.setAttribute("role", "img");

    if (this.options.title) {
      root.setAttribute("aria-label", this.options.title);
    }

    if (this.options.description) {
      const descId = `chart-desc-${Math.random().toString(36).substr(2, 9)}`;
      const desc = document.createElement("div");
      desc.id = descId;
      desc.className = "sr-only";
      desc.textContent = this.options.description;
      root.appendChild(desc);
      root.setAttribute("aria-describedby", descId);
    }
  }

  private setupKeyboardNavigation(): void {
    if (!this.options.keyboardNavigation) return;

    const root = this.chart.root;
    let currentPoint = 0;

    root.addEventListener("keydown", (e) => {
      const data = this.chart.data;
      if (!data || !data[0] || data[0].length === 0) return;

      const maxPoint = data[0].length - 1;

      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault();
          currentPoint = Math.max(0, currentPoint - 1);
          this.announceCurrentPoint(currentPoint);
          break;

        case "ArrowRight":
          e.preventDefault();
          currentPoint = Math.min(maxPoint, currentPoint + 1);
          this.announceCurrentPoint(currentPoint);
          break;

        case "Home":
          e.preventDefault();
          currentPoint = 0;
          this.announceCurrentPoint(currentPoint);
          break;

        case "End":
          e.preventDefault();
          currentPoint = maxPoint;
          this.announceCurrentPoint(currentPoint);
          break;

        case "Enter":
        case " ":
          e.preventDefault();
          this.announceDetailedPoint(currentPoint);
          break;
      }
    });

    if (!document.getElementById("uplot-accessibility-styles")) {
      this.styleElement = document.createElement("style");
      this.styleElement.id = "uplot-accessibility-styles";
      this.styleElement.textContent = `
        .uplot:focus {
          outline: 2px solid #3b82f6;
          outline-offset: 2px;
        }
      `;
      document.head.appendChild(this.styleElement);
    }
  }

  private setupLiveRegion(): void {
    if (!this.options.announceUpdates) return;

    this.ariaLiveRegion = document.createElement("div");
    this.ariaLiveRegion.setAttribute("aria-live", "polite");
    this.ariaLiveRegion.setAttribute("aria-atomic", "true");
    this.ariaLiveRegion.className = "sr-only";
    document.body.appendChild(this.ariaLiveRegion);
  }

  private announceCurrentPoint(index: number): void {
    if (!this.ariaLiveRegion) return;

    const data = this.chart.data;
    if (!data || !data[0] || index >= data[0].length) return;

    const xValue = data[0][index];
    const values = data
      .slice(1)
      .map((series, i) => {
        const seriesLabel =
          this.options.seriesLabels?.[i] ||
          this.chart.series[i + 1]?.label ||
          `Series ${i + 1}`;
        return `${seriesLabel}: ${series[index]}`;
      })
      .join(", ");

    this.ariaLiveRegion.textContent = `Point ${index + 1} of ${
      data[0].length
    }. X: ${xValue}. ${values}`;
  }

  private announceDetailedPoint(index: number): void {
    if (!this.ariaLiveRegion) return;

    const data = this.chart.data;
    if (!data || !data[0] || index >= data[0].length) return;

    const xValue = data[0][index];
    const detailed = data
      .slice(1)
      .map((series, i) => {
        const seriesLabel =
          this.options.seriesLabels?.[i] ||
          this.chart.series[i + 1]?.label ||
          `Series ${i + 1}`;
        const value = series[index];
        const seriesArray = Array.from(series);
        const numericSeries = seriesArray.filter(
          (v: any) => typeof v === "number"
        ) as number[];
        const percentage = this.calculatePercentage(numericSeries, value);
        return `${seriesLabel}: ${value} (${percentage}% of series max)`;
      })
      .join(". ");

    this.ariaLiveRegion.textContent = `Detailed view. X-axis: ${xValue}. ${detailed}`;
  }

  private calculatePercentage(series: number[], value: any): string {
    if (series.length === 0) return "0.0";
    const max = Math.max(...series);
    const percentage = max === 0 ? 0 : (value / max) * 100;
    return percentage.toFixed(1);
  }

  announceDataUpdate(message?: string): void {
    if (!this.ariaLiveRegion || !this.options.announceUpdates) return;

    const data = this.chart.data;
    const defaultMessage = `Chart updated. ${data.length - 1} series with ${
      data[0]?.length || 0
    } data points.`;
    this.ariaLiveRegion.textContent = message || defaultMessage;
  }

  destroy(): void {
    if (this.ariaLiveRegion && this.ariaLiveRegion.parentNode) {
      this.ariaLiveRegion.parentNode.removeChild(this.ariaLiveRegion);
      this.ariaLiveRegion = undefined;
    }

    if (this.styleElement && this.styleElement.parentNode) {
      this.styleElement.parentNode.removeChild(this.styleElement);
      this.styleElement = undefined;
    }
  }
}

export function accessibilityPlugin(
  options: AccessibilityOptions = {}
): uPlot.Plugin {
  let accessibility: ChartAccessibility;

  return {
    hooks: {
      init: (u) => {
        accessibility = new ChartAccessibility(u, options);
      },
      setData: () => {
        accessibility?.announceDataUpdate();
      },
      destroy: () => {
        accessibility?.destroy();
      },
    },
  };
}
