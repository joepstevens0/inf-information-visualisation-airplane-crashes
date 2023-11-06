import React, { useEffect, useRef, useState } from "react";
import { BarDatum, BarTooltipProps, ResponsiveBar } from "@nivo/bar";
import PlaneCrash from "../../types/planecrash";
import {
  Wrapper,
  WrapHover,
  FatalityCanvasWrapper,
  Description,
} from "./bar.styles";

//DEPRACITED NOT USING ANYMORE

import { BarElement, Chart as ChartJS, BarController } from "chart.js";

ChartJS.register(BarController, BarElement);

let char_object = null as ChartJS | null;

function BarPlot(props: { crashdata: PlaneCrash | undefined }) {
  const surviverCanvas = useRef(null as HTMLCanvasElement | null);

  useEffect(() => {
    if (props.crashdata !== undefined && surviverCanvas.current) {
      createSuriverChart(surviverCanvas.current, props.crashdata);
    }
  }, [props.crashdata]);

  let view = <div>Nothing yet </div>;

  if (props.crashdata !== undefined) {
    const item = (
      <FatalityCanvasWrapper>
        <Description>aboard vs death</Description>
        <canvas ref={surviverCanvas} />
      </FatalityCanvasWrapper>
    );
    view = <div>{item}</div>;
  }

  return <Wrapper>{view}</Wrapper>;
}

//TODO: check for if zero's
function createPlotData(crashdata: PlaneCrash): BarDatum[] {
  const plotdata: BarDatum[] = [];

  //Crew part

  if (isNaN(crashdata.aboard.crew) || isNaN(crashdata.fatalities.crew)) {
    console.log("Problem still need fix");
  }
  plotdata.push({
    type: "Crew",
    aboard: crashdata.aboard.crew,
    fatalities: crashdata.fatalities.crew,
  });

  //Passegner part

  if (
    isNaN(crashdata.aboard.passengers) ||
    isNaN(crashdata.fatalities.passengers)
  ) {
    console.log("other problem to fix ");
  }
  plotdata.push({
    type: "Passengers",
    aboard: crashdata.aboard.passengers,
    fatalities: crashdata.fatalities.passengers,
  });

  console.log(plotdata);

  return plotdata;
}

function createSuriverConfig(crash: PlaneCrash): any {
  const data = {
    labels: ["Crew", "Passengers"],
    datasets: [
      {
        label: "",
        data: [crash.aboard.crew, crash.aboard.passengers],
        backgroundColor: ["rgb(255, 99, 132)", "rgb(255, 159, 64)"],
        hoverOffset: 4,
      },
      {
        data: [crash.fatalities.crew, crash.fatalities.passengers],
        backgroundColor: ["rgb(255, 205, 86)", "rgb(75, 192, 192)"],
      },
    ],
  };

  const config = {
    type: "bar",
    data: data,
    options: {
      scales: {
        y: {
          ticks:{ 
            color: "white"
          },
          grid:{
            color: "grey"
          }
        },
        x: {
          ticks:{
            color: "white"
          },
          grid:{
            display: false,
          }
        }
      },
      plugins: {
        legend: {
          display: false,
        },

        title:{
          color: "white"
        }
      },
     
    },
  };

  return config;
}

function createSuriverChart(ctx: HTMLCanvasElement, crash: PlaneCrash) {
  //delete
  char_object?.destroy();

  char_object = new ChartJS(ctx, createSuriverConfig(crash));
}

export default BarPlot;
