import React, { useEffect, useRef, useState, useCallback } from "react";
import uPlot from "uplot";
import "uplot/dist/uPlot.min.css";

interface UPlotChartProps {
  data: uPlot.AlignedData;
  options: uPlot.Options;
}

const UPlotChart: React.FC<UPlotChartProps> = ({ data, options }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const plotRef = useRef<uPlot | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const updateDimensions = useCallback(() => {
    if (containerRef.current) {
      const { clientWidth, clientHeight } = containerRef.current;
      if (clientWidth > 0 && clientHeight > 0) {
        setDimensions({ width: clientWidth, height: clientHeight });
      }
    }
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      resizeObserverRef.current = new ResizeObserver(updateDimensions);
      resizeObserverRef.current.observe(containerRef.current);
      updateDimensions();
    }

    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
    };
  }, [updateDimensions]);

  useEffect(() => {
    if (containerRef.current && dimensions.width > 0 && dimensions.height > 0) {
      if (plotRef.current) {
        plotRef.current.destroy();
      }

      const responsiveOptions: uPlot.Options = {
        ...options,
        width: dimensions.width > 0 ? dimensions.width : options.width || 600,
        height:
          dimensions.height > 0
            ? Math.max(dimensions.height - 30, 200)
            : options.height || 300,
        axes: options.axes?.map((axis) => ({
          ...axis,
          stroke: "#6b7280",
          grid: {
            stroke: "#374151",
            width: 1,
            ...axis?.grid,
          },
          ticks: {
            stroke: "#6b7280",
            width: 1,
            ...axis?.ticks,
          },
        })) || [
          {
            stroke: "#6b7280",
            grid: { stroke: "#374151", width: 1 },
            ticks: { stroke: "#6b7280", width: 1 },
          },
          {
            stroke: "#6b7280",
            grid: { stroke: "#374151", width: 1 },
            ticks: { stroke: "#6b7280", width: 1 },
          },
        ],
      };

      plotRef.current = new uPlot(
        responsiveOptions,
        data,
        containerRef.current
      );
    }

    return () => {
      if (plotRef.current) {
        plotRef.current.destroy();
        plotRef.current = null;
      }
    };
  }, [options, dimensions]);

  useEffect(() => {
    if (plotRef.current) {
      plotRef.current.setData(data);
    }
  }, [data]);

  return <div ref={containerRef} className="w-full h-full min-h-0" />;
};

export default UPlotChart;
