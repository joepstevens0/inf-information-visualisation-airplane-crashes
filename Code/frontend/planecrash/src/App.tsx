import { useCallback, useEffect, useState } from "react";
import ReactTooltip from "react-tooltip";

import fetchData from "./fetchdata/fetchdata";
import PlaneCrash from "./types/planecrash";
import MapChart from "./visualizations/map/mapchart";
import SunburstPlot from "./visualizations/sunburst/sunburst";
import ScatterPlot from "./visualizations/scatterplot/scatterplot";
import CrashList from "./visualizations/crashlist/crashlist";
import FilterOptions from "./visualizations/filter/Filter";
import DetailView from "./visualizations/detailview/detailview";
import CalenderGraph from "./visualizations/calender/calender";

import {
  Wrapper,
  LeftWrapper,
  RightWrapper,
  Header,
  HeaderTitle,
  TabElement,
  TabList,
  Content,
  MapWrapper,
  EmptyWrapper,
} from "./App.styles";

import { GlobalStyle } from "./global.styles";
import StatDisplay from "./visualizations/statdisplay/statdisplay";
import CompareGraph from "./visualizations/compare/compare";
import AboutPage from "./visualizations/about/about";

// retrieve chart data
async function getData(): Promise<PlaneCrash[]> {
  return await fetchData();
}

enum Graphs {
  fatalities,
  map,
  sunburst,
  calender,
  crashlist,
  compare,
  about,
}

const App = () => {
  const [crashData, setData] = useState(undefined as PlaneCrash[] | undefined);
  const [filteredData, setFilteredData] = useState(
    undefined as PlaneCrash[] | undefined
  );
  const [selectedCrashID, setSelectedCrashID] = useState(
    undefined as number | undefined
  );

  const [activeGraph, setActiveGraph] = useState<Graphs>(Graphs.fatalities);

  const [markerTipContent, setMarkerTipContent] = useState("");

  const [summaryHighlight, setSummaryHighlight] = useState("");

  useEffect(() => {
    getData().then((data) => {
      setData(data);
    });
  }, []);

  useEffect(() => {
    ReactTooltip.rebuild();
  }, [markerTipContent]);

  // on selected any individual crash
  const onCrashSelect = (id: number | undefined) => {
    if (id === undefined) setSelectedCrashID(undefined);
    else setSelectedCrashID(id);
  };

  const getCrashByID = (id: number | undefined): PlaneCrash | undefined => {
    if (id === undefined || crashData === undefined) return undefined;

    for (var i = 0; i < crashData.length; i++) {
      if (crashData[i].id === id) return crashData[i];
    }

    return undefined;
  };

  const renderGraph = (graph: Graphs): JSX.Element => {
    switch (graph) {
      case Graphs.fatalities:
        return (
          <ScatterPlot
            crashdata={filteredData as PlaneCrash[] | undefined}
            onSelect={onCrashSelect}
            selectedCrash={getCrashByID(selectedCrashID)}
          />
        );
      case Graphs.map:
        return (
          <MapWrapper>
            <MapChart
              crashdata={filteredData as PlaneCrash[] | undefined}
              setTooltipContent={setMarkerTipContent}
              onSelect={onCrashSelect}
              selectedCrash={getCrashByID(selectedCrashID)}
            />
            <ReactTooltip id="markerTip" place="top" effect="solid">
              {markerTipContent}
            </ReactTooltip>
          </MapWrapper>
        );
      case Graphs.sunburst:
        return (
          <SunburstPlot
            crashdata={filteredData as PlaneCrash[] | undefined}
            onSelect={onCrashSelect}
            selectedCrash={getCrashByID(selectedCrashID)}
          />
        );
      case Graphs.crashlist:
        return (
          <CrashList
            crashdata={filteredData as PlaneCrash[] | undefined}
            onSelect={onCrashSelect}
            summaryHighlight={summaryHighlight}
            selectedCrash={getCrashByID(selectedCrashID)}
          />
        );
      case Graphs.calender:
        return (
          <CalenderGraph crashdata={filteredData as PlaneCrash[] | undefined} />
        );
      case Graphs.compare:
        return <CompareGraph crashdata={crashData as PlaneCrash[]} />;
      case Graphs.about:
        return <AboutPage />;
      default:
        return <div>Error: No graph active</div>;
    }
  };

  return (
    <Wrapper>
      <GlobalStyle />
      <LeftWrapper>
        <Header>
          <HeaderTitle>Plane crash visualisation</HeaderTitle>
          <TabList>
            <TabElement
              disabled={activeGraph === Graphs.fatalities ? true : undefined}
              onClick={() => setActiveGraph(Graphs.fatalities)}
            >
              Fatalities
            </TabElement>
            <TabElement
              disabled={activeGraph === Graphs.map ? true : undefined}
              onClick={() => setActiveGraph(Graphs.map)}
            >
              Map
            </TabElement>
            <TabElement
              disabled={activeGraph === Graphs.sunburst ? true : undefined}
              onClick={() => setActiveGraph(Graphs.sunburst)}
            >
              Sunburst
            </TabElement>
            <TabElement
              disabled={activeGraph === Graphs.calender ? true : undefined}
              onClick={() => setActiveGraph(Graphs.calender)}
            >
              Calender
            </TabElement>
            <TabElement
              disabled={activeGraph === Graphs.crashlist ? true : undefined}
              onClick={() => setActiveGraph(Graphs.crashlist)}
            >
              List
            </TabElement>
            <TabElement
              disabled={activeGraph === Graphs.compare ? true : undefined}
              onClick={() => setActiveGraph(Graphs.compare)}
            >
              Compare
            </TabElement>
            <TabElement
              disabled={activeGraph === Graphs.about ? true : undefined}
              onClick={() => setActiveGraph(Graphs.about)}
            >
              About
            </TabElement>
            {/* <TabElement onClick={() => console.log("")}>Others</TabElement> */}
          </TabList>
        </Header>

        {/*Option to turn off for Compare*/}
        {activeGraph !== Graphs.compare && activeGraph !== Graphs.about ? (
          <StatDisplay crashdata={filteredData} />
        ) : (
          <EmptyWrapper />
        )}

        <Content>{renderGraph(activeGraph)}</Content>

        {/*Option to turn off for Compare*/}
        {activeGraph !== Graphs.compare && activeGraph !== Graphs.about ? (
          <FilterOptions
            crashdata={crashData}
            setFilteredData={setFilteredData}
            setSummaryHighlight={setSummaryHighlight}
          />
        ) : (
          <EmptyWrapper />
        )}
      </LeftWrapper>

      {/*Option to turn off for Compare"*/}
      {activeGraph !== Graphs.compare && activeGraph !== Graphs.about ? (
        <RightWrapper>
          <DetailView
            crash={getCrashByID(selectedCrashID)}
            summaryHighlight={summaryHighlight}
          />
        </RightWrapper>
      ) : (
        <EmptyWrapper />
      )}
    </Wrapper>
  );
};

export default App;
