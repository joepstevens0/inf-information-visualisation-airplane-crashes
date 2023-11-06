import { Chart as ChartJS } from "chart.js";
import { escapeLeadingUnderscores } from "typescript";
import {
  MAX_CRASH_YEAR,
  MIN_CRASH_YEAR,
} from "../../constants/crash_constants";
import { ScatterPlotData, getPlotDataByCrashID } from "./scatterplot_data";
import { externalTooltipHandler } from "./scatterplot_tooltip";

// adjusts panning after zoom
const ZOOM_ADJUSTMENT = { x: 0, y: 0 };

const MIN_X_VALUE = new Date().setFullYear(MIN_CRASH_YEAR - 1).valueOf();
const MAX_X_VALUE = new Date().setFullYear(MAX_CRASH_YEAR + 1).valueOf();
const YEAR_VALUE =
  new Date().setFullYear(1).valueOf() - new Date().setFullYear(0).valueOf();

function createOptions(
  max_y: number,
  min_x: number,
  max_x: number,
  onclick: (evt: Event) => void
): any {
  return {
    onClick: onclick,
    parsing: {
      xAxisKey: "x",
      yAxisKey: "y",
    },

    scales: {
      y: {
        title: {
          type: "linear",
          display: true,
          text: "Fatalities",
        },
        beginAtZero: true,
        ticks: {
          callback: function (value: number, index: any, ticks: any) {
            return value.toFixed(0);
          },
        },
        min: 0,
        max: max_y,
      },
      x: {
        title: {
          display: true,
          text: "Year",
          type: "time",
          time: {
            displayFormats: {
              quarter: "MMM YYYY",
            },
          },
        },
        ticks: {
          callback: function (value: any, index: any, ticks: any) {
            return new Date(value).getFullYear();
          },
        },
        min: min_x,
        max: max_x,
      },
    },
    plugins: {
      tooltip: {
        enabled: false,
        position: "nearest",
        external: externalTooltipHandler,
      },
      zoom: {
        zoom: {
          wheel: {
            enabled: true,
          },
          pinch: {
            enabled: true,
          },
          mode: "xy" as "xy",
          onZoom: (ctx: { chart: ChartJS }) => {
            // adjust panning after zoom
            ctx.chart.pan(ZOOM_ADJUSTMENT);
          },
        },
        pan: {
          enabled: true,
          mode: "xy" as "xy",
        },
        limits: {
          y: { min: 0, max: max_y },
          x: {
            min: min_x,
            max: max_x,
          },
        },
      },
    },
  };
}

function calcYearAvg(plotData: ScatterPlotData[]): ScatterPlotData[] {
  const values: ScatterPlotData[] = [];
  const totals: number[] = [];
  for (let i = MIN_CRASH_YEAR; i <= MAX_CRASH_YEAR; ++i) {
    const year = new Date();
    year.setFullYear(i);
    values.push({ x: year, y: 0, id: -1 });
    totals.push(0);
  }

  plotData.forEach((val: ScatterPlotData) => {
    const index = val.x.getFullYear() - MIN_CRASH_YEAR;
    if (index < 0 || index >= values.length) return;
    values[index].y += val.y;
    totals[index] += 1;
  });

  totals.forEach((total: number, i: number) => {
    if (total === 0) return;
    values[i].y /= total;
  });
  return values;
}

export default function createConfig(
  plotData: ScatterPlotData[],
  selectedCrashID: number | undefined,
  onclick: (evt: Event) => void
): any {
  // Split data into selected and non-selected data
  let plotDataWithoutSelected = plotData;
  let selectedData = getPlotDataByCrashID(plotData, selectedCrashID);
  if (selectedData !== undefined) {
    plotDataWithoutSelected.splice(plotData.indexOf(selectedData), 1);
  }

  const averages = calcYearAvg(plotData);
  const data = {
    datasets: [
      {
        label: "Selected Plane crash fatality",
        data: [selectedData],
        type: "scatter",
        backgroundColor: "#FF6384",
        pointRadius: 4,
      },
      {
        label: "Plane crash fatality average",
        data: averages,
        type: "line",
        backgroundColor: "#ffffff",
        borderColor: "#9fdd47bc",
        pointRadius: 0,
      },
      {
        label: "Plane crash fatalities",
        data: plotDataWithoutSelected,
        type: "scatter",
        backgroundColor: "#4A98B8",
        pointRadius: 4,
        hoverRadius: 8,
      },
    ],
    labels: ["year", "fatalities"],
  };

  // calc min and max x and y values
  let max_y = 0;
  let min_x = MAX_X_VALUE;
  let max_x = MIN_X_VALUE;
  for (let i = 0; i < plotData.length; ++i) {
    max_y = Math.max(max_y, plotData[i].y);
    min_x = Math.min(min_x, plotData[i].x.valueOf());
    max_x = Math.max(max_x, plotData[i].x.valueOf());
  }

  // apply padding of 1 year on ends if at max or min
  if (min_x <= MIN_X_VALUE + YEAR_VALUE) min_x -= YEAR_VALUE;
  if (max_x >= MAX_X_VALUE - YEAR_VALUE) max_x += YEAR_VALUE;

  // at least a differce of 10 for year axis
  if (max_x - min_x < 10) {
    const center = min_x + (max_x - min_x) / 2;
    min_x = center - 5;
    max_x = center + 5;
  }

  const y_top_padding = max_y * 0.05;

  const config = {
    type: "scatter",
    data: data,
    options: createOptions(max_y + y_top_padding, min_x, max_x, onclick),
  };
  return config;
}
