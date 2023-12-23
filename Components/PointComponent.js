import React from "react";
import {Box, Text} from "native-base";

export default function (props) {
    let lat = props.point.lat;
    let lon = props.point.lon;
    let elev = props.point.elev;

    return (<Box style={{borderStyle: "solid", borderWidth: 1}}>
        <Text p={1}>Lat:{lat} Lon:{lon} Elev:{elev}</Text>
        </Box>
    )
}