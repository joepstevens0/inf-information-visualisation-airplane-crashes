import PlaneCrash, { getTotalFatalities } from "../../types/planecrash";

export type ScatterPlotData = {
  x: Date;
  y: number;
  id: number;
};

// create an array of x and y values from the planecrash data
export function createPlotData(crashdata: PlaneCrash[]): ScatterPlotData[] {
  const plotdata: ScatterPlotData[] = [];

  for (let i = 0; i < crashdata.length; ++i) {
    let crash = crashdata[i];

    // skip undefined times
    if (crash.time === undefined) continue;

    // get total fatalities for the crash
    const total_fatalities: number = getTotalFatalities(crash);

    // skip undefined fatalities
    if (isNaN(total_fatalities)) continue;

    plotdata.push({
      x: crash.time,
      y: total_fatalities,
      id: crash.id,
    });
  }

  return plotdata;
}

export function getPlotDataByCrashID(
  plotdata: ScatterPlotData[],
  id: number | undefined
): ScatterPlotData | undefined {
  for (let i = 0; i < plotdata.length; ++i) {
    if (plotdata[i].id === id) {
      return plotdata[i];
    }
  }
  return undefined;
}
