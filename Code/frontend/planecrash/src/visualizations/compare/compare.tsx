import PlaneCrash from "../../types/planecrash";
import {Wrapper, Compare1, Compare2,} from "./compare.styles";
import FilterOptions from "../filter/Filter";
import {useState} from "react";
import Planecrash from "../../types/planecrash";
import ScatterPlot from "../scatterplot/scatterplot";
import CalenderGraph from "../calender/calender";
import StatDisplay from "../statdisplay/statdisplay";

function CompareGraph(props: {crashdata: PlaneCrash[]}){
    const [DataPart1, setDataPart1] = useState<Planecrash[] |undefined>(props.crashdata);
    const [DataPart2, setDataPart2] = useState<Planecrash[] |undefined>(props.crashdata);

    //Problem multiple scatterplots only showing one
    //TODO fix fucking lay out  (side by side or bottom-top?)
    return(
        <Wrapper>
            <Compare1>
                <StatDisplay crashdata={DataPart1}/>
                <ScatterPlot crashdata={DataPart1} onSelect={dummyfunction} selectedCrash={undefined}/>
                <CalenderGraph crashdata={DataPart1}/>
                <FilterOptions crashdata={props.crashdata} setFilteredData={setDataPart1}/>
            </Compare1>



            <Compare2>
                <StatDisplay crashdata={DataPart2}/>
                {<ScatterPlot crashdata={DataPart2} onSelect={dummyfunction} selectedCrash={undefined}/>}
                <CalenderGraph crashdata={DataPart2}/>
                <FilterOptions crashdata={props.crashdata} setFilteredData={setDataPart2}/>
            </Compare2>
        </Wrapper>
    )

}

function dummyfunction() {

}

export default CompareGraph;