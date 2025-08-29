import React, { useMemo } from "react";
import uPlot from "uplot";
import StyledChart from "../lib/uPlot/styled/StyledChart";
import { BaseChartProps } from "../lib/uPlot/types";

interface ScatterChartProps extends BaseChartProps {}

const ScatterChart: React.FC<ScatterChartProps> = ({
  data: propData,
  theme,
  responsive,
}) => {
  const data: uPlot.AlignedData = propData || [
    [0, 1, 2, 3, 4],
    [5, 15, 10, 20, 18],
  ];

  // Create stable keys for memoization
  const dataLength = data[0]?.length || 0;
  const lastDataPoint =
    dataLength > 0
      ? `${data[0]?.[dataLength - 1]}_${data[1]?.[dataLength - 1]}`
      : "";

  const trendLineData = useMemo(() => {
    if (!data[0] || !data[1] || data[0].length < 2) return [];

    const xData = data[0] as number[];
    const yData = data[1] as number[];
    const n = xData.length;

    if (n === 0) return [];

    // For performance, only recalculate trend line every 3 data points
    if (n > 3 && n % 3 !== 0) {
      const prevN = n - (n % 3);
      const prevXData = xData.slice(0, prevN);
      const prevYData = yData.slice(0, prevN);

      try {
        const sumX = prevXData.reduce((a, b) => a + b, 0);
        const sumY = prevYData.reduce((a, b) => a + b, 0);
        const sumXY = prevXData.reduce(
          (sum, x, i) => sum + x * prevYData[i],
          0
        );
        const sumXX = prevXData.reduce((sum, x) => sum + x * x, 0);

        const denominator = prevN * sumXX - sumX * sumX;

        if (Math.abs(denominator) < 0.0001) {
          return xData.map(() => sumY / prevN);
        }

        const slope = (prevN * sumXY - sumX * sumY) / denominator;
        const intercept = (sumY - slope * sumX) / prevN;

        return xData.map((x) => slope * x + intercept);
      } catch (error) {
        console.warn("Trend line calculation failed:", error);
        return [];
      }
    }

    try {
      const sumX = xData.reduce((a, b) => a + b, 0);
      const sumY = yData.reduce((a, b) => a + b, 0);
      const sumXY = xData.reduce((sum, x, i) => sum + x * yData[i], 0);
      const sumXX = xData.reduce((sum, x) => sum + x * x, 0);

      const denominator = n * sumXX - sumX * sumX;

      if (Math.abs(denominator) < 0.0001) {
        return yData.map(() => sumY / n);
      }

      const slope = (n * sumXY - sumX * sumY) / denominator;
      const intercept = (sumY - slope * sumX) / n;

      return xData.map((x) => slope * x + intercept);
    } catch (error) {
      console.warn("Trend line calculation failed:", error);
      return [];
    }
  }, [dataLength, lastDataPoint]);

  const options: uPlot.Options = useMemo(
    () => ({
      width: 600,
      height: 300,
      series: [
        {},
        {
          label: "Pontos",
          stroke: "transparent",
          points: {
            show: true,
            size: 8,
            fill: "rgba(59, 130, 246, 0.8)",
            stroke: "rgb(29, 78, 216)",
            width: 2,
          },
        },
        {
          label: "Tendência",
          stroke: "rgba(239, 68, 68, 0.8)",
          width: 2,
          fill: "transparent",
          points: { show: false },
        },
      ],
    }),
    []
  );

  const chartData: uPlot.AlignedData = useMemo(
    () => [data[0], data[1], trendLineData],
    [data[0], data[1], trendLineData]
  );

  return (
    <StyledChart
      data={chartData}
      options={options}
      theme={theme}
      responsive={responsive}
    />
  );
};

export default ScatterChart;
