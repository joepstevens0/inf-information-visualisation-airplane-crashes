import {
  MAX_CRASH_FILE_YEAR,
  MIN_CRASH_FILE_YEAR,
} from "../constants/crash_constants";
import PlaneCrash from "../types/planecrash";

export default async function fetchData(): Promise<PlaneCrash[]> {
  let result: PlaneCrash[] = [];
  for (let i = MIN_CRASH_FILE_YEAR; i <= MAX_CRASH_FILE_YEAR; ++i) {
    const yearData = await fetch_year(i);
    result = result.concat(yearData);
  }
  return result;
}

async function fetch_year(year: number): Promise<PlaneCrash[]> {
  const yearData = await import("../data/" + year + "_data.json").then(
    (module) => module.default
  );
  const result: PlaneCrash[] = [];
  for (let i = 0; i < yearData.length; ++i) {
    result.push(format_planecrash(yearData[i]));
  }
  return result;
}

function format_planecrash(crashData: any): PlaneCrash {
  let time: Date | undefined = undefined;
  if (crashData["time"] !== "?") {
    if (time === undefined) time = new Date();
    const hours = Number((crashData["time"] as string).slice(0, 2));
    const min = Number((crashData["time"] as string).slice(2, 4));
    time.setHours(hours);
    time.setMinutes(min);
  }
  if (crashData["date"] !== "?") {
    if (time === undefined) time = new Date();
    const month = month_to_number((crashData["date"] as string).split(" ")[0]);
    const day = Number(
      (crashData["date"] as string).split(" ")[1].split(",")[0]
    );
    const year = Number((crashData["date"] as string).split(",")[1]);
    time.setMonth(month - 1);
    time.setDate(day);
    time.setFullYear(year);
  }
  if (crashData["coordinates"] !== "?") {
    crashData["coordinates"] = crashData["coordinates"].map(Number);
  }
  if (crashData["near_coordinates"] !== "?") {
    crashData["near_coordinates"] = crashData["near_coordinates"].map(Number);
  }

  const result: PlaneCrash = {
    id: Number(crashData["id"]),
    aboard: {
      crew: Number(crashData["aboard_crew"]),
      passengers: Number(crashData["aboard_passengers"]),
    },
    actype: crashData.actype,
    cn_ln: crashData["cn/ln"],
    time: time,
    fatalities: {
      crew: Number(crashData["fatalities_crew"]),
      passengers: Number(crashData["fatalities_passengers"]),
      ground: Number(crashData["ground"]),
    },
    flight_number: crashData["flight#"],
    location: crashData["location"],
    operator: crashData["operator"],
    registration: crashData["registration"],
    route: crashData["route"],
    summary: crashData["summary"],
    coordinates: crashData["coordinates"],
    near_coordinates: crashData["near_coordinates"],
  };

  return result;
}

function month_to_number(monthName: string): number {
  switch (monthName) {
    case "January":
      return 1;
    case "February":
      return 2;
    case "March":
      return 3;
    case "April":
      return 4;
    case "May":
      return 5;
    case "June":
      return 6;
    case "July":
      return 7;
    case "August":
      return 8;
    case "September":
      return 9;
    case "October":
      return 10;
    case "November":
      return 11;
    case "December":
      return 12;
  }
  throw new Error("Unable to parse month: " + monthName + "\n");
}
