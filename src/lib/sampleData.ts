import type { ChartSeries } from "@/components/ui/Chart";
import uPlot from "uplot";

// Generate sample time series data
export const generateTimeSeriesData = (
  points: number = 50
): uPlot.AlignedData => {
  const timestamps = Array.from({ length: points }, (_, i) => i);
  const series1 = Array.from(
    { length: points },
    (_, i) => Math.sin(i * 0.2) * 50 + Math.random() * 20 + 100
  );
  const series2 = Array.from(
    { length: points },
    (_, i) => Math.cos(i * 0.15) * 40 + Math.random() * 15 + 80
  );
  const series3 = Array.from(
    { length: points },
    (_, i) => Math.sin(i * 0.3) * 30 + Math.random() * 25 + 60
  );

  return [timestamps, series1, series2, series3];
};

// Generate sample bar chart data
export const generateBarData = (): uPlot.AlignedData => {
  const categories = [0, 1, 2, 3, 4, 5]; // Representing categories
  const values1 = [65, 45, 78, 52, 88, 92];
  const values2 = [38, 72, 45, 69, 54, 67];
  const values3 = [28, 35, 58, 42, 71, 48];

  return [categories, values1, values2, values3];
};

// Generate sample scatter data
export const generateScatterData = (): uPlot.AlignedData => {
  const points = 30;
  const x = Array.from({ length: points }, () => Math.random() * 100);
  const y1 = x.map((val) => val * 0.8 + Math.random() * 20);
  const y2 = x.map((val) => val * -0.5 + 80 + Math.random() * 15);

  return [x, y1, y2];
};

// Generate sample area chart data
export const generateAreaData = (): uPlot.AlignedData => {
  const points = 40;
  const timestamps = Array.from({ length: points }, (_, i) => i);
  const series1 = Array.from({ length: points }, (_, i) =>
    Math.max(0, Math.sin(i * 0.3) * 30 + 50 + Math.random() * 10)
  );
  const series2 = Array.from({ length: points }, (_, i) =>
    Math.max(0, Math.cos(i * 0.2) * 25 + 40 + Math.random() * 8)
  );

  return [timestamps, series1, series2];
};

// Sample series configurations - colors will be applied from theme
export const sampleLineSeries: ChartSeries[] = [
  { label: "Revenue" },
  { label: "Profit" },
  { label: "Expenses" },
];

export const sampleBarSeries: ChartSeries[] = [
  { label: "Q1 Sales" },
  { label: "Q2 Sales" },
  { label: "Q3 Sales" },
];

export const sampleScatterSeries: ChartSeries[] = [
  { label: "Dataset A", pointSize: 6 },
  { label: "Dataset B", pointSize: 8 },
];

export const sampleAreaSeries: ChartSeries[] = [
  { label: "Page Views", smooth: true },
  { label: "Unique Visitors", smooth: true },
];
