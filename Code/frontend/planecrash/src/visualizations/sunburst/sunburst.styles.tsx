import styled from "styled-components";
import { COLORS } from "../../constants/colors";

export const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 300px 1fr;
  grid-template-rows: 1fr;
  width: inherit;
`;

export const SunburstWrapper = styled.div`
  height: 700px;
  width: 800px;
  overflow: hidden;

  margin-left: 70px;
  margin-top: 10px;

  svg {
    width: 800px !important;
    height: 700px !important;
  }

  z-index: 5;
`;
export const ChildListWrapper = styled.div`
  overflow-y: scroll;
  height: 100%;
  z-index: 10;
`;

export const ChildWrapper = styled.button`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
`;

export const LocationElement = styled.div`
  cursor: pointer;
  :hover {
    color: ${COLORS.primary_dark};
  }
`;
export const LocationWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 0.1em;
  width: 100%;
  padding: 5px;
`;

export const SearchWrapper = styled.div`
  z-index: 10;
  margin-bottom: 1em;
  /* background: ${COLORS.border_accent}; */
`;

export const SearchInput = styled.input`
  width: 100%;
`

export const SunburstLeftWrapper = styled.div`
  height: 600px;
  padding: 1em;
`;
export const SunburstRightWrapper = styled.div`
  position: relative;
`;
