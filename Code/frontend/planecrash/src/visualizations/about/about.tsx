import {
  Wrapper,
  InnerWrapper,
  Logo,
  Title,
  Explanation,
  Details,
  Credits,
} from "./about.styles";

function AboutPage() {
  return (
    <Wrapper>
      <Logo src={require("./logo.png")} alt="Logo uHasselt"></Logo>
      <InnerWrapper>
        <Title>Project: Information Visualisation 2022</Title>
        <Explanation>
          This application visualizes plane crashes over time. We have used
          different kinds of graphs to make this happen. Because there are many
          plane crashes there is the option to filter. The filtering can be done
          based on years, fatalities, keywords, airplane type and operator. The filter will
          also be applied on all the pages. Only the compare has its own filter.
          This is chosen to make it less confusing for the user.
        </Explanation>

        <Details>
          <p>
            This visualization is made for the course “Information
            Visualization” @UHasselt in the year 2022.
          </p>
          <p>
            Coure Lecuture:
            <i> dr. Gustavo Rovelo Ruiz</i> & <i>Prof. dr. Kris Luyten</i>{" "}
          </p>
          <p>
            Dataset used: Accident Database of planes from{" "}
            <a href="planecrashinfo.com/database.htm">
              planecrashinfo.com/database.htm
            </a>
          </p>
        </Details>

        <Credits>Created by: Joris Bertram, Joep Stevens, Pieter Thomis</Credits>
      </InnerWrapper>
    </Wrapper>
  );
}

export default AboutPage;
