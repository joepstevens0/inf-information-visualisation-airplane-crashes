import React, { useCallback, useEffect, useState } from "react";

// @ts-ignore
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
  Graticule,
  Marker,
} from "react-simple-maps";

import PlaneCrash, { getTotalFatalities } from "../../types/planecrash";

import {
  Wrapper,
  LegendSVG,
  LegendTextWrapper,
  LegendHeaderText,
  LegendBodyText,
} from "./mapchart.styles";
import { GlobalStyle } from "../../global.styles";

const geoUrl =
  "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json";

export default function MapChart(props: {
  crashdata: PlaneCrash[] | undefined;
  setTooltipContent: React.Dispatch<React.SetStateAction<string>>;
  onSelect: (id: number | undefined) => void;
  selectedCrash: PlaneCrash | undefined;
}) {
  const [markerScale, setMarkerScale] = useState(0.5);
  const [coordinates, setCoordinates] = useState([0, 0]);
  const [zoom, setZoom] = useState(1);

  let marker_elements: JSX.Element[] = [];

  const onDataSelect = useCallback(
    (id: number | undefined) => {
      props.onSelect(id);
    },
    [props]
  );

  // If change in zoom state, resize markers
  useEffect(() => {
    setMarkerScale(0.5 / zoom);
  }, [zoom]);

  // If new crashdata create new list of markers
  useEffect(() => {
    // Remove all markers
    marker_elements = [];

    // Create new markers
    createMarkerList();
  }, [props.crashdata]);

  // @ts-ignore
  function handleMoveEnd(position) {
    setCoordinates(position.coordinates);
    // Change zoom state when user is zooming
    if (position.zoom !== zoom) {
      setZoom(position.zoom);
    }
  }

  function createMarkerList() {
    // No crash data no markers
    if (props.crashdata === undefined) {
      return;
    }

    // Stores selected crash if there is one
    let selectedCrashMarker;

    // Go over all crashes and create marker list
    props.crashdata.map((crash: PlaneCrash) => {
      let markerCoordinates;
      let markerType;
      let selectState;

      // Check if crash has coordinates otherwise skip
      if (crash.coordinates !== "?") {
        markerCoordinates = crash.coordinates;
        markerType = "accurate";
      } else if (crash.near_coordinates !== "?") {
        markerCoordinates = [
          // longitude and latitude need to be switched for near_coordinates
          crash.near_coordinates[1],
          crash.near_coordinates[0],
        ];
        markerType = "not_accurate";
      } else {
        return false;
      }
      // Check if selected
      if (crash === props.selectedCrash) selectState = "selected";
      else selectState = "not_selected";

      // Calculated key
      let unique_key = crash.id;

      let marker = (
        <Marker
          key={unique_key}
          // @ts-ignore
          coordinates={markerCoordinates}
          onMouseEnter={() => {
            props.setTooltipContent(
              `${crash.location} - ${getTotalFatalities(crash)}`
            );
          }}
          onMouseLeave={() => {
            props.setTooltipContent("");
          }}
          onClick={() => {
            onDataSelect(crash.id);
          }}
        >
          <g
            data-tip
            data-for="markerTip"
            className={"markerPoint " + markerType + " " + selectState}
            transform={"scale(" + markerScale + ")  translate(-12, -21)"}
          >
            <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 6.9 8 11.7z" />
            {/* <circle cx="12" cy="21" r="3" /> */}
          </g>
        </Marker>
      );

      // If selected crash store, else push already
      if (crash === props.selectedCrash) selectedCrashMarker = marker;
      else marker_elements.push(marker);
    });

    // If there is a selected crash, push it last
    if (selectedCrashMarker !== undefined)
      marker_elements.push(selectedCrashMarker);
  }

  createMarkerList();

  // Return map with markers
  return (
    <Wrapper>
      <LegendTextWrapper>
        <LegendHeaderText>Accuracy</LegendHeaderText>
        <LegendBodyText>
          <p>High</p>
          <p>Low</p>
          <p>Selected</p>
        </LegendBodyText>
      </LegendTextWrapper>

      <LegendSVG viewBox="0 0 200 80">
        <g
          className="accurate"
          transform={"scale(" + 1.2 + ") translate(17.5, 25)"}
        >
          <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 6.9 8 11.7z" />
        </g>
        <g
          className="not_accurate"
          transform={"scale(" + 1.2 + ") translate(62.5, 25)"}
        >
          <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 6.9 8 11.7z" />
        </g>
        {/* <line id="between_line" x1="115" y1="10" x2="115" y2="70" /> */}
        <g
          className="selected"
          transform={"scale(" + 1.2 + ") translate(115, 25)"}
        >
          <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 6.9 8 11.7z" />
        </g>
      </LegendSVG>

      <GlobalStyle />
      <ComposableMap width={600} height={300}>
        <ZoomableGroup
          zoom={zoom}
          // @ts-ignore
          center={coordinates}
          onMoveEnd={handleMoveEnd}
        >
          <Graticule stroke="#EAEAEC" />
          <Geographies className="disabled" geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="#a4a4aef4"
                  stroke="#EAEAEC"
                  strokeWidth="0.5"
                />
              ))
            }
          </Geographies>
          {marker_elements}
        </ZoomableGroup>
      </ComposableMap>
    </Wrapper>
  );
}
