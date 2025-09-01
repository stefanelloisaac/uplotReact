import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import uPlot from "uplot";
import "uplot/dist/uPlot.min.css";
import UplotReact from "../core/UplotReact";
import { StyledChartProps, ChartTheme } from "../types";
import { defaultResponsive } from "../config/defaults";
import { defaultTheme } from "../config/themes";
import { ChartErrorBoundary } from "../components/ErrorBoundary";
import { LoadingFallback, EmptyState } from "../components/LoadingFallback";

const StyledChart: React.FC<StyledChartProps> = ({
  data,
  options,
  theme = {},
  responsive = {},
  className = "w-full h-full min-h-0",
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<uPlot | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const mergedTheme: ChartTheme = useMemo(
    () => ({
      ...defaultTheme,
      ...theme,
    }),
    [theme]
  );

  const responsiveConfig = useMemo(
    () => ({
      ...defaultResponsive,
      ...responsive,
    }),
    [responsive]
  );

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

  const responsiveOptions: uPlot.Options = useMemo(() => {
    const finalWidth =
      dimensions.width > 0 ? dimensions.width : options.width || 600;
    const finalHeight =
      dimensions.height > 0
        ? Math.max(
            dimensions.height - responsiveConfig.legendSpace!,
            responsiveConfig.minHeight!
          )
        : options.height || 300;

    return {
      ...options,
      width: Math.max(finalWidth, responsiveConfig.minWidth!),
      height: finalHeight,
    };
  }, [options, dimensions, mergedTheme, responsiveConfig]);

  const handleCreate = useCallback((chart: uPlot) => {
    chartRef.current = chart;
  }, []);

  const handleDelete = useCallback((chart: uPlot) => {
    chartRef.current = null;
  }, []);

  const containerStyle = useMemo(
    () => ({
      backgroundColor: mergedTheme.backgroundColor,
    }),
    [mergedTheme.backgroundColor]
  );
  const hasData = data && data.length > 0 && data[0] && data[0].length > 0;

  return (
    <div ref={containerRef} className={className} style={containerStyle}>
      <ChartErrorBoundary>
        {!hasData ? (
          <EmptyState message="No data to display" className="h-full" />
        ) : dimensions.width === 0 || dimensions.height === 0 ? (
          <LoadingFallback message="Preparing chart..." className="h-full" />
        ) : containerRef.current ? (
          <UplotReact
            options={responsiveOptions}
            data={data}
            target={containerRef.current}
            onCreate={handleCreate}
            onDelete={handleDelete}
          />
        ) : (
          <LoadingFallback message="Initializing..." className="h-full" />
        )}
      </ChartErrorBoundary>
    </div>
  );
};

export default StyledChart;
