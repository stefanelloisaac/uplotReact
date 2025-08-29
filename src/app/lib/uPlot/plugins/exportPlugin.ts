import uPlot from "uplot";

export interface ExportOptions {
  filename?: string;
  format?: "png" | "svg" | "jpeg";
  quality?: number; // For JPEG (0-1)
  scale?: number; // Resolution multiplier
}

export class ChartExporter {
  private chart: uPlot;

  constructor(chart: uPlot) {
    this.chart = chart;
  }

  async exportPNG(options: ExportOptions = {}): Promise<void> {
    const canvas = await this.getCanvas(options.scale || 2);
    this.downloadCanvas(canvas, options.filename || "chart.png", "image/png");
  }

  async exportJPEG(options: ExportOptions = {}): Promise<void> {
    const canvas = await this.getCanvas(options.scale || 2);
    const quality = options.quality || 0.9;
    this.downloadCanvas(
      canvas,
      options.filename || "chart.jpg",
      "image/jpeg",
      quality
    );
  }

  async exportSVG(options: ExportOptions = {}): Promise<void> {
    const svg = this.getSVG();
    this.downloadText(svg, options.filename || "chart.svg", "image/svg+xml");
  }

  async getDataURL(
    format: "png" | "jpeg" = "png",
    scale: number = 2
  ): Promise<string> {
    const canvas = await this.getCanvas(scale);
    return canvas.toDataURL(`image/${format}`);
  }

  private async getCanvas(scale: number = 2): Promise<HTMLCanvasElement> {
    const chartRoot = this.chart.root;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;

    const rect = chartRoot.getBoundingClientRect();
    canvas.width = rect.width * scale;
    canvas.height = rect.height * scale;

    ctx.scale(scale, scale);

    return new Promise((resolve) => {
      const svgData = this.getSVG();
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0);
        resolve(canvas);
      };
      img.src = "data:image/svg+xml;base64," + btoa(svgData);
    });
  }

  private getSVG(): string {
    const chartRoot = this.chart.root;
    const rect = chartRoot.getBoundingClientRect();

    let svg = `<svg width="${rect.width}" height="${rect.height}" xmlns="http://www.w3.org/2000/svg">`;

    const chartOptions = (this.chart as any).opts;
    if (chartOptions?.title) {
      svg += `<text x="${
        rect.width / 2
      }" y="20" text-anchor="middle" font-size="16" font-weight="bold">${
        chartOptions.title
      }</text>`;
    }

    svg += `<rect x="0" y="0" width="${rect.width}" height="${rect.height}" fill="transparent" stroke="#ccc"/>`;
    svg += `<text x="${rect.width / 2}" y="${
      rect.height / 2
    }" text-anchor="middle" font-size="14">Chart Export</text>`;
    svg += "</svg>";

    return svg;
  }

  private downloadCanvas(
    canvas: HTMLCanvasElement,
    filename: string,
    mimeType: string,
    quality?: number
  ): void {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          this.downloadBlob(blob, filename);
        }
      },
      mimeType,
      quality
    );
  }

  private downloadText(
    content: string,
    filename: string,
    mimeType: string
  ): void {
    const blob = new Blob([content], { type: mimeType });
    this.downloadBlob(blob, filename);
  }

  private downloadBlob(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

export function exportPlugin(options: ExportOptions = {}): uPlot.Plugin {
  let exporter: ChartExporter;

  return {
    hooks: {
      init: (u) => {
        exporter = new ChartExporter(u);

        (u as any).exportPNG = (opts?: ExportOptions) =>
          exporter.exportPNG({ ...options, ...opts });
        (u as any).exportJPEG = (opts?: ExportOptions) =>
          exporter.exportJPEG({ ...options, ...opts });
        (u as any).exportSVG = (opts?: ExportOptions) =>
          exporter.exportSVG({ ...options, ...opts });
        (u as any).getDataURL = (format?: "png" | "jpeg", scale?: number) =>
          exporter.getDataURL(format, scale);
      },
    },
  };
}
