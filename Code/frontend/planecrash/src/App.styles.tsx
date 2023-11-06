import styled from "styled-components";
import Button from "@material-ui/core/Button";
import { COLORS } from "./constants/colors";

export const Wrapper = styled.div`
  height: 100vh;
  width: 100vw;
  max-height: 100%;
  max-width: 100%;
  overflow-y: hidden;
  display: grid;
  grid-template-columns: 1fr auto;
  grid-template-rows: 1fr;
`;

export const LeftWrapper = styled.div`
  display: grid;
  grid-template-rows: auto auto 1fr auto;
  align-items: center;
`;

export const RightWrapper = styled.div``;

export const Header = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1em;
  align-items: left;
  padding: 0.5em;
  background: ${COLORS.header_background};
`;

export const HeaderTitle = styled.div`
  padding-right: 10px;
  border-right: 1px solid white;
  font-size: 20px;
  color: white;
`;

export const Content = styled.div``;

export const TabList = styled.div`
  display: flex;
  gap: 0.5em;
`;

export const TabElement = styled.button`
  padding: 0.5em;
  border: none;
  font-size: 15px;
  user-select: none;
  cursor: pointer;
  background: ${COLORS.header_button};
  :hover {
    opacity: 0.75;};
  }
  color: white;
  ${(props) => {
    if (props.disabled)
      return `background: ${COLORS.primary_dark} !important;
              :hover{opacity: 1;}`;
  }};
`;

export const MapWrapper = styled.div`
  width: inherit;
  height: inherit;
`;

export const EmptyWrapper = styled.div`
  width: 100%;
  height: 0%;
`;
