import styled from "styled-components";
import { Checkbox, Slider } from "@material-ui/core";
import { COLORS } from "../../constants/colors";

export const Wrapper = styled.div`
  position: relative;
  background: ${COLORS.header_background};
`;

// pop-up
export const FilterPopUp = styled.div`
  color: ${COLORS.text_light};
  background-color: ${COLORS.background_medium_dark};
  z-index: 0;
  position: absolute;
  bottom: 100%;
  right: 0px;
  width: 25%;
  height: fit-content;
  opacity: 0.9;
`;
export const FilterPopUpElement = styled.div`
  padding: 0.5em 2em;
  color: white !important;
  border-bottom: 1px solid ${COLORS.border_accent};
  margin-bottom: 5px;
  text-align: center;
`;
export const FilterSummary = styled.div`
  text-align: center;
`;
export const FilterSummaryInput = styled.input`
  width: 100%;
  border-radius: 4px;
  padding: 5px;
  margin: 5px;
  border: 1px solid ${COLORS.border_accent};
`;

// bar containing slider and popup button
export const FilterBar = styled.div`
  display: grid;
  grid-template-columns: 75% 25%;
  align-items: center;
  z-index: 2;
  color: ${COLORS.text_light};
`;
export const SliderWraper = styled.div`
  width: 100%;
  padding: 0.5em 2em;
`;
export const PopupButton = styled.div`
  width: 100%;
  height: 100%;
  display: block;
  text-align: center;
  font-size: 22px;
  padding: 0.3em;
  cursor: pointer;
  user-select: none;
  background-color: ${COLORS.background_medium_dark};
  :hover {
    background-color: ${COLORS.background_dark};
  }
`;

export const AircraftSelect = styled.select`
  width: 100%;
  padding: 5px;
  border-radius: 3px;
  border: 2px solid ${COLORS.border_accent};
  background-color: ${COLORS.background_medium_dark};
  color: ${COLORS.text_light};

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

export const MyCheckBox = styled(Checkbox)`
  color: white !important;
`;

export const YearSlider = styled(Slider)({
  "& .MuiSlider-track": {
    height: 8,
    border: "none",
    color: `${COLORS.primary}`,
  },
  "& .MuiSlider-rail": {
    height: 8,
    opacity: 0.5,
    borderRadius: 8,
    backgroundColor: "#bfbfbf",
  },
  "& .MuiSlider-thumb": {
    height: 24,
    width: 24,
    color: `${COLORS.primary}`,
    marginTop: -8,
    marginLeft: -12,
    '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
      boxShadow: 'none',
    },
  },
  "& .MuiSlider-valueLabel": {
    marginLeft: 12,
    color: `${COLORS.primary}`,
  },
});

// export const YearSlider = withStyles((theme) => ({
//   root: {
//     height: 8,
//     color: COLORS.border_accent
//   },
//   disabled: {
//     color: COLORS.primary,
//   },
//   thumb: {
//     color: COLORS.primary,
//     border: "4px solid currentColor",
//     height: 24,
//     width: 24,
//     marginTop: -8,
//     marginLeft: -12,
//   },
//   valueLabel: {
//     width: 32,
//     height: 32,
//     fontSize: 12,
//     marginTop: -2,
//     marginRight: 0,
//   },
//   rail: {
//     height: 10,
//     borderRadius: 10,
//     opacity: 1,
//   },
// }))(Slider);
