import React from "react";
import PointComponent from "./PointComponent";
import {Flex} from "native-base";

export default function (params) {

    return (<Flex direction={"column"} justifyContent={"center"} wrap={"wrap"}>
            {params.points.map((point, index) => {
                return (
                    <PointComponent key={index} point={point}></PointComponent>
                )
            })}
    </Flex>
    )
}