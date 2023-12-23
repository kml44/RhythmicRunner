import * as DocumentPicker from "expo-document-picker"
import {useState} from "react";
import * as ExpoFileSystem from 'expo-file-system'
import {Button, Flex} from "native-base";
import PointsTableComponent from "../Components/PointsTableComponent";

export default () => {
    const [fileResponse, setFileResponse] = useState();

    const handleDocumentSelection = async () => {
        let result = await DocumentPicker.getDocumentAsync({});

        const uri = result.assets[0].uri

        const fileContent = await ExpoFileSystem.readAsStringAsync(uri);
        setFileResponse(fileContent)
    }
    let points = [{lat: 12, lon: 11, elev: 15}, {lat: 12, lon: 11, elev: 15}, {lat: 12, lon: 11, elev: 15}]

    return (<Flex direction={"column"} justifyContent={"center"}>
            <Button onPress={handleDocumentSelection}>Select
                gpx file</Button>
            <PointsTableComponent points={points}/>
        </Flex>

    );

}

