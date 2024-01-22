import * as DocumentPicker from "expo-document-picker"
import {useState} from "react";
import * as ExpoFileSystem from 'expo-file-system'
import {Button, Flex, ScrollView} from "native-base";
import PointsTableComponent from "../Components/PointsTableComponent";
import {parse} from "../Utils/Parse";
import {calculateElevationDiff} from "../Utils/CalculateElevationDiff";
import {distance} from "../Utils/HaversineDistance";
import calculateRouteGradient from "../Utils/CalculateRouteGradient";
import GradientChart from "../Components/GradientChart";

const {DOMParser} = require("xmldom");

export default () => {
    const [points, setPoints] = useState();
    const [chartData, setChartData] = useState();

    const handleDocumentSelection = async () => {
        let result = await DocumentPicker.getDocumentAsync({});
        const uri = result.assets[0].uri
        const fileContent = await ExpoFileSystem.readAsStringAsync(uri);
        let temp_points = parse(fileContent)

        calculateElevationDiff(temp_points)
        distance(temp_points)
        const gradient = calculateRouteGradient(temp_points)
        /*        for (const node of temp_points) {
                    console.log(node)
                }*/
        let chartData = gradient[1].map((value, index) => {
            return {value: value, label: gradient[0][index]}
        })
        setPoints(temp_points)
        setChartData(chartData)
    }

    return (<Flex direction={"column"} justifyContent={"center"}>
            <ScrollView><Button onPress={handleDocumentSelection}>Select gpx file</Button>
                {/*
                <PointsTableComponent points={points}/>
*/}
                <ScrollView
                    horizontal={true}
                >
                    <GradientChart chartData={chartData}/>
                </ScrollView>
            </ScrollView>
        </Flex>

    );

}

