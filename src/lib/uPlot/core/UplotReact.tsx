import React, {
  JSX,
  useCallback,
  useEffect,
  useRef,
  useState,
  useTransition,
  useMemo,
  useLayoutEffect,
  useDeferredValue,
} from "react";
import uPlot from "uplot";
import { UplotReactProps } from "../types";
import { dataMatch, optionsUpdateState } from "../utils";

function UplotReact({
  options,
  data,
  target,
  onDelete = () => {},
  onCreate = () => {},
}: UplotReactProps): JSX.Element | null {
  const chartRef = useRef<uPlot | null>(null);
  const targetRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isPending, startTransition] = useTransition();
  const mountedRef = useRef(true);

  const destroy = useCallback(
    (chart: uPlot | null) => {
      if (chart) {
        onDelete(chart);
        chart.destroy();
        chartRef.current = null;
      }
    },
    [onDelete]
  );

  const create = useCallback(() => {
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
  }, [options, data, target, onCreate]);

  // Use layoutEffect for initial chart creation to prevent visual flicker
  useLayoutEffect(() => {
    mountedRef.current = true;
    create();
    return () => {
      mountedRef.current = false;
      destroy(chartRef.current);
    };
  }, [create, destroy]);

  const prevProps = useRef({ options, data, target }).current;

  // Defer data processing during rapid updates
  const deferredData = useDeferredValue(data);
  const deferredOptions = useDeferredValue(options);

  // Memoize expensive options comparison with deferred values
  const currentOptionsState = useMemo(() => {
    if (prevProps.options === deferredOptions) return "keep";
    return optionsUpdateState(prevProps.options, deferredOptions);
  }, [prevProps.options, deferredOptions]);

  // Memoize data comparison with deferred values for smoother updates
  const shouldUpdateData = useMemo(() => {
    if (prevProps.data === data) return false;
    return !dataMatch(prevProps.data, deferredData);
  }, [prevProps.data, data, deferredData]);

  useEffect(() => {
    const chart = chartRef.current;

    // Use transition for non-critical updates to prevent blocking
    if (prevProps.options !== deferredOptions) {
      if (!chart || currentOptionsState === "create") {
        // Critical: Create/destroy operations should not be deferred
        destroy(chart);
        create();
      } else if (currentOptionsState === "update") {
        // Non-critical: Size updates can be transitioned
        startTransition(() => {
          chart.setSize({
            width: deferredOptions.width,
            height: deferredOptions.height,
          });
        });
      }
    }

    if (prevProps.data !== data) {
      if (!chart) {
        create();
      } else if (shouldUpdateData) {
        // Non-critical: Data updates can be transitioned for smoother UX
        startTransition(() => {
          chart.setData(data);
        });
      }
    }

    if (prevProps.target !== target) {
      // Critical: Target changes require immediate recreation
      destroy(chart);
      create();
    }

    prevProps.options = deferredOptions;
    prevProps.data = data;
    prevProps.target = target;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    deferredOptions,
    data,
    target,
    create,
    destroy,
    startTransition,
    currentOptionsState,
    shouldUpdateData,
  ]);

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

  return target ? null : (
    <div
      ref={targetRef}
      className={`w-full h-full transition-opacity duration-200 ${
        isPending ? "opacity-80" : "opacity-100"
      }`}
    ></div>
  );
}

// Memoize component to prevent unnecessary re-renders when props haven't changed
export default React.memo(UplotReact, (prevProps, nextProps) => {
  // Custom comparison function for better performance
  return (
    prevProps.options === nextProps.options &&
    prevProps.data === nextProps.data &&
    prevProps.target === nextProps.target &&
    prevProps.onCreate === nextProps.onCreate &&
    prevProps.onDelete === nextProps.onDelete
  );
});
