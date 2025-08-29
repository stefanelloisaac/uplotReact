import { ChartTheme } from "../types";

export const defaultTheme: ChartTheme = {
  gridColor: "#374151",
  axisColor: "#6b7280",
  backgroundColor: "inherit",
};

export const darkTheme: ChartTheme = {
  gridColor: "#374151",
  axisColor: "#9ca3af",
  backgroundColor: "inherit",
};

export const lightTheme: ChartTheme = {
  gridColor: "#374151",
  axisColor: "#9ca3af",
  backgroundColor: "inherit",
};

export const themes = {
  default: defaultTheme,
  dark: darkTheme,
  light: lightTheme,
} as const;

export type ThemeName = keyof typeof themes;
