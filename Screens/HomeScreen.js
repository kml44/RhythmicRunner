import * as DocumentPicker from "expo-document-picker"
import {useCallback, useState} from "react";
import * as ExpoFileSystem from 'expo-file-system'
import {Box, Button, Flex} from "native-base";

export default () => {
    const [fileResponse, setFileResponse] = useState([]);

    const handleDocumentSelection = async () => {
        let result = await DocumentPicker.getDocumentAsync({});

        const uri = result.assets[0].uri

        const fileContent = await ExpoFileSystem.readAsStringAsync(uri);
        console.log(fileContent)
    }

    return (

        <Flex direction={"row"} justifyContent={"center"}>
            <Button onPress={handleDocumentSelection}>Select
                gpx file📑</Button>

        </Flex>

    );

}

