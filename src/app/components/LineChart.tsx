import React, { useMemo } from "react";
import uPlot from "uplot";
import StyledChart from "../lib/uPlot/styled/StyledChart";
import { BaseChartProps } from "../lib/uPlot/types";

interface LineChartProps extends BaseChartProps {}

const LineChart: React.FC<LineChartProps> = ({
  data: propData,
  theme,
  responsive,
}) => {
  const data: uPlot.AlignedData = propData || [
    [0, 1, 2, 3, 4],
    [10, 20, 15, 25, 30],
  ];

  const options: uPlot.Options = useMemo(
    () => ({
      width: 600,
      height: 300,
      series: [{}, { label: "Linha", stroke: "blue", width: 2 }],
    }),
    []
  );

  const chartData: uPlot.AlignedData = useMemo(() => data, [data]);

  return (
    <StyledChart
      data={chartData}
      options={options}
      theme={theme}
      responsive={responsive}
    />
  );
};

export default LineChart;
