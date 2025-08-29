import React, { useMemo } from "react";
import uPlot from "uplot";
import StyledChart from "../lib/uPlot/styled/StyledChart";
import { BaseChartProps } from "../lib/uPlot/types";

interface AreaChartProps extends BaseChartProps {}

const AreaChart: React.FC<AreaChartProps> = ({
  data: propData,
  theme,
  responsive,
}) => {
  const data: uPlot.AlignedData = propData || [
    [0, 1, 2, 3, 4],
    [2, 6, 4, 8, 7],
  ];

  const options: uPlot.Options = useMemo(
    () => ({
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

export default AreaChart;
