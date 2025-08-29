import React from "react";
import uPlot from "uplot";
import "uplot/dist/uPlot.min.css";
import UPlotChart from "./UplotChart";

const multiBarsBuilder: uPlot.Series.PathBuilder = (
  u,
  seriesIdx,
  idx0,
  idx1
) => {
  const stroke = new Path2D();
  const fill = new Path2D();

  const xdata = u.data[0];
  const ys = u.data;
  const barsCount = ys.length - 1;
  const colWidth = u.bbox.width / (idx1 - idx0 + 1);
  const barWidth = (colWidth / barsCount) * 0.8;
  const scaleX = u.series[0].scale as string;
  const scaleY = u.series[seriesIdx].scale as string;

  for (let i = idx0; i <= idx1; i++) {
    const x = xdata[i];
    const y = ys[seriesIdx][i];
    if (y == null) continue;

    const xPos = u.valToPos(x, scaleX, true);
    const yPos = u.valToPos(y, scaleY, true);
    const base = u.valToPos(0, scaleY, true);

    const offset = (seriesIdx - 1 - (barsCount - 1) / 2) * barWidth;
    const xRect = xPos + offset - barWidth / 2;
    const yRect = Math.min(yPos, base);
    const hRect = Math.abs(yPos - base);

    fill.rect(xRect, yRect, barWidth, hRect);
    stroke.rect(xRect, yRect, barWidth, hRect);
  }

  return { stroke, fill };
};

interface BarChartProps {
  data?: uPlot.AlignedData;
}

const BarChart: React.FC<BarChartProps> = ({ data: propData }) => {
  const data: uPlot.AlignedData = propData || [
    [0, 1, 2, 3, 4],
    [3, 7, 4, 6, 9],
    [5, 2, 8, 3, 7],
    [4, 6, 5, 7, 8],
    [6, 4, 7, 5, 6],
  ];

  const options: uPlot.Options = {
    width: 600,
    height: 300,
    series: [
      {},
      {
        label: "Série A",
        fill: "rgba(0, 128, 255, 0.6)",
        paths: multiBarsBuilder,
      },
      {
        label: "Série B",
        fill: "rgba(255, 128, 0, 0.6)",
        paths: multiBarsBuilder,
      },
      {
        label: "Série C",
        fill: "rgba(0, 255, 128, 0.6)",
        paths: multiBarsBuilder,
      },
      {
        label: "Série D",
        fill: "rgba(255, 0, 128, 0.6)",
        paths: multiBarsBuilder,
      },
    ],
    axes: [{}, { label: "Valor" }],
  };

  return <UPlotChart data={data} options={options} />;
};

export default BarChart;
