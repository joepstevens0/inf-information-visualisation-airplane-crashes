import { Chart as ChartJS, TooltipItem, TooltipModel } from "chart.js";
import ReactDOM from "react-dom";
import { ToolTipBody, TooltipCrashData, TooltipCrashElement, TooltipCrashLabel, ToolTipHead, WrapperTooltip } from "./scatterplot.styles";

const TOOLTIP_X_MARGIN = 5;

export const externalTooltipHandler = function (ctx: {
    chart: ChartJS;
    tooltip: TooltipModel<any>;
    resplay: any;
}) {
    // Tooltip Element
    let tooltipEl = document.getElementById("chartjs-tooltip");

    // Create element on first render
    if (!tooltipEl) {
        tooltipEl = document.createElement("div");
        tooltipEl.id = "chartjs-tooltip";
        tooltipEl.innerHTML = "<table></table>";
        document.body.appendChild(tooltipEl);
    }

    // Hide if no tooltip
    const tooltipModel = ctx.tooltip;
    if (tooltipModel.opacity === 0) {
        tooltipEl.style.opacity = "0";
        return;
    }

    // Set caret Position
    tooltipEl.classList.remove("above", "below", "no-transform");
    if (tooltipModel.yAlign) {
        tooltipEl.classList.add(tooltipModel.yAlign);
    } else {
        tooltipEl.classList.add("no-transform");
    }

    // Set html element
    if (tooltipModel.body) {

        // create rows for element
        const rows: JSX.Element[] = [];
        tooltipModel.dataPoints.forEach(function (body: TooltipItem<any>, i: any) {
            const fatalities = body.formattedValue;
            const date = Number(body.label.replaceAll(",", ""));
            rows.push(
                <TooltipCrashElement key={i}>
                    <TooltipCrashLabel>Date</TooltipCrashLabel><TooltipCrashData>{new Date(date).toDateString()}</TooltipCrashData>
                    <TooltipCrashLabel>Fatalities</TooltipCrashLabel><TooltipCrashData>{fatalities}</TooltipCrashData>
                </TooltipCrashElement>
            );
        });

        const innerHtml = (
            <WrapperTooltip>
                <ToolTipHead> Crashes: </ToolTipHead>
                <ToolTipBody>{rows}</ToolTipBody>
 
            </WrapperTooltip>
        );

        // render the element
        ReactDOM.render(innerHtml, tooltipEl);
    }

    const position = ctx.chart.canvas.getBoundingClientRect();

    // Display element
    tooltipEl.style.opacity = "1";

    // set position
    tooltipEl.style.position = "absolute";
    tooltipEl.style.visibility = "visible";
    tooltipEl.style.pointerEvents = "none";
    tooltipEl.style.left =
        TOOLTIP_X_MARGIN + position.left + window.pageXOffset + tooltipModel.caretX + "px";
    
    let top_offset = position.top + window.pageYOffset + tooltipModel.caretY;
    if (top_offset + tooltipEl.clientHeight > window.innerHeight){
        top_offset = window.innerHeight - tooltipEl.clientHeight;
    }
    tooltipEl.style.top = top_offset + "px";

    // hide tooltip on click off window
    const old_onclick = window.onclick;
    window.onclick = (ev: MouseEvent)=>{
        if (old_onclick)
            old_onclick.apply(window, [ev]);
        (tooltipEl as HTMLElement).style.visibility = "hidden";
    };

};
