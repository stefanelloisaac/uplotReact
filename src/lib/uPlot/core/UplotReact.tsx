import React, { JSX, useEffect, useRef, useState } from "react";
import uPlot from "uplot";
import { UplotReactProps } from "../types";
import { dataMatch, optionsUpdateState } from "../utils";

export default function UplotReact({
  options,
  data,
  target,
  onDelete = () => {},
  onCreate = () => {},
}: UplotReactProps): JSX.Element | null {
  const chartRef = useRef<uPlot | null>(null);
  const targetRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<Error | null>(null);
  const mountedRef = useRef(true);

  function destroy(chart: uPlot | null) {
    if (chart) {
      onDelete(chart);
      chart.destroy();
      chartRef.current = null;
    }
  }

  function create() {
    if (!mountedRef.current) return;

    try {
      setError(null);
      const newChart = new uPlot(
        options,
        data,
        target || (targetRef.current as HTMLDivElement)
      );

      if (mountedRef.current) {
        chartRef.current = newChart;
        onCreate(newChart);
      } else {
        newChart.destroy();
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      console.error("Failed to create uPlot chart:", error);
      setError(error);
    }
  }

  useEffect(() => {
    mountedRef.current = true;
    create();
    return () => {
      mountedRef.current = false;
      destroy(chartRef.current);
    };
  }, []);
  const prevProps = useRef({ options, data, target }).current;
  useEffect(() => {
    const chart = chartRef.current;

    if (prevProps.options !== options) {
      const optionsState = optionsUpdateState(prevProps.options, options);
      if (!chart || optionsState === "create") {
        destroy(chart);
        create();
      } else if (optionsState === "update") {
        chart.setSize({ width: options.width, height: options.height });
      }
    }

    if (prevProps.data !== data) {
      if (!chart) {
        create();
      } else if (!dataMatch(prevProps.data, data)) {
        chart.setData(data);
      }
    }

    if (prevProps.target !== target) {
      destroy(chart);
      create();
    }

    return () => {
      prevProps.options = options;
      prevProps.data = data;
      prevProps.target = target;
    };
  }, [options, data, target]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-full bg-red-50 border border-red-200 rounded">
        <div className="text-center p-2">
          <div className="text-red-600 text-sm">Chart Error</div>
          <div className="text-red-500 text-xs">{error.message}</div>
        </div>
      </div>
    );
  }

  return target ? null : <div ref={targetRef}></div>;
}
