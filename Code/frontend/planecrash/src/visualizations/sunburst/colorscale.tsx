import { Label, Scale, Wrapper } from "./colorscale.styles";

export default function ColorScale(props: {
    max_color: String;
    min_color: String;
    max_value: number;
    min_value: number;
}) {

    const labels: JSX.Element[] = [];

    const range = props.max_value - props.min_value;
    const step_size = Math.ceil((range) / 5);

    for (let i = props.min_value; i < props.max_value; i += step_size) {
        labels.push(
            <Label key={i} style={{ bottom: 100*(i-props.min_value)/range + "%" }}>
                {i}
            </Label>
        );
    }

    // always add top label
    labels.push(
        <Label key={props.max_value} style={{ bottom: "100%" }}>
            {props.max_value}
        </Label>
    );

    return (
        <Wrapper>
            Amount of crashes
            <Scale
                style={{
                    background:
                        "linear-gradient(0deg, " +
                        props.min_color +
                        " 0%, " +
                        props.max_color +
                        " 100%)",
                }}
            >
                {labels}
            </Scale>
        </Wrapper>
    );
}
