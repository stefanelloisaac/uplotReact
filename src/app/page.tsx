"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Responsive, WidthProvider, Layout } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import LineChart from "./components/LineChart";
import BarChart from "./components/BarChart";
import AreaChart from "./components/AreaChart";
import ScatterChart from "./components/ScatterChart";
import Card from "./components/Card";
import uPlot from "uplot";

const ResponsiveGridLayout = WidthProvider(Responsive);

interface ChartItem {
  id: string;
  component: React.ReactNode;
}

const generateRandomValue = (): number => {
  return Math.floor(Math.random() * 30) + 5;
};

const MAX_POINTS = 20;

export default function Page() {
  const [timeCounter, setTimeCounter] = useState(5);
  const [lineData, setLineData] = useState<uPlot.AlignedData>([
    [0, 1, 2, 3, 4],
    [
      generateRandomValue(),
      generateRandomValue(),
      generateRandomValue(),
      generateRandomValue(),
      generateRandomValue(),
    ],
  ]);
  const [areaData, setAreaData] = useState<uPlot.AlignedData>([
    [0, 1, 2, 3, 4],
    [
      generateRandomValue(),
      generateRandomValue(),
      generateRandomValue(),
      generateRandomValue(),
      generateRandomValue(),
    ],
  ]);
  const [scatterData, setScatterData] = useState<uPlot.AlignedData>([
    [0, 1, 2, 3, 4],
    [
      generateRandomValue(),
      generateRandomValue(),
      generateRandomValue(),
      generateRandomValue(),
      generateRandomValue(),
    ],
  ]);
  const [barData, setBarData] = useState<uPlot.AlignedData>([
    [0, 1, 2, 3, 4],
    [
      generateRandomValue(),
      generateRandomValue(),
      generateRandomValue(),
      generateRandomValue(),
      generateRandomValue(),
    ],
    [
      generateRandomValue(),
      generateRandomValue(),
      generateRandomValue(),
      generateRandomValue(),
      generateRandomValue(),
    ],
    [
      generateRandomValue(),
      generateRandomValue(),
      generateRandomValue(),
      generateRandomValue(),
      generateRandomValue(),
    ],
    [
      generateRandomValue(),
      generateRandomValue(),
      generateRandomValue(),
      generateRandomValue(),
      generateRandomValue(),
    ],
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newTime = timeCounter;
      console.log(`Adding new data point at time: ${newTime}`);

      setLineData((prevData) => {
        const newX = [...prevData[0], newTime];
        const newY = [...prevData[1], generateRandomValue()];

        const trimmedX = newX.slice(-MAX_POINTS);
        const trimmedY = newY.slice(-MAX_POINTS);

        console.log("Line data updated:", [trimmedX, trimmedY]);
        return [trimmedX, trimmedY];
      });

      setAreaData((prevData) => {
        const newX = [...prevData[0], newTime];
        const newY = [...prevData[1], generateRandomValue()];

        const trimmedX = newX.slice(-MAX_POINTS);
        const trimmedY = newY.slice(-MAX_POINTS);

        return [trimmedX, trimmedY];
      });

      setScatterData((prevData) => {
        const newX = [...prevData[0], newTime];
        const newY = [...prevData[1], generateRandomValue()];

        const trimmedX = newX.slice(-MAX_POINTS);
        const trimmedY = newY.slice(-MAX_POINTS);

        return [trimmedX, trimmedY];
      });

      setBarData((prevData) => {
        const newX = [...prevData[0], newTime];
        const newY1 = [...prevData[1], generateRandomValue()];
        const newY2 = [...prevData[2], generateRandomValue()];
        const newY3 = [...prevData[3], generateRandomValue()];
        const newY4 = [...prevData[4], generateRandomValue()];

        const trimmedX = newX.slice(-MAX_POINTS);
        const trimmedY1 = newY1.slice(-MAX_POINTS);
        const trimmedY2 = newY2.slice(-MAX_POINTS);
        const trimmedY3 = newY3.slice(-MAX_POINTS);
        const trimmedY4 = newY4.slice(-MAX_POINTS);

        return [trimmedX, trimmedY1, trimmedY2, trimmedY3, trimmedY4];
      });

      setTimeCounter((prev) => prev + 1);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [timeCounter]);

  const charts = useMemo<ChartItem[]>(
    () => [
      {
        id: "line",
        component: (
          <Card title="Gráfico de Linha">
            <LineChart data={lineData} />
          </Card>
        ),
      },
      {
        id: "scatter",
        component: (
          <Card title="Gráfico de Pontos">
            <ScatterChart data={scatterData} />
          </Card>
        ),
      },
      {
        id: "area",
        component: (
          <Card title="Gráfico de Área">
            <AreaChart data={areaData} />
          </Card>
        ),
      },
      {
        id: "bar",
        component: (
          <Card title="Gráfico de Barras">
            <BarChart data={barData} />
          </Card>
        ),
      },
    ],
    [lineData, areaData, scatterData, barData]
  );

  const layout: Layout[] = charts.map((chart, index) => ({
    i: chart.id,
    x: (index % 2) * 6,
    y: Math.floor(index / 2) * 6,
    w: 6,
    h: 6,
  }));

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6">
        Dashboard Responsivo com uPlot
      </h1>

      <ResponsiveGridLayout
        className="layout"
        layouts={{ lg: layout }}
        breakpoints={{ lg: 1400, md: 1200, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 10, sm: 8, xs: 4, xxs: 2 }}
        rowHeight={60}
        isDraggable={true}
        isResizable={true}
        onLayoutChange={() => {}}
        resizeHandles={["se", "s", "e", "n", "w", "ne", "nw", "sw"]}
      >
        {charts.map((chart) => (
          <div key={chart.id} className="h-full">
            {chart.component}
          </div>
        ))}
      </ResponsiveGridLayout>
    </main>
  );
}
