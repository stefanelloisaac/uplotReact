import uPlot from "uplot";
import { OptionsUpdateState, DataMatchOptions } from "../types";
import { processedDataCache } from "../performance/DataCache";

const stringify = (obj: Record<string, unknown>) =>
  JSON.stringify(obj, (key, value) =>
    typeof value === "function" ? value.toString() : value
  );

export const optionsUpdateState = (
  _lhs: uPlot.Options,
  _rhs: uPlot.Options
): OptionsUpdateState => {
  if (_lhs === _rhs) return "keep";

  const { width: lhsWidth, height: lhsHeight, ...lhs } = _lhs;
  const { width: rhsWidth, height: rhsHeight, ...rhs } = _rhs;

  let state: OptionsUpdateState = "keep";

  if (lhsHeight !== rhsHeight || lhsWidth !== rhsWidth) {
    state = "update";
  }

  if (Object.keys(lhs).length !== Object.keys(rhs).length) {
    return "create";
  }

  for (const k of Object.keys(lhs)) {
    if (stringify((lhs as any)[k]) !== stringify((rhs as any)[k])) {
      state = "create";
      break;
    }
  }

  return state;
};

export const dataMatch = (
  lhs: uPlot.AlignedData,
  rhs: uPlot.AlignedData,
  options: DataMatchOptions = {}
): boolean => {
  // Quick reference equality check first (fastest)
  if (lhs === rhs) return true;

  if (lhs.length !== rhs.length) return false;

  if (!options.skipEmptyCheck) {
    if (lhs.length === 0 && rhs.length === 0) return true;
  }

  const cacheKey = `${lhs.length}_${rhs.length}_${options.strict}`;
  const cached = processedDataCache.get(cacheKey);
  if (cached !== undefined) return cached;

  let isMatch = true;

  for (let seriesIdx = 0; seriesIdx < lhs.length; seriesIdx++) {
    const lhsOneSeries = lhs[seriesIdx];
    const rhsOneSeries = rhs[seriesIdx];

    if (lhsOneSeries.length !== rhsOneSeries.length) {
      isMatch = false;
      break;
    }

    if (options.strict) {
      if (JSON.stringify(lhsOneSeries) !== JSON.stringify(rhsOneSeries)) {
        isMatch = false;
        break;
      }
    } else {
      const lhsArray = lhsOneSeries as number[];
      const rhsArray = rhsOneSeries as number[];

      for (let valueIdx = 0; valueIdx < lhsArray.length; valueIdx++) {
        if (lhsArray[valueIdx] !== rhsArray[valueIdx]) {
          isMatch = false;
          break;
        }
      }

      if (!isMatch) break;
    }
  }

  processedDataCache.set(cacheKey, isMatch);
  return isMatch;
};
