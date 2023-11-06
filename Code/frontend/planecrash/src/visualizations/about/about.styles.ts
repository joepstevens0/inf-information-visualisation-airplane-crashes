import styled from "styled-components";

export const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 3em;
`;

export const InnerWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1em;
  padding: 1.5em;
  width: 740px;
  justify-content: center;
  border: 6px solid black;
`;

export const Logo = styled.img`
  position: absolute;
  bottom: 1em;
  right: 1em;
  width: 200px;
`;

export const Title = styled.h1`
  position: absolute;
  top: -2.8em;
  left: -0.7em;
  padding: 0.3em;
  text-align: center;
  margin: 0.5em;
  border: 6px solid black;
`;

export const Explanation = styled.div``;

export const Details = styled.div``;

export const Credits = styled.h3`
  position: absolute;
  bottom: -2.4em;
  right: -0.3em;
  padding: 0.5em;
  font-size: 1.2em;
  background: black;
  color: white;
`;
