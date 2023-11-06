import PlaneCrash, {
  getTotalAboard,
  getTotalAboardFatalities,
  getTotalFatalities,
} from "../../types/planecrash";
import {
  StatElement,
  StatLabel,
  StatNumber,
  Wrapper,
} from "./statdisplay.styles";
import { GlobalStyle } from "../../global.styles";

export default function StatDisplay(props: {
  crashdata: PlaneCrash[] | undefined;
}) {
  let total_crashes: string | number = "?";
  let total_deaths: number = 0;
  let death_chance: string | number = "?";
  let total_actypes: string | number = "?";
  let worst_month: string = "?";
  let worst_year: string = "?";

  if (props.crashdata !== undefined) {
    // calc total crashes
    total_crashes = props.crashdata.length;

    // calc total deaths
    props.crashdata.forEach((crash: PlaneCrash) => {
      total_deaths += getTotalFatalities(crash);
    });

    // calc death chance on crash
    let deaths_aboard = 0;
    let total_passengers = 0;
    props.crashdata.forEach((crash: PlaneCrash) => {
      deaths_aboard += getTotalAboardFatalities(crash);
    });
    props.crashdata.forEach((crash: PlaneCrash) => {
      total_passengers += getTotalAboard(crash);
    });
    death_chance = ((100 * deaths_aboard) / total_passengers).toFixed(4);

    // calc total actypes
    const unique_acs: string[] = [];
    props.crashdata.forEach((crash: PlaneCrash) => {
      if (!unique_acs.includes(crash.actype)) {
        unique_acs.push(crash.actype);
      }
    });
    total_actypes = unique_acs.length;

    // calc most active day
    // first calc per day totals
    const month_total = new Array(12).fill(0);
    const year_total = new Array(113).fill(0);
    props.crashdata.forEach((crash: PlaneCrash) => {
      if (crash.time) {
        month_total[crash.time.getMonth()]+= 1;
        let yearTemp = crash.time.getFullYear()-1908;
        year_total[yearTemp]+=1;
      }
    });
    // find the worst day
    let worst_month_index = 0;
    worst_month_index = month_total.indexOf(Math.max(...month_total));
    const month_strings = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    worst_month = month_strings[worst_month_index];
    
    let worst_year_index = 0;
    worst_year_index = year_total.indexOf(Math.max(...year_total));
    worst_year = (1908+worst_year_index).toString();

    
  }

  return (
    <Wrapper>
      <GlobalStyle />
      <StatElement>
        <StatLabel>Total crashes</StatLabel>
        <StatNumber>{total_crashes}</StatNumber>
      </StatElement>

      <StatElement>
        <StatLabel>Total deaths</StatLabel>
        <StatNumber>{total_deaths}</StatNumber>
      </StatElement>

      <StatElement>
        <StatLabel>Aboard death chance</StatLabel>
        <StatNumber>{death_chance}%</StatNumber>
      </StatElement>

      <StatElement>
        <StatLabel>Types of planes</StatLabel>
        <StatNumber>{total_actypes}</StatNumber>
      </StatElement>

      <StatElement>
        <StatLabel>Most crashed month</StatLabel>
        <StatNumber>{worst_month}</StatNumber>
      </StatElement>

      <StatElement>
        <StatLabel>Most crashed year</StatLabel>
        <StatNumber>{worst_year}</StatNumber>
      </StatElement>
    </Wrapper>
  );
}
