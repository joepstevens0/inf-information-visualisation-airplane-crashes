import styled from "styled-components";
import { COLORS } from "../../constants/colors";

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2.5em;
  height: 100%;
  width: 450px;
  max-height: 100vh;
  padding: 0.5em 1em;
  background: ${COLORS.background_dark};
`;

export const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

export const HeaderTitle = styled.div`
  padding-bottom: 10px;
  border-bottom: 1px solid white;
  font-weight: bold;
  font-size: 20px;
  color: white;
`;

export const CloseButton = styled.button`
  width: min-content;
  height: min-content;
  padding: 0.4em;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  background: ${COLORS.header_background};
  color: ${COLORS.primary};
`;

export const CrashDetailsWrapper = styled.div`
  width: 100%;
  height: 100%;
`;

export const DataViewWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
`;

export const DataViewButton = styled.button`
  position: absolute;
  right: 0;
  top: -2.5em;

  width: fit-content;
  padding: 0.5em;
  border: none;

  font-weight: bold;
  font-size: 16px;
  cursor: pointer;
  color: white;
  background: none;

  :hover {
    text-decoration: underline;
  }
`;

export const ItemTable = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1em;
  font-size: 15px;
`;

export const ItemGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25em;
  margin-bottom: 1em;
`;

export const ItemWrapper = styled.div`
  display: grid;
  grid-template-columns: 95px 1fr;
`;
export const ItemHeader = styled.div`
  font-weight: bold;
  padding: 0.35em 0.25em;
  text-align: center;
  text-transform: uppercase;
  background: ${COLORS.primary_dark};
  color: white;
`;

export const ItemValue = styled.div`
  padding: 0.35em 0.25em;
  padding-right: 0.5em;
  text-align: right;
  background: ${COLORS.background_medium_dark};
  color: white;
`;

export const SummaryHeader = styled.div`
  font-weight: bold;
  padding: 0.35em 0.25em;
  text-align: center;
  text-transform: uppercase;
  background: ${COLORS.header_button};
  color: white;
`;

export const SummaryValue = styled.div`
  max-height: 90vh;
  overflow-y: auto;
  padding: 0.7em;
  background: ${COLORS.background_medium_dark};
  color: #d8d8d8;

  // summary filter highlight
  mark {
    background-color: ${COLORS.text_light_secondary};
  }
`;

export const GraphWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5em;
`;

export const GraphInterface = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5em;
`;

export const GraphTitle = styled.div`
  min-width: 120px;
  text-align: center;
  font-weight: bold;
  font-size: 18px;
  color: white;
`;

export const GraphContentWrapper = styled.div`
  position: relative;
  width: auto;
  height: auto;
`;
export const FatalityCanvasInner = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, 70%);
  color: white;
`;

export const ArrowButton = styled.button`
  font-size: 30px;
  border: none;
  outline: none;
  background: none;
  cursor: pointer;
  color: white;
  :hover {
    color: ${COLORS.primary};
    font-weight: bolder;
  }
`;

export const DisabledArrowButton = styled.button`
  font-size: 30px;
  border: none;
  outline: none;
  background: none;
  color: gray;
`;
