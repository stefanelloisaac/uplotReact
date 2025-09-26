"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import RGL, { WidthProvider, Layout } from "react-grid-layout";
import {
  Chart,
  PREDEFINED_THEMES,
  type ThemeName,
} from "@/components/ui/Chart";
import { ModeToggle } from "@/components/ui/ThemeToggle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  generateTimeSeriesData,
  generateBarData,
  generateScatterData,
  generateAreaData,
  sampleLineSeries,
  sampleBarSeries,
  sampleScatterSeries,
  sampleAreaSeries,
} from "@/lib/sampleData";
import type uPlot from "uplot";

import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

const ReactGridLayout = WidthProvider(RGL);

export default function Dashboard() {
  const [chartTheme, setChartTheme] = useState<ThemeName>("Default");

  // Real-time data state
  const [lineData, setLineData] = useState<uPlot.AlignedData>(() =>
    generateTimeSeriesData()
  );
  const [barData, setBarData] = useState<uPlot.AlignedData>(() =>
    generateBarData()
  );
  const [scatterData, setScatterData] = useState<uPlot.AlignedData>(() =>
    generateScatterData()
  );
  const [areaData, setAreaData] = useState<uPlot.AlignedData>(() =>
    generateAreaData()
  );

  // Real-time updates state
  const [isRealTimeEnabled, setIsRealTimeEnabled] = useState(true);

  // Keep track of time for data generation
  const timeRef = useRef(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Maximum number of data points to keep (sliding window)
  const MAX_POINTS = 100;

  // Function to generate new data points for each chart type
  const generateNewDataPoint = (
    currentData: uPlot.AlignedData,
    chartType: "line" | "area" | "bar" | "scatter"
  ): uPlot.AlignedData => {
    const newData = [...currentData] as uPlot.AlignedData;

    switch (chartType) {
      case "line":
      case "area": {
        // Add new timestamp
        const lastTime = newData[0][newData[0].length - 1] as number;
        const newTime = lastTime + 1;

        // Add new data points for each series
        for (let i = 1; i < newData.length; i++) {
          const series = [...(newData[i] as number[])];
          let newValue: number;

          if (chartType === "line") {
            // Generate realistic time series data
            newValue =
              Math.sin(newTime * 0.2 + i) * 50 +
              Math.random() * 20 +
              100 -
              i * 10;
          } else {
            // Area chart - always positive values
            newValue = Math.max(
              0,
              Math.sin(newTime * 0.3 + i) * 30 + 50 + Math.random() * 10 - i * 5
            );
          }

          series.push(newValue);

          // Keep sliding window
          if (series.length > MAX_POINTS) {
            series.shift();
          }

          newData[i] = series;
        }

        // Update timestamps
        const timestamps = [...(newData[0] as number[])];
        timestamps.push(newTime);
        if (timestamps.length > MAX_POINTS) {
          timestamps.shift();
        }
        newData[0] = timestamps;

        break;
      }

      case "bar": {
        // For bar charts, just update the values randomly
        for (let i = 1; i < newData.length; i++) {
          const series = [...(newData[i] as number[])];
          for (let j = 0; j < series.length; j++) {
            // Add some randomness to existing values
            series[j] = Math.max(0, series[j] + (Math.random() - 0.5) * 20);
          }
          newData[i] = series;
        }
        break;
      }

      case "scatter": {
        // Add a new point and remove oldest if needed
        const x = [...(newData[0] as number[])];

        // Generate new x value
        const newX = Math.random() * 100;
        x.push(newX);

        // Generate corresponding y values
        for (let i = 1; i < newData.length; i++) {
          const y = [...(newData[i] as number[])];
          const newY =
            i === 1
              ? newX * 0.8 + Math.random() * 20
              : newX * -0.5 + 80 + Math.random() * 15;
          y.push(newY);

          // Keep sliding window
          if (y.length > MAX_POINTS) {
            y.shift();
          }

          newData[i] = y;
        }

        // Keep sliding window for x
        if (x.length > MAX_POINTS) {
          x.shift();
        }
        newData[0] = x;

        break;
      }
    }

    return newData;
  };

  // Real-time data update function
  const updateChartsData = useCallback(() => {
    setLineData((prev) => generateNewDataPoint(prev, "line"));
    setAreaData((prev) => generateNewDataPoint(prev, "area"));
    setBarData((prev) => generateNewDataPoint(prev, "bar"));
    setScatterData((prev) => generateNewDataPoint(prev, "scatter"));
    timeRef.current += 1;
  }, []);

  // Toggle real-time updates
  const toggleRealTime = useCallback(() => {
    setIsRealTimeEnabled((prev) => !prev);
  }, []);

  // Start real-time updates
  useEffect(() => {
    if (isRealTimeEnabled) {
      intervalRef.current = setInterval(updateChartsData, 10); // Update every 2 seconds
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [updateChartsData, isRealTimeEnabled]);

  const themeOptions = Object.keys(PREDEFINED_THEMES) as ThemeName[];

  // Grid layout configuration
  const [layout, setLayout] = useState<Layout[]>([
    { i: "line-chart", x: 0, y: 0, w: 6, h: 7, minW: 4, minH: 6 },
    { i: "area-chart", x: 6, y: 0, w: 6, h: 7, minW: 4, minH: 6 },
    { i: "bar-chart", x: 0, y: 7, w: 6, h: 7, minW: 4, minH: 6 },
    { i: "scatter-chart", x: 6, y: 7, w: 6, h: 7, minW: 4, minH: 6 },
    { i: "theme-preview", x: 0, y: 14, w: 12, h: 5, minW: 6, minH: 4 },
  ]);

  const onLayoutChange = (newLayout: Layout[]) => {
    setLayout(newLayout);
  };

  // Chart data and configurations
  const chartItems = [
    {
      key: "line-chart",
      title: "Revenue Trends",
      description: "Monthly revenue, profit, and expenses over time",
      chart: (
        <Chart
          type="line"
          data={lineData}
          series={sampleLineSeries}
          chartTheme={chartTheme}
          title=""
          responsive={true}
          enableAccessibility={true}
          enableLazyLoading={false}
          debug={false}
        />
      ),
    },
    {
      key: "area-chart",
      title: "Website Analytics",
      description: "Page views and unique visitors over time",
      chart: (
        <Chart
          type="area"
          data={areaData}
          series={sampleAreaSeries}
          chartTheme={chartTheme}
          title=""
          responsive={true}
          enableAccessibility={true}
          enableLazyLoading={false}
        />
      ),
    },
    {
      key: "bar-chart",
      title: "Quarterly Sales",
      description: "Sales performance across different quarters",
      chart: (
        <Chart
          type="bar"
          data={barData}
          series={sampleBarSeries}
          chartTheme={chartTheme}
          title=""
          responsive={true}
          enableAccessibility={true}
          enableLazyLoading={false}
        />
      ),
    },
    {
      key: "scatter-chart",
      title: "Data Correlation",
      description: "Scatter plot showing relationship between datasets",
      chart: (
        <Chart
          type="scatter"
          data={scatterData}
          series={sampleScatterSeries}
          chartTheme={chartTheme}
          title=""
          responsive={true}
          enableAccessibility={true}
          enableLazyLoading={false}
        />
      ),
    },
    {
      key: "theme-preview",
      title: `Current Theme: ${chartTheme}`,
      description: "Color palette preview for the selected theme",
      chart: (
        <div className="flex flex-wrap gap-2">
          {PREDEFINED_THEMES[chartTheme].map((color, index) => (
            <div key={index} className="flex flex-col items-center gap-2">
              <div
                className="w-12 h-12 rounded-lg border border-border shadow-sm"
                style={{ backgroundColor: color }}
              />
              <span className="text-xs text-muted-foreground font-mono">
                Color {index + 1}
              </span>
            </div>
          ))}
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Chart Dashboard
              </h1>
              <p className="text-muted-foreground">
                Interactive charts with uPlot React integration
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Button
                  variant={isRealTimeEnabled ? "default" : "outline"}
                  size="sm"
                  onClick={toggleRealTime}
                  className="w-36"
                >
                  {isRealTimeEnabled ? "Pause" : "Start"}
                </Button>
                <span className="text-sm text-muted-foreground">
                  Updates every 2s
                </span>
              </div>

              <Separator orientation="vertical" className="h-6" />

              <div className="flex items-center gap-2">
                <label htmlFor="theme-select" className="text-sm font-medium">
                  Chart Theme:
                </label>
                <Select
                  value={chartTheme}
                  onValueChange={(value: ThemeName) => setChartTheme(value)}
                >
                  <SelectTrigger className="w-40" id="theme-select">
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    {themeOptions.map((theme) => (
                      <SelectItem key={theme} value={theme}>
                        {theme}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Separator orientation="vertical" className="h-6" />
              <ModeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <p className="text-muted-foreground">
            Drag and resize the chart cards below. The layout is automatically
            saved.
          </p>
        </div>

        {/* Grid Layout */}
        <ReactGridLayout
          className="layout"
          layout={layout}
          onLayoutChange={onLayoutChange}
          cols={12}
          rowHeight={60}
          margin={[16, 16]}
          containerPadding={[0, 0]}
          isDraggable={true}
          isResizable={true}
          compactType="vertical"
          preventCollision={false}
          resizeHandles={["se", "sw", "ne", "nw"]}
          style={{
            minHeight: "1200px",
          }}
        >
          {chartItems.map((item) => (
            <div
              key={item.key}
              className="bg-card border rounded-lg shadow-sm overflow-hidden flex flex-col"
              style={{ height: "100%" }}
            >
              <Card className="h-full border-0 shadow-none flex flex-col">
                <CardHeader className="pb-2 flex-shrink-0">
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </CardHeader>
                <CardContent className="flex-1 p-2 min-h-0">
                  <div className="h-full w-full">{item.chart}</div>
                </CardContent>
              </Card>
            </div>
          ))}
        </ReactGridLayout>
      </main>

      {/* Footer */}
      <footer className="border-t bg-card mt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-muted-foreground">
            <p>
              Chart Dashboard powered by{" "}
              <span className="font-semibold">uPlot</span> and{" "}
              <span className="font-semibold">React</span>
            </p>
            <p className="mt-1">
              Features: Draggable layout, lazy loading, responsive design,
              accessibility, theming, and performance optimization
            </p>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        .react-grid-item.cssTransforms {
          transition-property: transform;
          transition-duration: 200ms;
          transition-timing-function: ease;
        }

        .react-grid-item.resizing {
          opacity: 0.6;
          z-index: 3;
        }

        /* Southeast resize handle (bottom-right) */
        .react-grid-item > .react-resizable-handle.react-resizable-handle-se {
          position: absolute;
          width: 20px;
          height: 20px;
          bottom: 0;
          right: 0;
          background: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNiIgaGVpZ2h0PSI2IiB2aWV3Qm94PSIwIDAgNiA2IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8ZG90cyBmaWxsPSIjODg4IiBkPSJNIDYsNiBMIDQsNiBMIDQsNCBMIDYsNCBMIDYsNiBaIE0gNiwyIEwgNCwyIEwgNCwwIEwgNiwwIEwgNiwyIFoiLz4KPHN2Zz4K")
            no-repeat;
          background-origin: content-box;
          box-sizing: border-box;
          cursor: se-resize;
          opacity: 0.6;
        }

        /* Southwest resize handle (bottom-left) */
        .react-grid-item > .react-resizable-handle.react-resizable-handle-sw {
          position: absolute;
          width: 20px;
          height: 20px;
          bottom: 0;
          left: 0;
          background: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNiIgaGVpZ2h0PSI2IiB2aWV3Qm94PSIwIDAgNiA2IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8ZG90cyBmaWxsPSIjODg4IiBkPSJNIDAsNiBMIDIsNiBMIDIsNCBMIDAsNCBMIDAsNiBaIE0gMCwyIEwgMiwyIEwgMiwwIEwgMCwwIEwgMCwyIFoiLz4KPHN2Zz4K")
            no-repeat;
          background-origin: content-box;
          box-sizing: border-box;
          cursor: sw-resize;
          opacity: 0.6;
        }

        /* Northeast resize handle (top-right) */
        .react-grid-item > .react-resizable-handle.react-resizable-handle-ne {
          position: absolute;
          width: 20px;
          height: 20px;
          top: 0;
          right: 0;
          background: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNiIgaGVpZ2h0PSI2IiB2aWV3Qm94PSIwIDAgNiA2IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8ZG90cyBmaWxsPSIjODg4IiBkPSJNIDYsMCBMIDQsMCBMIDQsMiBMIDYsMiBMIDYsMCBaIE0gNiw0IEwgNCw0IEwgNCw2IEwgNiw2IEwgNiw0IFoiLz4KPHN2Zz4K")
            no-repeat;
          background-origin: content-box;
          box-sizing: border-box;
          cursor: ne-resize;
          opacity: 0.6;
        }

        /* Northwest resize handle (top-left) */
        .react-grid-item > .react-resizable-handle.react-resizable-handle-nw {
          position: absolute;
          width: 20px;
          height: 20px;
          top: 0;
          left: 0;
          background: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNiIgaGVpZ2h0PSI2IiB2aWV3Qm94PSIwIDAgNiA2IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8ZG90cyBmaWxsPSIjODg4IiBkPSJNIDAsMCBMIDIsMCBMIDIsMiBMIDAsMiBMIDAsMCBaIE0gMCw0IEwgMiw0IEwgMiw2IEwgMCw2IEwgMCw0IFoiLz4KPHN2Zz4K")
            no-repeat;
          background-origin: content-box;
          box-sizing: border-box;
          cursor: nw-resize;
          opacity: 0.6;
        }

        /* Hover effects for better visibility */
        .react-grid-item:hover > .react-resizable-handle {
          opacity: 0.9;
        }

        .react-grid-placeholder {
          background: rgb(255, 0, 0);
          opacity: 0.2;
          transition-duration: 100ms;
          z-index: 2;
          border-radius: 8px;
          border: 2px dashed #888;
        }

        .layout {
          position: relative;
        }
      `}</style>
    </div>
  );
}
