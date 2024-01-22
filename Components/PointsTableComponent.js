import React from "react";
import PointComponent from "./PointComponent";
import {Flex, ScrollView} from "native-base";

export default function (params) {

    return (<Flex direction={"column"} w={'100%'} justifyContent={"center"} wrap={"wrap"}>
            {params.points?.map((point, index) => {
                return (<ScrollView w={'100%'} key={index}>
                    <PointComponent  point={point}></PointComponent>
                </ScrollView>)
            })}
    </Flex>
    )
}