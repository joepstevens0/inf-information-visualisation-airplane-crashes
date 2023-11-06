import { useEffect, useState } from "react";
import PlaneCrash from "../../types/planecrash";
import {
  CrashElement,
  CrashElementDateField,
  CrashElementLocationField,
  CrashElementTypeField,
  CrashElementSummaryField,
  CrashElementYearField,
  CrashListWrapper,
  PageNumberElement,
  PageNumberWrapper,
  Wrapper,
} from "./crashlist.styles";
import { GlobalStyle } from "../../global.styles";

const CRASHES_PER_PAGE = 6;
const MAX_PAGE_NUMBERS = 10;

export default function CrashList(props: {
  crashdata: PlaneCrash[] | undefined;
  onSelect: (id: number | undefined) => void;
  summaryHighlight: string;
  selectedCrash: PlaneCrash | undefined;
}) {
  const crash_elements: JSX.Element[] = [];
  const [pageNumber, setPageNumber] = useState(0);

  // convert 1 digits to 2 digits
  const convert_to_two_digits = (
    digit: number | undefined
  ): String | undefined => {
    let two_digit;
    const digit_str = digit?.toString();
    const digit_length = digit_str?.length;
    if (digit_length !== undefined && digit_length > 1) {
      two_digit = digit_str;
    } else {
      two_digit = "0" + digit_str;
    }
    return two_digit;
  };

  const createSummaryElement = (summaryText: string) => {
      // Split on highlight
      const parts = summaryText.split(new RegExp(`(${props.summaryHighlight})`, 'gi'));
      return (
        <span> 
          { 
          parts.map((part, i): JSX.Element | string => {
            if (part.toLowerCase() === props.summaryHighlight.toLowerCase())
              return <mark>{part}</mark>;
          return part;
            }
          )
          }
        </span>
      );
  }

  // set page number to 0 on data change
  useEffect(() => {
    setPageNumber(0);
  }, [props.crashdata]);

  // create crash card elements
  if (props.crashdata !== undefined) {
    const start_index = pageNumber * CRASHES_PER_PAGE;
    for (
      let i = start_index;
      i < Math.min(props.crashdata.length, start_index + CRASHES_PER_PAGE);
      ++i
    ) {
      const crash = props.crashdata[i];

      let day = convert_to_two_digits(crash.time?.getDate());
      //@ts-ignore
      let month = convert_to_two_digits(crash.time?.getMonth() + 1);
      let year = crash.time?.getFullYear();

      crash_elements.push(
        <CrashElement key={i} onClick={(e) => props.onSelect(crash.id)} unselectable={crash === props.selectedCrash ? "on" : undefined}>
          <CrashElementYearField>{year}</CrashElementYearField>
          <CrashElementDateField>
            {day} / {month}
          </CrashElementDateField>
          <CrashElementLocationField>
            {crash.location}
          </CrashElementLocationField>
          <CrashElementTypeField>{crash.actype}</CrashElementTypeField>
          <CrashElementSummaryField>
            {createSummaryElement(crash.summary)}
          </CrashElementSummaryField>
        </CrashElement>
      );
    }
  }

  const pageNumberElements: JSX.Element[] = [];
  if (props.crashdata) {
    // real last page
    const last_page = Math.ceil(props.crashdata.length / CRASHES_PER_PAGE);

    // first page show
    const first_page_index: number = Math.max(
      0,
      pageNumber - MAX_PAGE_NUMBERS / 2
    );
    // last page shown
    const last_page_index: number = Math.min(
      first_page_index + MAX_PAGE_NUMBERS,
      last_page
    );
    for (let i = first_page_index; i < last_page_index; ++i) {
      let page = i + 1;
      let page_text: number | string = page;

      // first page and last page show are always real first page en last page
      // if not the same, replace text with ...
      if (page === last_page_index) {
        page = last_page;
        if (last_page_index !== last_page) page_text = "...";
      } else if (page - 1 === first_page_index) {
        page = 1;
        if (first_page_index !== 0) page_text = "...";
      }

      // add page elements
      pageNumberElements.push(
        <PageNumberElement
          unselectable={i === pageNumber ? "on" : undefined}
          key={page}
          onClick={(e) => setPageNumber(page - 1)}
        >
          {page_text}
        </PageNumberElement>
      );
    }
  }

  return (
    <Wrapper>
      <GlobalStyle />
      <CrashListWrapper>{crash_elements}</CrashListWrapper>
      <PageNumberWrapper>{pageNumberElements}</PageNumberWrapper>
    </Wrapper>
  );
}
