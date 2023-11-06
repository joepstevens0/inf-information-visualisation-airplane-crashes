import { useEffect, useState } from "react";
import PlaneCrash from "../../types/planecrash";
// @ts-ignore
import { ResponsiveFunnel } from "@nivo/funnel";
import { cp } from "fs";
import {
  Wrapper,
  FunnelWrapper,
  FunnelTitle,
  EmptyWrapper,
} from "./funnel.styles";

type FunnelData = {
  id: string;
  value: number;
  label: string;
};

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default function Funnel(props: { crashdata: PlaneCrash | undefined }) {
  const [funnelDataCrew, setFunnelDataCrew] = useState<FunnelData[]>();
  const [funnelDataPassenger, setFunnelDataPassenger] =
    useState<FunnelData[]>();

  // update funnel when new crashdata
  useEffect(() => {
    if (props.crashdata !== undefined) {
      // reset for animation (set all to 0)
      // setFunnelDataCrew(resetCrewFunnelData());
      setFunnelDataPassenger(resetPassengerFunnelData());

      // delay for half second and
      // update data of funnel
      setTimeout(() => {
        updateData(props.crashdata);
      }, 300);
    }
  }, [props.crashdata]);

  const updateData = (crashdata: PlaneCrash | undefined) => {
    setFunnelDataCrew(getCrewFunnelData(crashdata));
    setFunnelDataPassenger(getPassengerFunnelData(crashdata));
  };

  const resetCrewFunnelData = (): FunnelData[] => {
    const funnelDataCrew = [
      {
        id: "step_aboard",
        value: 10,
        label: "Aboard",
      },
      {
        id: "step_survived",
        value: 0,
        label: "Survived",
      },
    ];
    return funnelDataCrew;
  };

  const resetPassengerFunnelData = (): FunnelData[] => {
    const funnelDataPassenger = [
      {
        id: "step_aboard",
        value: 0,
        label: "Aboard",
      },
      {
        id: "step_survived",
        value: 0,
        label: "Survived",
      },
    ];
    return funnelDataPassenger;
  };

  const getCrewFunnelData = (crash: PlaneCrash | undefined): FunnelData[] => {
    let crewAboard: number;
    let crewFatalities: number;
    let crewSurvived: number;

    // Crew
    if (
      props.crashdata?.aboard?.crew != undefined &&
      props.crashdata?.fatalities?.crew != undefined
    ) {
      crewAboard = props.crashdata?.aboard?.crew;
      crewFatalities = props.crashdata?.fatalities?.crew;
      crewSurvived = crewAboard - crewFatalities;
    } else {
      crewAboard = 0;
      crewFatalities = 0;
      crewSurvived = 0;
    }

    const funnelDataCrew = [
      {
        id: "step_aboard",
        value: crewAboard,
        label: "Aboard",
      },
      {
        id: "step_survived",
        value: crewSurvived,
        label: "Survived",
      },
    ];
    return funnelDataCrew;
  };

  const getPassengerFunnelData = (
    crash: PlaneCrash | undefined
  ): FunnelData[] => {
    let passengerAboard: number;
    let passengerFatalities: number;
    let passengerSurvived: number;

    // Passenger
    if (
      props.crashdata?.aboard?.passengers != undefined &&
      props.crashdata?.fatalities?.passengers != undefined
    ) {
      passengerAboard = props.crashdata?.aboard?.passengers;
      passengerFatalities = props.crashdata?.fatalities?.passengers;
      passengerSurvived = passengerAboard - passengerFatalities;
    } else {
      passengerAboard = 0;
      passengerFatalities = 0;
      passengerSurvived = 0;
    }

    const funnelDataPassenger = [
      {
        id: "step_aboard",
        value: passengerAboard,
        label: "Aboard",
      },
      {
        id: "step_survived",
        value: passengerSurvived,
        label: "Survived",
      },
    ];
    return funnelDataPassenger;
  };

  return (
    <Wrapper>
      <FunnelWrapper>
        <FunnelTitle>Crew</FunnelTitle>
        {funnelDataCrew != undefined ? (
          <ResponsiveFunnel
            data={funnelDataCrew}
            margin={{ top: 15, right: 15, bottom: 20, left: 10 }}
            valueFormat=""
            colors={["#36A2EB", "#FF6384"]}
            borderWidth={10}
            labelColor="#ffffff"
            // beforeSeparatorLength={10}
            // beforeSeparatorOffset={10}
            // afterSeparatorLength={10}
            // afterSeparatorOffset={10}
            currentPartSizeExtension={5}
            currentBorderWidth={15}
            interpolation="smooth"
            shapeBlending={1}
            // motionConfig="wobbly"
          />
        ) : (
          <EmptyWrapper />
        )}
      </FunnelWrapper>
      <FunnelWrapper>
        <FunnelTitle>Passengers</FunnelTitle>
        {funnelDataPassenger != undefined ? (
          <ResponsiveFunnel
            data={funnelDataPassenger}
            margin={{ top: 15, right: 10, bottom: 20, left: 15 }}
            valueFormat=""
            colors={["#36A2EB", "#FF6384"]}
            borderWidth={10}
            labelColor="#ffffff"
            // beforeSeparatorLength={10}
            // beforeSeparatorOffset={10}
            // afterSeparatorLength={10}
            // afterSeparatorOffset={10}
            currentPartSizeExtension={5}
            currentBorderWidth={15}
            interpolation="smooth"
            shapeBlending={1}
            // motionConfig="wobbly"
          />
        ) : (
          <EmptyWrapper />
        )}
      </FunnelWrapper>
    </Wrapper>
  );
}
