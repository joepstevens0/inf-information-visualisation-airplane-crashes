import styled from "styled-components";
import { COLORS } from "../../constants/colors";

export const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 50vw 50vw;
  grid-template-rows: 95vh;
  overflow: hidden;
`;

export const Compare1 = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-right: 1px solid ${COLORS.primary_dark};
`;

//Maybe change to colors of the different filters?
//background color just for debugging
export const Compare2 = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: #f1f2f4;
`;
