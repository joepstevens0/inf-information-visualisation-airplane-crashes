import { useEffect, useRef, useState } from "react";
import PlaneCrash, { getTotalFatalities } from "../../types/planecrash";
import BarPlot from "../../visualizations/bar/bar";
import Funnel from "../../visualizations/funnel/funnel";
import {
  Wrapper,
  Header,
  HeaderTitle,
  CrashDetailsWrapper,
  ArrowButton,
  DisabledArrowButton,
  GraphWrapper,
  GraphInterface,
  GraphTitle,
  GraphContentWrapper,
  FatalityCanvasInner,
  DataViewWrapper,
  DataViewButton,
  ItemTable,
  ItemGroup,
  ItemWrapper,
  ItemHeader,
  ItemValue,
  SummaryValue,
} from "./detailview.styles";

import { ArcElement, Chart as ChartJS, DoughnutController } from "chart.js";

enum DataView {
  details,
  summary,
}

enum Graphs {
  fatalities,
  surviveRatio,
  deathRatio,
}

ChartJS.register(DoughnutController, ArcElement);

let fatality_chart_object = null as ChartJS | null;

function DetailView(props: { crash: PlaneCrash | undefined;summaryHighlight: string; }) {
  const [activeGraph, setActiveGraph] = useState<Graphs>(Graphs.fatalities);
  const [activeDataView, setActiveDataView] = useState<DataView>(
    DataView.details
  );

  const fatality_canvas = useRef(null as HTMLCanvasElement | null);

  // update fatality chart when new crashdata
  useEffect(() => {
    if (props.crash !== undefined && fatality_canvas.current) {
      // update chart
      createFatalityChart(fatality_canvas.current, props.crash);
    }
  }, [props.crash, activeGraph, activeDataView]);

  const createSummaryElement = (summaryText: string) => {
    // Split on highlight
    const parts = summaryText.split(new RegExp(`(${props.summaryHighlight})`, 'gi'));
    return (
      <span> 
        { 
        parts.map((part, i): JSX.Element | string => {
          if (part.toLowerCase() === props.summaryHighlight.toLowerCase())
            return <mark>{part}</mark>;
        return part;
          }
        )
        }
      </span>
    );
}

  const renderDataView = (
    dataView: DataView,
    crash: PlaneCrash
  ): JSX.Element => {
    switch (dataView) {
      case DataView.details:
        return (
          <DataViewWrapper>
            <DataViewButton onClick={() => setActiveDataView(DataView.summary)}>
              Summary ➤
            </DataViewButton>

            <ItemGroup>
              <ItemWrapper>
                <ItemHeader>Date</ItemHeader>
                <ItemValue>{crash?.time?.toDateString()}</ItemValue>
              </ItemWrapper>
              <ItemWrapper>
                <ItemHeader>Location</ItemHeader>
                <ItemValue>{crash?.location}</ItemValue>
              </ItemWrapper>
            </ItemGroup>

            <ItemGroup>
              <ItemWrapper>
                <ItemHeader>Route</ItemHeader>
                <ItemValue>{crash?.route}</ItemValue>
              </ItemWrapper>
            </ItemGroup>

            <ItemGroup>
              <ItemWrapper>
                <ItemHeader>Operator</ItemHeader>
                <ItemValue>{crash?.operator}</ItemValue>
              </ItemWrapper>
              <ItemWrapper>
                <ItemHeader>Registr.</ItemHeader>
                <ItemValue>{crash?.registration}</ItemValue>
              </ItemWrapper>
              <ItemWrapper>
                <ItemHeader>Flight Nr.</ItemHeader>
                <ItemValue>{crash?.flight_number}</ItemValue>
              </ItemWrapper>
              <ItemWrapper>
                <ItemHeader>AC type</ItemHeader>
                <ItemValue>{crash?.actype}</ItemValue>
              </ItemWrapper>
            </ItemGroup>
          </DataViewWrapper>
        );
      case DataView.summary:
        return (
          <DataViewWrapper>
            <DataViewButton onClick={() => setActiveDataView(DataView.details)}>
              Details ➤
            </DataViewButton>
            {/* <SummaryHeader>Summary</SummaryHeader> */}
            <SummaryValue>{createSummaryElement(crash.summary)}</SummaryValue>
          </DataViewWrapper>
        );
    }
  };

  const renderGraph = (graph: Graphs, crash: PlaneCrash): JSX.Element => {
    if (props.crash === undefined) {
      return <div>No Data</div>;
    }

    if (activeDataView === DataView.summary) {
      return <div></div>;
    }

    switch (graph) {
      case Graphs.fatalities:
        const total_fatalities = getTotalFatalities(crash);
        return (
          <GraphWrapper>
            <GraphInterface>
              <DisabledArrowButton>⮜</DisabledArrowButton>
              <GraphTitle>Fatalities</GraphTitle>
              <ArrowButton onClick={() => setActiveGraph(Graphs.surviveRatio)}>
                ⮞
              </ArrowButton>
            </GraphInterface>

            <GraphContentWrapper>
              <canvas ref={fatality_canvas}></canvas>
              <FatalityCanvasInner>
                {total_fatalities} fatalities
              </FatalityCanvasInner>
            </GraphContentWrapper>
          </GraphWrapper>
        );
      case Graphs.surviveRatio:
        return (
          <GraphWrapper>
            <GraphInterface>
              <ArrowButton onClick={() => setActiveGraph(Graphs.fatalities)}>
                ⮜
              </ArrowButton>
              <GraphTitle>Survive Ratio</GraphTitle>
              <ArrowButton onClick={() => setActiveGraph(Graphs.deathRatio)}>
                ⮞
              </ArrowButton>
            </GraphInterface>

            <GraphContentWrapper>
              <Funnel crashdata={crash as PlaneCrash | undefined} />
            </GraphContentWrapper>
          </GraphWrapper>
        );
      case Graphs.deathRatio:
        return (
          <GraphWrapper>
            <GraphInterface>
              <ArrowButton onClick={() => setActiveGraph(Graphs.surviveRatio)}>
                ⮜
              </ArrowButton>
              <GraphTitle>Death Ratio</GraphTitle>
              <DisabledArrowButton>⮞</DisabledArrowButton>
            </GraphInterface>

            <GraphContentWrapper>
              <BarPlot crashdata={crash as PlaneCrash | undefined} />
            </GraphContentWrapper>
          </GraphWrapper>
        );
    }
  };

  // default message when no crash data
  let view = <ItemHeader>Select a crash for details</ItemHeader>;

  // fill in crash data, if available
  if (props.crash !== undefined) {
    const detailView = renderDataView(activeDataView, props.crash);
    const graph = renderGraph(activeGraph, props.crash);

    const items = (
      <ItemTable>
        {detailView}
        {graph}
      </ItemTable>
    );
    view = <CrashDetailsWrapper>{items}</CrashDetailsWrapper>;
  }

  return (
    <Wrapper>
      <Header>
        <HeaderTitle>Crash details</HeaderTitle>
        {/* <CloseButton>X</CloseButton> */}
      </Header>
      {view}
    </Wrapper>
  );
}

function createFatalityConfig(crash: PlaneCrash): any {
  const data = {
    labels: ["crew", "passengers", "ground"],
    datasets: [
      {
        label: "Fatalities",
        data: [
          crash.fatalities.crew,
          crash.fatalities.passengers,
          crash.fatalities.ground,
        ],
        backgroundColor: [
          "rgb(255, 99, 132)",
          "rgb(54, 162, 235)",
          "rgb(255, 205, 86)",
        ],
        hoverOffset: 4,
      },
    ],
  };

  const config = {
    type: "doughnut",
    data: data,
    options: {
      
      plugins: {
        legend: {
          labels: {
            color: "white"
          }
        },

      },

    },
  };

  return config;
}

function createFatalityChart(ctx: HTMLCanvasElement, crash: PlaneCrash) {
  // delete old chart
  fatality_chart_object?.destroy();
  // create new chart
  fatality_chart_object = new ChartJS(ctx, createFatalityConfig(crash));
}

export default DetailView;
