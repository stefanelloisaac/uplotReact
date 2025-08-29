import React from "react";
import uPlot from "uplot";
import UPlotChart from "./UplotChart";

interface ScatterChartProps {
  data?: uPlot.AlignedData;
}

const ScatterChart: React.FC<ScatterChartProps> = ({ data: propData }) => {
  const data: uPlot.AlignedData = propData || [
    [0, 1, 2, 3, 4],
    [5, 15, 10, 20, 18],
  ];

  const calculateTrendLine = (xData: number[], yData: number[]): number[] => {
    const n = xData.length;
    const sumX = xData.reduce((a, b) => a + b, 0);
    const sumY = yData.reduce((a, b) => a + b, 0);
    const sumXY = xData.reduce((sum, x, i) => sum + x * yData[i], 0);
    const sumXX = xData.reduce((sum, x) => sum + x * x, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    return xData.map((x) => slope * x + intercept);
  };

  const trendLineData =
    data[0].length > 0
      ? calculateTrendLine(data[0] as number[], data[1] as number[])
      : [];

  const options: uPlot.Options = {
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
  };

  const chartData: uPlot.AlignedData = [data[0], data[1], trendLineData];

  return <UPlotChart data={chartData} options={options} />;
};

export default ScatterChart;
