import React from "react";
import uPlot from "uplot";
import UPlotChart from "./UplotChart";

interface AreaChartProps {
  data?: uPlot.AlignedData;
}

const AreaChart: React.FC<AreaChartProps> = ({ data: propData }) => {
  const data: uPlot.AlignedData = propData || [
    [0, 1, 2, 3, 4],
    [2, 6, 4, 8, 7],
  ];

  const options: uPlot.Options = {
    width: 600,
    height: 300,
    series: [
      {},
      {
        label: "Área",
        stroke: "green",
        fill: "rgba(0, 255, 0, 0.1)",
        width: 2,
        paths: uPlot.paths?.spline ? uPlot.paths.spline() : undefined,
      },
    ],
  };

  return <UPlotChart data={data} options={options} />;
};

export default AreaChart;
