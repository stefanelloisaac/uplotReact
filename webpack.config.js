// Webpack configuration for optimized bundling
const path = require('path');

module.exports = {
  // Enable tree shaking
  mode: 'production',
  
  // Optimization settings
  optimization: {
    usedExports: true,
    sideEffects: false,
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        // Separate chunk for uPlot core
        uplot: {
          test: /[\\/]node_modules[\\/]uplot[\\/]/,
          name: 'uplot',
          chunks: 'all',
        },
        // Separate chunk for chart components
        charts: {
          test: /[\\/]src[\\/]app[\\/]components[\\/]/,
          name: 'charts',
          chunks: 'all',
        },
        // Separate chunk for chart library
        chartLib: {
          test: /[\\/]src[\\/]app[\\/]lib[\\/]uPlot[\\/]/,
          name: 'chart-lib',
          chunks: 'all',
        },
      },
    },
  },

  // Bundle analysis
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@lib': path.resolve(__dirname, 'src/app/lib'),
      '@components': path.resolve(__dirname, 'src/app/components'),
    },
  },

  // Module rules for tree shaking
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              // Enable tree shaking for TypeScript
              compilerOptions: {
                module: 'esnext',
                moduleResolution: 'node',
              },
            },
          },
        ],
      },
    ],
  },
};