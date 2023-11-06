import styled from "styled-components";

export const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;

    height: 100%;
    width: fit-content;
    margin: auto;
    position: absolute;
    top: 0px;
    right: 5%;
`;

export const Scale = styled.div`
    margin-top: 30px;
    width: 50px;
    height: 300px;
    position: relative;
`;

export const Label = styled.div`
    width: 160%;
    text-align: right;
    border-bottom: 2px solid rgba(0,0,0,0.4);
    position: absolute;
`;