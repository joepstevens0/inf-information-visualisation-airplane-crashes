import styled from "styled-components";
import { COLORS } from "../../constants/colors";

export const Wrapper = styled.div`
  width: inherit;
  height: inherit;
  padding: 1em;
  color: ${COLORS.text_dark};
`;

export const WrapperTooltip = styled.div`
  background-color: white;
  pointer-events: none;
  border-radius: 5px;
  border: 1px solid ${COLORS.border_accent};
  background-color: ${COLORS.background_medium_dark};
  color: ${COLORS.text_light};
`;
export const ToolTipHead = styled.div`
  font-weight: bold;
  border-bottom: 1px solid ${COLORS.border_accent};
`;
export const ToolTipBody = styled.div`
`;
export const TooltipCrashElement = styled.div`
  border-bottom: 1px solid ${COLORS.border_accent};
`;
export const TooltipCrashLabel = styled.div`
  font-weight: bold;
`;
export const TooltipCrashData = styled.div`
`;

