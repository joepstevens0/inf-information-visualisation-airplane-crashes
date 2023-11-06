type PlaneCrash = {
  id: number;
  aboard: { crew: number; passengers: number };
  actype: string;
  cn_ln: string;
  time: Date | undefined;
  fatalities: { crew: number; passengers: number; ground: number };
  flight_number: string;
  location: string;
  operator: string;
  registration: string;
  route: string;
  summary: string;
  coordinates: number[] | string;
  near_coordinates: number[] | string;
};

export function getTotalFatalities(crash: PlaneCrash): number {
  const crew_fatals = isNaN(crash.fatalities.crew) ? 0 : crash.fatalities.crew;
  const passenger_fatals = isNaN(crash.fatalities.passengers)
    ? 0
    : crash.fatalities.passengers;
  const ground_fatals = isNaN(crash.fatalities.ground)
    ? 0
    : crash.fatalities.ground;

  return crew_fatals + passenger_fatals + ground_fatals;
}

export function getTotalAboardFatalities(crash: PlaneCrash): number {
  const crew_fatals = isNaN(crash.fatalities.crew) ? 0 : crash.fatalities.crew;
  const passenger_fatals = isNaN(crash.fatalities.passengers)
    ? 0
    : crash.fatalities.passengers;

  return crew_fatals + passenger_fatals;
}

export function getTotalAboard(crash: PlaneCrash): number {
  const crew = isNaN(crash.aboard.crew) ? 0 : crash.aboard.crew;
  const passenger = isNaN(crash.aboard.passengers)
    ? 0
    : crash.aboard.passengers;

  return crew + passenger;
}

export default PlaneCrash;
