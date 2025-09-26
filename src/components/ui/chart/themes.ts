import { ThemeName, ThemeColors } from "./types";

export const PREDEFINED_THEMES: Record<ThemeName, string[]> = {
  Default: [
    "oklch(0.674 0.419 185.4)",
    "oklch(0.286 0.064 216.1)",
    "oklch(0.620 0.677 29.8)",
    "oklch(0.820 0.816 89.8)",
    "oklch(0.443 0.049 213.1)",
    "oklch(0.810 0.253 227.2)",
    "oklch(0.721 0.544 50.3)",
    "oklch(0.524 0.357 333.4)",
  ],
  "City Park": [
    "oklch(0.683 0.531 135.9)",
    "oklch(0.383 0.308 286.5)",
    "oklch(0.816 0.666 90.6)",
    "oklch(0.502 0.594 31.3)",
    "oklch(0.692 0.324 259.2)",
    "oklch(0.536 0.572 305.5)",
    "oklch(0.719 0.485 60.3)",
    "oklch(0.819 0.294 163.4)",
  ],
  Classroom: [
    "oklch(0.577 0.467 274.5)",
    "oklch(0.399 0.277 282.8)",
    "oklch(0.823 0.817 89.8)",
    "oklch(0.555 0.576 29.3)",
    "oklch(0.638 0.463 163.0)",
    "oklch(0.785 0.259 254.7)",
    "oklch(0.669 0.449 58.1)",
    "oklch(0.501 0.398 323.5)",
  ],
  "Colorblind Safe": [
    "oklch(0.267 0.183 218.1)",
    "oklch(0.547 0.331 196.4)",
    "oklch(0.661 0.634 350.1)",
    "oklch(0.814 0.328 346.0)",
    "oklch(0.217 0.818 312.2)",
    "oklch(0.607 0.617 300.0)",
    "oklch(0.819 0.184 254.1)",
    "oklch(0.730 0.262 249.4)",
  ],
  Electric: [
    "oklch(0.566 0.769 264.3)",
    "oklch(0.252 0.373 313.4)",
    "oklch(0.513 0.632 343.2)",
    "oklch(0.730 0.586 49.4)",
    "oklch(0.747 0.470 186.7)",
    "oklch(0.825 0.435 160.6)",
    "oklch(0.327 0.261 259.7)",
    "oklch(0.544 0.673 23.0)",
  ],
  "High Contrast": [
    "oklch(0.422 0.664 136.0)",
    "oklch(0.119 0.228 254.9)",
    "oklch(0.320 0.713 36.6)",
    "oklch(0.274 0.345 306.2)",
    "oklch(0.230 0.228 197.7)",
    "oklch(0.512 0.573 256.8)",
    "oklch(0.551 0.637 30.5)",
    "oklch(0.379 0.555 310.4)",
  ],
  Sunset: [
    "oklch(0.848 0.201 280.0)",
    "oklch(0.327 0.261 259.7)",
    "oklch(0.732 0.586 49.4)",
    "oklch(0.513 0.632 343.2)",
    "oklch(0.882 0.191 329.7)",
    "oklch(0.858 0.373 187.0)",
    "oklch(0.639 0.369 222.5)",
    "oklch(0.892 0.434 95.0)",
  ],
  Twilight: [
    "oklch(0.603 0.592 47.6)",
    "oklch(0.221 0.170 193.1)",
    "oklch(0.700 0.692 96.8)",
    "oklch(0.305 0.040 251.6)",
    "oklch(0.453 0.694 27.7)",
    "oklch(0.837 0.162 188.2)",
    "oklch(0.406 0.330 128.2)",
    "oklch(0.678 0.344 187.8)",
  ],
};

export const getComputedChartColors = (isDark: boolean = false): ThemeColors => {
  if (typeof window === "undefined") {
    return {
      grid: isDark ? "oklch(1 0 0 / 10%)" : "oklch(0.9 0 0)",
      axis: isDark ? "oklch(0.6 0 0)" : "oklch(0.6 0 0)",
      tick: isDark ? "oklch(0.4 0 0)" : "oklch(0.6 0 0)",
    };
  }

  const styles = getComputedStyle(document.documentElement);
  const grid = styles.getPropertyValue("--chart-grid").trim();
  const axis = styles.getPropertyValue("--chart-axis").trim();
  const tick = styles.getPropertyValue("--chart-tick").trim();

  return {
    grid: grid || (isDark ? "oklch(1 0 0 / 10%)" : "oklch(0.9 0 0)"),
    axis: axis || (isDark ? "oklch(0.6 0 0)" : "oklch(0.6 0 0)"),
    tick: tick || (isDark ? "oklch(0.4 0 0)" : "oklch(0.6 0 0)"),
  };
};