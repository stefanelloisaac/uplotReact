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
import {
  ChartErrorBoundary,
  darkTheme,
  defaultResponsive,
  DynamicChart,
  LoadingFallback,
  EmptyState,
  chartPreloader,
} from "./lib/uPlot";

const ResponsiveGridLayout = WidthProvider(Responsive);

interface ChartItem {
  id: string;
  component: React.ReactNode;
}

const generateRandomValue = (): number => {
  return Math.floor(Math.random() * 30) + 5;
};

const MAX_POINTS = 20;

// Component that deliberately throws an error to test ErrorBoundary
const ErrorChart = () => {
  throw new Error("This is a simulated chart error for testing!");
};

export default function Page() {
  const [timeCounter, setTimeCounter] = useState(5);
  const [showLazyExample, setShowLazyExample] = useState(false);
  const [simulateError, setSimulateError] = useState(false);
  const [showEmpty, setShowEmpty] = useState(false);
  const [preloaderStats, setPreloaderStats] = useState(
    chartPreloader.getStatus()
  );
  const [showCharts, setShowCharts] = useState({
    line: false,
    area: false, 
    scatter: false,
    bar: false
  });
  const [hoverStates, setHoverStates] = useState({
    line: false,
    area: false,
    scatter: false, 
    bar: false
  });
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

  // Handle hover preloading
  const handleHoverPreload = async (chartType: 'line' | 'area' | 'scatter' | 'bar', isHovering: boolean) => {
    setHoverStates(prev => ({ ...prev, [chartType]: isHovering }));
    
    if (isHovering && !preloaderStats[chartType]) {
      console.log(`🎯 Hover detected on ${chartType} chart - starting preload...`);
      await chartPreloader.preloadType(chartType);
      const newStats = chartPreloader.getStatus();
      setPreloaderStats(newStats);
      console.log(`✅ ${chartType} chart preloaded via hover`);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const newTime = timeCounter;

      setLineData((prevData) => {
        const newX = [...prevData[0], newTime];
        const newY = [...prevData[1], generateRandomValue()];

        const trimmedX = newX.slice(-MAX_POINTS);
        const trimmedY = newY.slice(-MAX_POINTS);

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
          <Card title="📈 Line Chart Showcase">
            <div 
              onMouseEnter={() => handleHoverPreload('line', true)}
              onMouseLeave={() => handleHoverPreload('line', false)}
              className={`h-full transition-all duration-200 ${hoverStates.line ? 'ring-2 ring-blue-400 ring-opacity-50' : ''}`}
            >
              {showCharts.line ? (
                <ChartErrorBoundary>
                  <LineChart
                    data={lineData}
                    responsive={defaultResponsive}
                    theme={{ gridColor: "#374151", axisColor: "#9CA3AF" }}
                  />
                </ChartErrorBoundary>
              ) : (
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="text-6xl mb-4">📈</div>
                  <button
                    onClick={() => setShowCharts(prev => ({ ...prev, line: true }))}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 react-grid-no-touch"
                    onMouseDown={(e) => e.stopPropagation()}
                    onTouchStart={(e) => e.stopPropagation()}
                  >
                    Load Line Chart
                  </button>
                  <div className="mt-2 text-xs text-gray-500">
                    {hoverStates.line ? '🎯 Preloading...' : 'Hover to preload'}
                  </div>
                </div>
              )}
            </div>
          </Card>
        ),
      },
      {
        id: "scatter",
        component: (
          <Card title="🔵 Scatter Chart Showcase">
            <div 
              onMouseEnter={() => handleHoverPreload('scatter', true)}
              onMouseLeave={() => handleHoverPreload('scatter', false)}
              className={`h-full transition-all duration-200 ${hoverStates.scatter ? 'ring-2 ring-purple-400 ring-opacity-50' : ''}`}
            >
              {showCharts.scatter ? (
                <ChartErrorBoundary>
                  <ScatterChart
                    data={scatterData}
                    responsive={defaultResponsive}
                    theme={{ gridColor: "#374151", axisColor: "#9CA3AF" }}
                  />
                </ChartErrorBoundary>
              ) : (
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="text-6xl mb-4">🔵</div>
                  <button
                    onClick={() => setShowCharts(prev => ({ ...prev, scatter: true }))}
                    className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 react-grid-no-touch"
                    onMouseDown={(e) => e.stopPropagation()}
                    onTouchStart={(e) => e.stopPropagation()}
                  >
                    Load Scatter Chart
                  </button>
                  <div className="mt-2 text-xs text-gray-500">
                    {hoverStates.scatter ? '🎯 Preloading...' : 'Hover to preload'}
                  </div>
                </div>
              )}
            </div>
          </Card>
        ),
      },
      {
        id: "area",
        component: (
          <Card title="🔺 Area Chart Showcase">
            <div 
              onMouseEnter={() => handleHoverPreload('area', true)}
              onMouseLeave={() => handleHoverPreload('area', false)}
              className={`h-full transition-all duration-200 ${hoverStates.area ? 'ring-2 ring-green-400 ring-opacity-50' : ''}`}
            >
              {showCharts.area ? (
                <ChartErrorBoundary>
                  <AreaChart
                    data={areaData}
                    responsive={defaultResponsive}
                    theme={{ gridColor: "#374151", axisColor: "#9CA3AF" }}
                  />
                </ChartErrorBoundary>
              ) : (
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="text-6xl mb-4">🔺</div>
                  <button
                    onClick={() => setShowCharts(prev => ({ ...prev, area: true }))}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 react-grid-no-touch"
                    onMouseDown={(e) => e.stopPropagation()}
                    onTouchStart={(e) => e.stopPropagation()}
                  >
                    Load Area Chart
                  </button>
                  <div className="mt-2 text-xs text-gray-500">
                    {hoverStates.area ? '🎯 Preloading...' : 'Hover to preload'}
                  </div>
                </div>
              )}
            </div>
          </Card>
        ),
      },
      {
        id: "bar",
        component: (
          <Card title="📊 Bar Chart Showcase">
            <div 
              onMouseEnter={() => handleHoverPreload('bar', true)}
              onMouseLeave={() => handleHoverPreload('bar', false)}
              className={`h-full transition-all duration-200 ${hoverStates.bar ? 'ring-2 ring-orange-400 ring-opacity-50' : ''}`}
            >
              {showCharts.bar ? (
                <ChartErrorBoundary>
                  <BarChart
                    data={barData}
                    responsive={defaultResponsive}
                    theme={{ gridColor: "#374151", axisColor: "#9CA3AF" }}
                  />
                </ChartErrorBoundary>
              ) : (
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="text-6xl mb-4">📊</div>
                  <button
                    onClick={() => setShowCharts(prev => ({ ...prev, bar: true }))}
                    className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 react-grid-no-touch"
                    onMouseDown={(e) => e.stopPropagation()}
                    onTouchStart={(e) => e.stopPropagation()}
                  >
                    Load Bar Chart
                  </button>
                  <div className="mt-2 text-xs text-gray-500">
                    {hoverStates.bar ? '🎯 Preloading...' : 'Hover to preload'}
                  </div>
                </div>
              )}
            </div>
          </Card>
        ),
      },
    ],
    [lineData, areaData, scatterData, barData, showCharts, hoverStates]
  );

  // Test charts for demonstrating features
  const testCharts = useMemo<ChartItem[]>(
    () => [
      {
        id: "lazy-test",
        component: (
          <Card title="🔄 Lazy Loading Test">
            {showLazyExample ? (
              <DynamicChart
                type="line"
                data={lineData}
                options={{
                  width: 600,
                  height: 300,
                  series: [
                    {},
                    { label: "Lazy Chart", stroke: "blue", width: 2 },
                  ],
                }}
                theme={{ gridColor: "#374151", axisColor: "#9CA3AF" }}
                responsive={defaultResponsive}
                fallback={<LoadingFallback message="Lazy loading chart..." />}
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <button
                  onClick={() => {
                    setShowLazyExample(true);
                    // Update stats after a short delay to show the loading effect
                    setTimeout(() => {
                      setPreloaderStats(chartPreloader.getStatus());
                    }, 100);
                  }}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 react-grid-no-touch"
                  onMouseDown={(e) => e.stopPropagation()}
                  onTouchStart={(e) => e.stopPropagation()}
                >
                  Load Lazy Chart
                </button>
              </div>
            )}
          </Card>
        ),
      },
      {
        id: "error-test",
        component: (
          <Card title="❌ Error Boundary Test">
            <ChartErrorBoundary>
              {simulateError ? (
                <ErrorChart />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <button
                    onClick={() => setSimulateError(true)}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 react-grid-no-touch"
                    onMouseDown={(e) => e.stopPropagation()}
                    onTouchStart={(e) => e.stopPropagation()}
                  >
                    Simulate Error
                  </button>
                </div>
              )}
            </ChartErrorBoundary>
          </Card>
        ),
      },
      {
        id: "empty-test",
        component: (
          <Card title="📊 Empty State Test">
            {showEmpty ? (
              <EmptyState message="No chart data available" />
            ) : (
              <div className="flex items-center justify-center h-full">
                <button
                  onClick={() => setShowEmpty(true)}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 react-grid-no-touch"
                  onMouseDown={(e) => e.stopPropagation()}
                  onTouchStart={(e) => e.stopPropagation()}
                >
                  Show Empty State
                </button>
              </div>
            )}
          </Card>
        ),
      },
    ],
    [showLazyExample, simulateError, showEmpty, lineData]
  );

  const allCharts = [...charts, ...testCharts];

  const layout: Layout[] = allCharts.map((chart, index) => ({
    i: chart.id,
    x: (index % 3) * 4,
    y: Math.floor(index / 3) * 6,
    w: 4,
    h: 6,
  }));

  return (
    <main className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">
          Dashboard Responsivo com uPlot
        </h1>

        {/* Debug Controls */}
        <div className="bg-gray-800 text-white p-4 rounded-lg mb-4">
          <h2 className="text-lg font-semibold mb-3 text-gray-100">
            🔧 Debug Controls
          </h2>

          {/* Preloader Status Display */}
          <div className="mb-4 p-3 bg-gray-700 rounded">
            <h3 className="text-sm font-medium mb-2 text-gray-200">
              Preloader Status:
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
              {Object.entries(preloaderStats).map(([chartType, loaded]) => {
                const isHovering = hoverStates[chartType as keyof typeof hoverStates];
                const isVisible = showCharts[chartType as keyof typeof showCharts];
                return (
                  <div
                    key={chartType}
                    className={`px-2 py-1 rounded transition-all duration-200 ${
                      loaded 
                        ? "bg-green-600" 
                        : isHovering 
                          ? "bg-yellow-600" 
                          : "bg-red-600"
                    } ${isHovering ? 'ring-2 ring-white ring-opacity-50' : ''}`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{chartType}: {loaded ? "✅" : isHovering ? "🎯" : "❌"}</span>
                      {isVisible && <span className="text-blue-200">👁️</span>}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-2 text-xs text-gray-300 space-y-1">
              <div>Loaded Size: {chartPreloader.getLoadedSize()}KB</div>
              <div className="flex gap-4">
                <span>❌ Not loaded</span>
                <span>🎯 Preloading</span>
                <span>✅ Ready</span>
                <span>👁️ Visible</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={async () => {
                const status = chartPreloader.getStatus();
                const loadedSize = chartPreloader.getLoadedSize();
                setPreloaderStats(status);
                console.group("📊 Chart Preloader Status");
                console.log("Status:", status);
                console.log("Loaded Bundle Size:", loadedSize + "KB");
                console.log("Available Charts:", Object.keys(status));
                console.log(
                  "Loaded Charts:",
                  Object.entries(status)
                    .filter(([_, loaded]) => loaded)
                    .map(([name]) => name)
                );
                console.groupEnd();
              }}
              className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
            >
              Log Preloader Status
            </button>
            <button
              onClick={async () => {
                console.log("🔄 Preloading all chart types...");
                const startTime = performance.now();
                await chartPreloader.preloadAll();
                const endTime = performance.now();
                const newStatus = chartPreloader.getStatus();
                setPreloaderStats(newStatus);
                console.log(
                  `✅ All charts preloaded in ${(endTime - startTime).toFixed(
                    2
                  )}ms`
                );
                console.log("📊 New status:", newStatus);
                console.log(
                  "📊 Total loaded size:",
                  chartPreloader.getLoadedSize() + "KB"
                );
              }}
              className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
            >
              Preload All Charts
            </button>
            <button
              onClick={async () => {
                console.log("🔄 Testing individual chart preloading...");
                await chartPreloader.preloadType("scatter");
                const newStatus = chartPreloader.getStatus();
                setPreloaderStats(newStatus);
                console.log(
                  "📊 Scatter chart preloaded, new status:",
                  newStatus
                );
              }}
              className="px-3 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700"
            >
              Test Preload Scatter
            </button>
            <button
              onClick={() => {
                setShowCharts({ line: true, area: true, scatter: true, bar: true });
                console.log('📊 All showcase charts loaded');
              }}
              className="px-3 py-1 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700"
            >
              Load All Showcases
            </button>
            <button
              onClick={() => {
                setShowLazyExample(false);
                setSimulateError(false);
                setShowEmpty(false);
                setShowCharts({ line: false, area: false, scatter: false, bar: false });
                setHoverStates({ line: false, area: false, scatter: false, bar: false });
                setPreloaderStats(chartPreloader.getStatus());
              }}
              className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700"
            >
              Reset All States
            </button>
          </div>
        </div>
      </div>

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
        {allCharts.map((chart) => (
          <div key={chart.id} className="h-full">
            {chart.component}
          </div>
        ))}
      </ResponsiveGridLayout>
    </main>
  );
}
