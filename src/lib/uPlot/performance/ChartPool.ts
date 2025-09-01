import uPlot from "uplot";

interface PooledChart {
  chart: uPlot;
  lastUsed: number;
  inUse: boolean;
}

class ChartPool {
  private pool: PooledChart[] = [];
  private maxPoolSize = 5;
  private maxIdleTime = 30000; // 30 seconds

  getChart(
    options: uPlot.Options,
    data: uPlot.AlignedData,
    target: HTMLElement
  ): uPlot {
    this.cleanup();

    const available = this.pool.find((item) => !item.inUse);

    if (available) {
      available.inUse = true;
      available.lastUsed = Date.now();

      try {
        available.chart.setSize({
          width: options.width,
          height: options.height,
        });
        available.chart.setData(data);
        return available.chart;
      } catch (error) {
        this.removeFromPool(available);
      }
    }

    const newChart = new uPlot(options, data, target);

    if (this.pool.length < this.maxPoolSize) {
      this.pool.push({
        chart: newChart,
        lastUsed: Date.now(),
        inUse: true,
      });
    }

    return newChart;
  }

  releaseChart(chart: uPlot) {
    const poolItem = this.pool.find((item) => item.chart === chart);
    if (poolItem) {
      poolItem.inUse = false;
      poolItem.lastUsed = Date.now();
    }
  }

  private removeFromPool(poolItem: PooledChart) {
    const index = this.pool.indexOf(poolItem);
    if (index > -1) {
      poolItem.chart.destroy();
      this.pool.splice(index, 1);
    }
  }

  private cleanup() {
    const now = Date.now();
    const toRemove = this.pool.filter(
      (item) => !item.inUse && now - item.lastUsed > this.maxIdleTime
    );

    toRemove.forEach((item) => this.removeFromPool(item));
  }

  destroy() {
    this.pool.forEach((item) => item.chart.destroy());
    this.pool = [];
  }
}

export const chartPool = new ChartPool();
