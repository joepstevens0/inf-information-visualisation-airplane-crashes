import { useEffect, useRef, useState } from "react";
import PlaneCrash from "../../types/planecrash";
// @ts-ignore
import chroma from "chroma-js";

import {
  ChildListWrapper,
  ChildWrapper,
  LocationElement,
  LocationWrapper,
  SearchWrapper,
  SearchInput,
  SunburstRightWrapper,
  SunburstLeftWrapper,
  SunburstWrapper,
  Wrapper,
} from "./sunburst.styles";

import Sunburst from "sunburst-chart";
import { createTree, SunburstElement, treeDepth } from "./sunburst.tree";
import ColorScale from "./colorscale";

const ELEMENT_MAX_COLOR = 0x4a98b8;
const ELEMENT_MIN_COLOR = 0xc2dce7;

export default function SunburstPlot(props: {
  crashdata: PlaneCrash[] | undefined;
  onSelect: (id: number | undefined) => void;
  selectedCrash: PlaneCrash | undefined;
}) {
  const html_root = useRef(null as HTMLDivElement | null);
  const [chart] = useState(Sunburst());
  const [focusEl, setFocusEl] = useState(null as SunburstElement | null);
  const [childSearch, setChildSearch] = useState<string>("");

  const setFocus = (el: SunburstElement) => {
    chart.focusOnNode(el);
    setFocusEl(el);

    // reset searchs
    setChildSearch("");
  };

  // calc max shown value for a root
  const calc_max_value = (root: SunburstElement | null): number => {
    if (!root) return 0;

    let max_value = 0;

    // if root has parent, parent is shown and thus max value
    if (root.parent) max_value = root.value;
    // calc max value in children
    else
      root.children?.forEach((child: SunburstElement) => {
        max_value = Math.max(max_value, child.value);
      });
    return max_value;
  };

  // create tree on change of data
  useEffect(() => {
    if (props.crashdata === undefined) return;
    if (html_root.current) {
      // remove last sunburst
      html_root.current.replaceChildren();

      // create tree
      const root = createTree(props.crashdata);
      const max_depth = treeDepth(root);
      let max_value = calc_max_value(root);

      // update chart data
      chart.excludeRoot(true);
      chart.color((el) =>
        elementColor(
          el as SunburstElement,
          max_depth,
          max_value,
          isSelected(props.selectedCrash, el as SunburstElement)
        )
      );
      chart.tooltipContent((el) => toolTip(el as SunburstElement));
      chart.onClick((el) => {
        if (el) onClick(el as SunburstElement, setFocus, props.onSelect);
      });
      chart.size((el) => sliceSize(el as SunburstElement));
      chart.width(1000);
      chart.centerRadius(0.1);
      chart.data(root)(html_root.current);

      // focus on root
      setFocus(root);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chart, props.crashdata, html_root]);

  // update color function on selection update
  useEffect(() => {
    if (focusEl === null) return;
    const max_depth = treeDepth(focusEl);
    let max_value = calc_max_value(focusEl);
    chart.color((el) =>
      elementColor(
        el as SunburstElement,
        max_depth,
        max_value,
        isSelected(props.selectedCrash, el as SunburstElement)
      )
    );
  }, [props.crashdata, props.selectedCrash?.id, focusEl, chart]);

  if (props.crashdata === undefined) return <div> Loading...</div>;

  // create child list of current focussed element
  const childList: JSX.Element[] = [];

  if (focusEl) {
    // sort from most to least
    const children = focusEl.children
      .filter((e: SunburstElement) => {
        // do not show crashes
        if (e.crash) return undefined;
        // name filter
        if (!e.name.toLowerCase().includes(childSearch.toLocaleLowerCase()))
          return undefined;
        return e;
      })
      .sort((e1: SunburstElement, e2: SunburstElement): number => {
        return e2.value - e1.value;
      });

    // add children
    children.forEach((child: SunburstElement, index: number) => {
      childList.push(
        <ChildWrapper
          onClick={() => {
            setFocus(child);
          }}
          key={index}
        >
          {child.name}
          <br />
          {child.value}
        </ChildWrapper>
      );
    });
  }

  // create location for focus element
  let el: SunburstElement | null = focusEl;
  const location_elements: JSX.Element[] = [];
  let index: number = 0;
  while (el) {
    let el_copy = el;
    location_elements.push(
      <LocationElement
        onClick={() => {
          setFocus(el_copy);
        }}
        key={index}
      >
        {"->"} {el.name}
      </LocationElement>
    );
    index += 1;
    el = el.parent;
  }
  location_elements.reverse();

  // calc max value for color scale
  let max_value = calc_max_value(focusEl);

  return (
    <Wrapper>
      <SunburstLeftWrapper>
        <LocationWrapper>{location_elements}</LocationWrapper>
        <SearchWrapper>
          {focusEl && focusEl.children.length > 1
            ? [
                <div key="0">Search:</div>,
                <SearchInput
                  key="1"
                  type="text"
                  name="name"
                  value={childSearch}
                  onChange={(e) => setChildSearch(e.target.value)}
                ></SearchInput>,
              ]
            : null}
        </SearchWrapper>
        <ChildListWrapper>{childList}</ChildListWrapper>
      </SunburstLeftWrapper>
      <SunburstRightWrapper>
        <SunburstWrapper ref={html_root} />
        <ColorScale
          max_color={"#" + ELEMENT_MAX_COLOR.toString(16)}
          min_color={"#" + ELEMENT_MIN_COLOR.toString(16)}
          min_value={0}
          max_value={max_value}
        />
      </SunburstRightWrapper>
    </Wrapper>
  );
}

function sliceSize(el: SunburstElement) {
  return "1";
}

function onClick(
  el: SunburstElement,
  setFocus: (el: SunburstElement) => void,
  onSelect: (id: number | undefined) => void
) {
  if (el.crash) onSelect(el.crash.id);
  else setFocus(el);
}

function toolTip(el: SunburstElement): string {
  return "Total: " + el.value;
}
function elementColor(
  el: SunburstElement,
  max_depth: number,
  max_value: number,
  isSelected: boolean
): string {
  if (el.crash && isSelected) return "#FF6384";
  if (el.crash) return "#FFDD8E";

  // return to parent button always black
  if (el.value > max_value) return "#000000";

  // Create color scale
  const f = chroma.scale([ELEMENT_MAX_COLOR, ELEMENT_MIN_COLOR]);

  // Calculate ratio based on element value
  let ratio = Math.max(0, 1 - el.value / max_value);

  return f(ratio);
}

// test if sunburst element is selected
function isSelected(
  selectedCrash: PlaneCrash | undefined,
  el: SunburstElement
): boolean {
  if (selectedCrash === undefined) return false;

  return selectedCrash === el.crash;
}
