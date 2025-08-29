# uPlot React Dashboard

A real-time dashboard built with Next.js, React, and uPlot featuring responsive charts with live data streaming.

## Features

- **Real-time Data**: Charts update every second with new data points
- **Responsive Design**: Drag and resize charts within a grid layout
- **Multiple Chart Types**: Line, Area (smooth curves), Scatter (with trend line), and Multi-Bar charts
- **Professional Styling**: Card-based layout with gray grid styling
- **Optimized Performance**: Uses uPlot's efficient setData() for smooth real-time updates

## Charts

- **Line Chart**: Basic time series visualization
- **Area Chart**: Smooth spline curves with filled area
- **Scatter Plot**: Points with linear regression trend line
- **Bar Chart**: Grouped bars with 4 series per group

## Tech Stack

- Next.js 15 with App Router
- React 19
- TypeScript
- uPlot for high-performance charting
- Tailwind CSS for styling
- React Grid Layout for drag/resize functionality

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

## Deployment

The project is configured for easy deployment to Vercel, Netlify, or any static hosting provider.

```bash
npm run build
```
