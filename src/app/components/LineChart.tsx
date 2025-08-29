import React from "react";
import uPlot from "uplot";
import UPlotChart from "./UplotChart";

interface LineChartProps {
  data?: uPlot.AlignedData;
}

const LineChart: React.FC<LineChartProps> = ({ data: propData }) => {
  const data: uPlot.AlignedData = propData || [
    [0, 1, 2, 3, 4],
    [10, 20, 15, 25, 30],
  ];

  const options: uPlot.Options = {
    width: 600,
    height: 300,
    series: [{}, { label: "Linha", stroke: "blue", width: 2 }],
  };

  return <UPlotChart data={data} options={options} />;
};

export default LineChart;
