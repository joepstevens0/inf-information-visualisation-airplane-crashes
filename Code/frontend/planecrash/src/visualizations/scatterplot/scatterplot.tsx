import React, { useCallback, useEffect, useRef, useState } from "react";
import PlaneCrash from "../../types/planecrash";

import { Wrapper } from "./scatterplot.styles";
import { GlobalStyle } from "../../global.styles";

// import { Scatter } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  LineController,
  ScatterController,
} from "chart.js";

import zoomPlugin from "chartjs-plugin-zoom";
import { createPlotData, ScatterPlotData } from "./scatterplot_data";
import createConfig from "./scatterplot_config";

ChartJS.register(
  ScatterController,
  LineController,
  LinearScale,
  CategoryScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  zoomPlugin
);

let chart_object_list = [] as (ChartJS | null)[];

function chart_init(): number {
  chart_object_list.push(null);
  return chart_object_list.length - 1;
}

export default function ScatterPlot(props: {
  crashdata: PlaneCrash[] | undefined;
  onSelect: (id: number | undefined) => void;
  selectedCrash: PlaneCrash | undefined;
}) {
  const [plotData, setData] = useState(
    undefined as ScatterPlotData[] | undefined
  );
  const ctx = useRef(null as HTMLCanvasElement | null);
  const [chart_index] = useState(chart_init());

  const onDataSelect = useCallback(
    (id: number | undefined) => {
      props.onSelect(id);
    },
    [props]
  );

  // update plotdata when new crashdata or selected crash
  useEffect(() => {
    if (props.crashdata !== undefined) {
      // create new data
      const data = createPlotData(props.crashdata);
      setData(data);

      if (ctx.current) {
        // update chart
        createChart(
          ctx.current,
          chart_index,
          data,
          onDataSelect,
          props.selectedCrash?.id
        );
      }
    }
  }, [props.crashdata, onDataSelect, props.selectedCrash]);

  return (
    <Wrapper>
      <GlobalStyle />
      <canvas ref={ctx}></canvas>
    </Wrapper>
  );
}

function createChart(
  ctx: HTMLCanvasElement,
  chart_index: number,
  data: ScatterPlotData[],
  onSelect: (id: number) => void,
  selectedCrashID: number | undefined
) {
  // delete old chart
  chart_object_list[chart_index]?.destroy();

  // create new chart
  const onClick = (evt: Event) => {
    if (chart_object_list[chart_index] === null) return;

    // get nearest points
    let elements = (
      chart_object_list[chart_index] as ChartJS
    ).getElementsAtEventForMode(evt, "nearest", { intersect: true }, true);

    // return selection of closest point planecrash index
    if (elements.length > 0) {
      onSelect((elements[0].element as any).$context.raw.id);
    }
  };
  chart_object_list[chart_index] = new ChartJS(
    ctx,
    createConfig(data, selectedCrashID, onClick)
  );
}
