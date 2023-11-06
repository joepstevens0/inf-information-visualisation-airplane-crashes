import styled from "styled-components";
import { COLORS } from "../../constants/colors";

export const Wrapper = styled.div`
    display: flex;
    align-items: center;
    width: 100%;
    padding-right: 100px;
    border-top: 1px solid ${COLORS.border_accent};
    background: ${COLORS.background_medium_dark};
    `;

export const StatElement = styled.div`
    display: block;
    white-space: nowrap;
    min-width: 180px;
    margin: 0.5em;
    border-right: 2px solid ${COLORS.header_button};
    `;

export const StatLabel = styled.div`
    color: ${COLORS.text_light};
    font-weight: bold;
    font-size: 1em;
    width: fit-content;
    margin: auto;
`;

export const StatNumber = styled.div`
    color: ${COLORS.text_light_secondary};
    font-size: 15px;
    width: fit-content;
    margin: auto;
`;