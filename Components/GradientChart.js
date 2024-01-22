import {BarChart} from "react-native-gifted-charts";

export default function (props) {
    return (
        <BarChart
            data={props.chartData}
            barWidth={22}
            noOfSections={3}
            barBorderRadius={4}
            frontColor="lightgray"
            yAxisThickness={0}
            xAxisThickness={0}
        />
    );
}