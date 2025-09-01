"use client";

import React, { useState } from "react";
import { Chart, PREDEFINED_THEMES, type ThemeName } from "@/components/ui/Chart";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { 
  generateTimeSeriesData, 
  generateBarData, 
  generateScatterData, 
  generateAreaData,
  sampleLineSeries,
  sampleBarSeries,
  sampleScatterSeries,
  sampleAreaSeries
} from "@/lib/sampleData";

export default function Dashboard() {
  const [chartTheme, setChartTheme] = useState<ThemeName>("Default");

  // Generate sample data
  const lineData = generateTimeSeriesData();
  const barData = generateBarData();
  const scatterData = generateScatterData();
  const areaData = generateAreaData();

  const themeOptions = Object.keys(PREDEFINED_THEMES) as ThemeName[];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Chart Dashboard</h1>
              <p className="text-muted-foreground">
                Interactive charts with uPlot React integration
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <label htmlFor="theme-select" className="text-sm font-medium">
                  Chart Theme:
                </label>
                <Select value={chartTheme} onValueChange={(value: ThemeName) => setChartTheme(value)}>
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
              
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-8">
          
          {/* First Row - Line and Area Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trends</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Monthly revenue, profit, and expenses over time
                </p>
              </CardHeader>
              <CardContent>
                <Chart
                  type="line"
                  data={lineData}
                  series={sampleLineSeries}
                  theme={chartTheme}
                  title=""
                  width={600}
                  height={300}
                  responsive={true}
                  enableAccessibility={true}
                  enableLazyLoading={false}
                  debug={false}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Website Analytics</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Page views and unique visitors over time
                </p>
              </CardHeader>
              <CardContent>
                <Chart
                  type="area"
                  data={areaData}
                  series={sampleAreaSeries}
                  theme={chartTheme}
                  title=""
                  width={600}
                  height={300}
                  responsive={true}
                  enableAccessibility={true}
                  enableLazyLoading={false}
                />
              </CardContent>
            </Card>
          </div>

          {/* Second Row - Bar and Scatter Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Quarterly Sales</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Sales performance across different quarters
                </p>
              </CardHeader>
              <CardContent>
                <Chart
                  type="bar"
                  data={barData}
                  series={sampleBarSeries}
                  theme={chartTheme}
                  title=""
                  width={600}
                  height={300}
                  responsive={true}
                  enableAccessibility={true}
                  enableLazyLoading={false}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Data Correlation</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Scatter plot showing relationship between datasets
                </p>
              </CardHeader>
              <CardContent>
                <Chart
                  type="scatter"
                  data={scatterData}
                  series={sampleScatterSeries}
                  theme={chartTheme}
                  title=""
                  width={600}
                  height={300}
                  responsive={true}
                  enableAccessibility={true}
                  enableLazyLoading={false}
                />
              </CardContent>
            </Card>
          </div>

          {/* Third Row - Lazy Loading Demo */}
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Lazy Loading Demo</CardTitle>
                <p className="text-sm text-muted-foreground">
                  This chart demonstrates lazy loading - hover to load the chart
                </p>
              </CardHeader>
              <CardContent>
                <Chart
                  type="line"
                  data={lineData}
                  series={sampleLineSeries}
                  theme={chartTheme}
                  title=""
                  width={800}
                  height={400}
                  responsive={true}
                  enableLazyLoading={true}
                  loadOnHover={true}
                  loadOnVisible={false}
                  preloadDelay={500}
                />
              </CardContent>
            </Card>
          </div>

          {/* Theme Preview */}
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Current Theme: {chartTheme}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Color palette preview for the selected theme
                </p>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {PREDEFINED_THEMES[chartTheme].map((color, index) => (
                    <div
                      key={index}
                      className="flex flex-col items-center gap-2"
                    >
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
              </CardContent>
            </Card>
          </div>
        </div>
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
              Features: Lazy loading, responsive design, accessibility, theming, and performance optimization
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
