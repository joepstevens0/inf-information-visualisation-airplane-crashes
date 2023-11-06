import styled from "styled-components";
import { COLORS } from "../../constants/colors";

export const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 400px;
  height: 400px;
`;

export const FunnelWrapper = styled.div`
  width: 50%;
  height: 100%;
`;

export const FunnelTitle = styled.div`
  width: 100%;
  text-align: center;
  color: white;
  font-weight: bold;
`;

export const EmptyWrapper = styled.div`
  width: 100%;
  height: 0%;
`;
