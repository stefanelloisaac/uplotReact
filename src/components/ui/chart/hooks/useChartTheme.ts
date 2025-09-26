import { useState, useRef, useLayoutEffect, useTransition, useMemo, useDeferredValue } from "react";
import { useTheme } from "next-themes";
import { getComputedChartColors } from "../themes";
import type { ThemeColors } from "../types";

export interface UseChartThemeReturn {
  stableTheme: string | undefined;
  isThemeLoading: boolean;
  isPending: boolean;
  chartColors: ThemeColors;
  deferredStableTheme: string | undefined;
}

export const useChartTheme = (): UseChartThemeReturn => {
  const { resolvedTheme } = useTheme();
  const [stableTheme, setStableTheme] = useState(resolvedTheme);
  const [isThemeLoading, setIsThemeLoading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const themeTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Use transition for smooth theme changes
  useLayoutEffect(() => {
    if (stableTheme !== resolvedTheme) {
      // Clear any existing timer to debounce rapid theme changes
      if (themeTimerRef.current) {
        clearTimeout(themeTimerRef.current);
      }

      setIsThemeLoading(true);

      // Use transition to make theme updates non-blocking
      startTransition(() => {
        themeTimerRef.current = setTimeout(() => {
          setStableTheme(resolvedTheme);

          // Shorter delay for theme loading indicator
          setTimeout(() => {
            setIsThemeLoading(false);
          }, 100);
        }, 30);
      });
    }

    return () => {
      if (themeTimerRef.current) {
        clearTimeout(themeTimerRef.current);
      }
    };
  }, [resolvedTheme, stableTheme, startTransition]);

  const chartColors = useMemo(() => {
    return getComputedChartColors(stableTheme === "dark");
  }, [stableTheme]);

  const deferredStableTheme = useDeferredValue(stableTheme);

  return {
    stableTheme,
    isThemeLoading,
    isPending,
    chartColors,
    deferredStableTheme,
  };
};
