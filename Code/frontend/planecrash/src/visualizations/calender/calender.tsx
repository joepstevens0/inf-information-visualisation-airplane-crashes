import { useState, useEffect } from "react";
import { ResponsiveCalendar, ResponsiveCalendarCanvas } from "@nivo/calendar";
import PlaneCrash from "../../types/planecrash";
import {Wrapper, WrapperToolTip} from "./calender.styles";
import { GlobalStyle } from "../../global.styles";

const Months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const DaysInMonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

type CalanderType = {
  value: number | undefined;
  day: string;
};

function CalenderGraph(props: { crashdata: PlaneCrash[] | undefined }) {
  const [plotData, setData] = useState(undefined as CalanderType[] | undefined);

  useEffect(() => {
    if (props.crashdata !== undefined) {
      setData(MakeCalanderSummary(props.crashdata));
    }
  }, [props.crashdata]);

  const plot = (
    <ResponsiveCalendar
      // @ts-ignore
      data={plotData === undefined ? [] : plotData}
      from="2004-01-01"
      to="2004-12-31"
      emptyColor="#ededed"
      direction="horizontal"
      monthBorderColor="#000000"
      monthLegendOffset={10}  
      minValue={0}
      tooltip={CustomToolTip}
      yearLegend={yearLegend}
      legends={[
        {
            anchor: 'bottom-right',
            direction: 'row',
            translateY: 0,
            itemCount: 4,
            itemWidth: 42,
            itemHeight: 36,
            itemsSpacing: 10,
            itemDirection: 'right-to-left'
        }
    ]}
	theme={{
		fontSize: 14,
	}}
    />
  );

  return (
    <Wrapper>
      <GlobalStyle />
      {plot}
    </Wrapper>
  );
}


//Problem around feb 29
let MakeCalanderSummary = (data: PlaneCrash[]): CalanderType[] => {
  let calanderValue: number[] = new Array<number>(367).fill(0);
  let calander: CalanderType[] = [];

  for (let i = 0; i < data.length; ++i) {
    if (data[i].time) {
      if(data[i].time?.getMonth() === 1){
        console.log(data[i].time)
      }
      const day = DayOfYear(data[i].time!.toDateString());

      calanderValue[day] += 1;
    }
  }

  for (let i = 0; i < calanderValue.length; i++) {
      calander.push({ value: calanderValue[i], day: MonthDayfromDay(i) });
  }
  return calander;
};

const DayOfYear = (data: string): number => {
  let dayNumber = 0;

  const monthsplit = data.split(" ", 3);
  let numberOfMonth = Months.indexOf(monthsplit[1]);
  if(numberOfMonth === 1){
    console.log(monthsplit);
  }
  for (let i = 0; i < numberOfMonth; i++) {
    dayNumber += DaysInMonth[i];
  }
  dayNumber += +monthsplit[2];
  return dayNumber;
};

const MonthDayfromDay = (dayValue: number): string => {
  let monthCounter = 0;
  while (dayValue > DaysInMonth[monthCounter]) {
    dayValue -= DaysInMonth[monthCounter];
    monthCounter += 1;
  }
  monthCounter += 1;


  let monthString = monthCounter.toString();
  if (monthString.length < 2) {
    monthString = "0" + monthString;
  }
  let dayString = dayValue.toString();
  if (dayString.length < 2) {
    dayString = "0" + dayString;
  }

  return "2004-" + monthString + "-" + dayString;
};

function CustomToolTip(data: any){
  let datum = data.day.replace("2004-", "");
  return (
      <WrapperToolTip>
        date: {datum}
        <br/>
        value: {data.value}
      </WrapperToolTip>
  )
}

function yearLegend(year: number) {

  return "";
}


export default CalenderGraph;
