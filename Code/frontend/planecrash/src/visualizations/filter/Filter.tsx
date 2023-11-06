import { ChangeEvent, useEffect, useState } from "react";
import {
    Wrapper,
    SliderWraper,
    YearSlider,
    FilterPopUp,
    FilterBar,
    FilterPopUpElement,
    PopupButton,
    FilterSummaryInput,
    FilterSummary,
    AircraftSelect,
} from "./Filter.styles";
import PlaneCrash, { getTotalFatalities } from "../../types/planecrash";
import {
    MAX_CRASH_YEAR,
    MIN_CRASH_YEAR,
} from "../../constants/crash_constants";

type Props = {
    crashdata: PlaneCrash[] | undefined;
    setFilteredData: (crashdata: PlaneCrash[] | undefined) => void;
    setSummaryHighlight?: (text: string) => void;
};

const FilterOptions: React.FC<Props> = ({ crashdata, setFilteredData, setSummaryHighlight }) => {
    const MIN_FATALITIES = 0;
    const [max_fatalities, set_max_fatalities] = useState(0);


    const [showPopUp, setShowPopUp] = useState<boolean>(false);

    // filters
    const [yearRange, setYearRange] = useState<number[]>([
        MIN_CRASH_YEAR,
        MAX_CRASH_YEAR,
    ]);
    const [fatalityFilter, setFatalityFilter] = useState<number[]>([MIN_FATALITIES, Number.POSITIVE_INFINITY]);
    const [summaryFilter, setSummaryFilter] = useState<string>("");
    const [aircraftFilter, setAircraftFilter] = useState<string>("");
    const [operatorFilter, setOperatorFilter] = useState<string>("");

    // filter selections
    const [operatorOptions, setOperatorOptions] = useState<[string, number][]>([]);
    const [acOptions, setACOptions] = useState<[string, number][]>([]);

    // calculate new maximum for fatalities and options on data or other filter change
    useEffect(()=>{
        if (crashdata === undefined){
            return;
        }

        // calc filtered data
        let data = apply_year_filter(crashdata);
        data = apply_summary_filter(data);
        data = apply_aircraft_filter(data);
        data = apply_operator_filter(data);

        // calc new max fatalities
        let max = 0;
        data.forEach((crash: PlaneCrash)=>{
            max = Math.max(max, getTotalFatalities(crash));
        });
        set_max_fatalities(max);

    }, [crashdata, yearRange, summaryFilter, aircraftFilter, operatorFilter]);
    useEffect(()=>{
        if (crashdata === undefined){
            return;
        }

        // calc filtered data
        let data = apply_year_filter(crashdata);
        data = apply_summary_filter(data);
        data = apply_fatal_filter(data);
        data = apply_operator_filter(data);

        // calc new options for ac types
        const top_lvl_aircraft_types: Map<string, number> = new Map();
        data.forEach((crash: PlaneCrash)=>{
            const top_lvl_type = crash.actype.split(' ')[0];
            if (top_lvl_type === '') return;
            const amount = top_lvl_aircraft_types.get(top_lvl_type);
            if (amount !== undefined){
                top_lvl_aircraft_types.set(top_lvl_type, amount + 1);
            } else {
                top_lvl_aircraft_types.set(top_lvl_type, 1);
            }
        });
        top_lvl_aircraft_types.set("all", data.length);
        const values = Array.from(top_lvl_aircraft_types.entries());
        // sort types by amount
        values.sort((a: [string, number], b: [string, number]) => b[1]-a[1]);
        setACOptions(values);

    }, [crashdata, yearRange, summaryFilter, operatorFilter, fatalityFilter]);
    useEffect(()=>{
        if (crashdata === undefined){
            return;
        }

        // calc filtered data
        let data = apply_year_filter(crashdata);
        data = apply_summary_filter(data);
        data = apply_fatal_filter(data);
        data = apply_aircraft_filter(data);

        // calc new options for operator
        const top_lvl_operators: Map<string, number> = new Map();
        data.forEach((crash: PlaneCrash)=>{
            const top_lvl_operator = crash.operator;
            if (top_lvl_operator === '') return;
            const amount = top_lvl_operators.get(top_lvl_operator);
            if (amount !== undefined){
                top_lvl_operators.set(top_lvl_operator, amount + 1);
            } else {
                top_lvl_operators.set(top_lvl_operator, 1);
            }
        });
        const operator_values = Array.from(top_lvl_operators.entries());
        // sort operators by amount
        operator_values.sort((a: [string, number], b: [string, number]) => a[0].localeCompare(b[0]));
        operator_values.unshift(["all", data.length]);
        setOperatorOptions(operator_values);

    }, [crashdata, yearRange, summaryFilter, aircraftFilter, fatalityFilter]);

    // reset filter on max change
    useEffect(()=>{
        setFatalityFilter([MIN_FATALITIES, max_fatalities]);
    }, [max_fatalities]);

    const apply_year_filter = (data: PlaneCrash[]): PlaneCrash[] => {
        const max_year = Math.max(yearRange[0], yearRange[1]);
        const min_year = Math.min(yearRange[0], yearRange[1]);
        return data.filter((crash: PlaneCrash) => {
            if (crash.time) {
                const year = crash.time.getFullYear();
                if (year >= min_year && year <= max_year) return crash;
                return undefined;
            }
            return undefined;
        });
    };

    const apply_aircraft_filter = (data: PlaneCrash[]): PlaneCrash[] => {
        if (aircraftFilter === "all") return data;
        return data.filter((crash: PlaneCrash)=>{
            if (crash.actype.startsWith(aircraftFilter)) return crash;
            return undefined;
        });
    };
    const apply_operator_filter = (data: PlaneCrash[]): PlaneCrash[] => {
        if (operatorFilter === "all") return data;
        return data.filter((crash: PlaneCrash)=>{
            if (crash.operator.startsWith(operatorFilter)) return crash;
            return undefined;
        });
    };

    const apply_fatal_filter = (data: PlaneCrash[]): PlaneCrash[] => {
        const max_fatal = Math.max(fatalityFilter[0], fatalityFilter[1]);
        const min_fatal = Math.min(fatalityFilter[0], fatalityFilter[1]);
        return data.filter((crash: PlaneCrash) => {
            if (crash.time) {
                const fatalities = getTotalFatalities(crash);
                if (fatalities >= min_fatal && fatalities <= max_fatal) return crash;
                return undefined;
            }
            return undefined;
        });
    };

    const apply_summary_filter = (data: PlaneCrash[]): PlaneCrash[] => {
        return data.filter((crash: PlaneCrash) => {
            if (
                crash.summary
                    .toLocaleLowerCase()
                    .includes(summaryFilter.toLocaleLowerCase())
            ) {
                return crash;
            }
            return undefined;
        });
    };

    const apply_filters = (data: PlaneCrash[]): PlaneCrash[] => {
        let result = data;
        result = apply_fatal_filter(result);
        result = apply_year_filter(result);
        result = apply_summary_filter(result);
        result = apply_aircraft_filter(result);
        result = apply_operator_filter(result);
        return result;
    };

    useEffect(() => {
        if (crashdata !== undefined) {
            const data = apply_filters(crashdata);
            setFilteredData(data);
        }
    }, [crashdata, fatalityFilter, yearRange, summaryFilter, aircraftFilter, operatorFilter]);

    const updateSummaryFilter = (text: string)=>{
        setSummaryFilter(text);
        if (setSummaryHighlight)
            setSummaryHighlight(text);
    };

    const aircraft_options: JSX.Element[] = [];
    acOptions.forEach((value: [string, number])=>{
        aircraft_options.push(<option key={value[0]} value={value[0]}>{value[0]} ({value[1]})</option>);
    });

    const aircraft_filter_change = (evt: React.ChangeEvent<HTMLSelectElement>)=>{
        setAircraftFilter(evt.target.value);
    };

    const operator_options: JSX.Element[] = [];
    operatorOptions.forEach((value: [string, number])=>{
        operator_options.push(<option key={value[0]} value={value[0]}>{value[0]} ({value[1]})</option>);
    });

    const operator_filter_change = (evt: React.ChangeEvent<HTMLSelectElement>)=>{
        setOperatorFilter(evt.target.value);
    };

    const filter_bar = (
        <FilterBar>
            <SliderWraper>
                <YearSlider
                    min={MIN_CRASH_YEAR}
                    max={MAX_CRASH_YEAR}
                    value={yearRange}
                    onChange={(_, value: number | number[]) => {
                        if (value as number[]) setYearRange(value as number[]);
                    }}
                    valueLabelDisplay="on"
                    step={1}
                />
            </SliderWraper>

            <PopupButton onClick={() => setShowPopUp(!showPopUp)}>
                Filters {showPopUp ? "↓" : "↑"}
            </PopupButton>
        </FilterBar>
    );

    let filter_popup = (
        <FilterPopUp hidden={!showPopUp}>
            <FilterPopUpElement>
            <SliderWraper>
                <YearSlider
                    min={MIN_FATALITIES}
                    max={max_fatalities}
                    value={fatalityFilter}
                    onChange={(_, value: number | number[]) => {
                        if (value as number[]) setFatalityFilter(value as number[]);
                    }}
                    valueLabelDisplay="on"
                    step={1}
                />
                Fatality range
            </SliderWraper>
            </FilterPopUpElement>
            <FilterPopUpElement>
                Aircraft type
                <AircraftSelect onChange={aircraft_filter_change}>
                    {
                        aircraft_options
                    }
                </AircraftSelect>
            </FilterPopUpElement>
            <FilterPopUpElement>
                Operator
                <AircraftSelect onChange={operator_filter_change}>
                    {
                        operator_options
                    }
                </AircraftSelect>
            </FilterPopUpElement>
            <FilterPopUpElement>
                <FilterSummary>
                    <div>Search summary:</div>
                    <FilterSummaryInput
                        type="text"
                        name="name"
                        value={summaryFilter}
                        onChange={(e) => updateSummaryFilter(e.target.value)}
                    ></FilterSummaryInput>
                </FilterSummary>
            </FilterPopUpElement>
        </FilterPopUp>
    );

    return (
        <Wrapper>
            {filter_bar}
            {filter_popup}
        </Wrapper>
    );
};

export default FilterOptions;
