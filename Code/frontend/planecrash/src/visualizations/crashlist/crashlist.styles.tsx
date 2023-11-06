import styled from "styled-components";
import { COLORS } from "../../constants/colors";

export const Wrapper = styled.div`
  width: inherit;
  height: inherit;
  padding: 1em;
  display: grid;
  grid-template-rows: 1fr auto;
`;

export const CrashListWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 49%);
  gap: 1em;
`;

export const CrashElement = styled.div`
  display: grid;
  grid-template-columns: auto 1fr minmax(170px, auto);
  grid-template-rows: auto 1fr;
  grid-template-areas:
    "date location type"
    "summary summary summary";

  position: relative;

  gap: 0.7em;
  margin-bottom: 2em;

  height: 150px;
  padding: 0.7em;

  border-radius: 2px;

  ${(props) => {
    if (props.unselectable)
      return `outline: 4px solid ${COLORS.primary_highlight};
              background-color: ${COLORS.background_dark};`;
    else {
      return `
      cursor: pointer;
      background-color: ${COLORS.background_dark};
      :hover {
        opacity: 0.85;
      }
      `;
    }
  }}
`;

export const CrashElementDateField = styled.div`
  grid-area: date;
  padding: 0.4em;
  text-align: center;
  font-size: 18px;
  font-weight: 500;
  background: #9e9e9e;
  color: black;
`;

export const CrashElementLocationField = styled.div`
  grid-area: location;
  padding: 0.4em;
  text-align: left;
  line-height: 24px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  background: #737373;
  color: white;
`;

export const CrashElementTypeField = styled.div`
  grid-area: type;
  padding: 0.4em;
  text-align: center;
  line-height: 24px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  background: #737373;
  color: white;
`;

export const CrashElementSummaryField = styled.div`
  grid-area: summary;
  padding: 0.4em;
  text-align: left;
  font-size: 14px;
  color: #d8d8d8;
  background: #737373;
  overflow: auto;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;

  // summary filter highlight
  mark {
    background-color: ${COLORS.text_light_secondary};
  }

  // scrollbar style
  /* width */
  ::-webkit-scrollbar {
    width: 10px;
  }
  /* Track */
  ::-webkit-scrollbar-track {
    background: #9e9e9e;
  }
  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: ${COLORS.background_medium_dark};
  }
  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;

export const CrashElementYearField = styled.div`
  position: absolute;
  right: 0.7em;
  top: -1.75em;
  padding: 0.2em;
  text-align: center;
  font-size: 20px;
  font-weight: 500;
  background: #d9d9d9;
  color: black;
  z-index: -1;
`;

export const PageNumberWrapper = styled.div`
  margin: auto;
  margin-top: 5px;
  width: fit-content;
  width: 100%;
  text-align: center;
`;
export const PageNumberElement = styled.div`
  display: inline-block;
  padding: 0.5em;
  border-right: 0.5px solid ${COLORS.border_accent};
  background: ${COLORS.background_medium_dark};
  color: white;

  cursor: pointer;
  user-select: none;

  :hover {
    background: #888888;
  }

  ${(props) => {
    if (props.unselectable) return `background: #757575`;
  }}
`;
