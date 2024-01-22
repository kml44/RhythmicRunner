import React from "react";
import {Box, Flex, Text} from "native-base";

export default function (props) {
    let lat = props.point.lat;
    let lon = props.point.lon;
    let elev = props.point.ele;

    return (<Flex w={'100%'} p={2} style={{borderStyle: "solid", borderWidth: 1}}>
            <Text p={1}>Lat: {lat} Lon: {lon} Elevation: {elev}</Text>
        </Flex>
    )
}