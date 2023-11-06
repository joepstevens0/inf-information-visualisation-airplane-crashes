import styled from "styled-components";
import { COLORS } from "../../constants/colors";

export const Wrapper = styled.div`
  position: relative;

  width: inherit;
  height: inherit;

  .disabled {
    pointer-events: none;
  }

  .markerPoint {
    position: relative;

    fill-opacity: 50%;
    stroke-width: 1.25px;
    stroke-linecap: round;
    cursor: pointer;
    outline: none;
    border: none;

    pointer-events: bounding-box;
    transition: transform 200ms;
  }

  .markerPoint:hover {
    fill: #ff6384;
    fill-opacity: 75%;
  }

  .accurate {
    fill: #4a98b8;
    stroke: #4a98b8;
    fill-opacity: 50%;
  }

  .not_accurate {
    fill: #e8d04e;
    stroke: #e8d04e;
    fill-opacity: 50%;
  }

  //possible need to change the colors
  .selected {
    fill: #ff6384;
    stroke: #ff6384;
    fill-opacity: 100%;
  }

  .not_selected {
  }

  #between_line {
    stroke: lightgray;
  }

  svg {
    z-index: -1;
  }
`;

export const LegendSVG = styled.svg`
  position: absolute;

  width: 200px;
  height: 80px;

  top: 0;
  right: 0;

  background: white;

  z-index: 1 !important;
`;

export const LegendTextWrapper = styled.div`
  position: absolute;

  width: 200px;
  height: 80px;

  top: 0;
  right: 0;

  padding: 0.275em;

  z-index: 2 !important;
`;

export const LegendHeaderText = styled.div`
  font-weight: bold;
  text-align: left;

  margin-left: 1.45em;

  margin-bottom: 2.05em;
`;

export const LegendBodyText = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 2.5em;

  font-size: 12px;
`;
