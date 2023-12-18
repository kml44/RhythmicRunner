import * as React from 'react';
import {SafeAreaView} from "react-native";
import {NavigationContainer} from "@react-navigation/native";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import HomeScreen from "./Screens/HomeScreen";
import {extendTheme, NativeBaseProvider} from "native-base"; // Optional if you want to use default theme

const Stack = createNativeStackNavigator();


export default function App() {
    const theme = extendTheme({
        colors: {
            // Add new color
            primary: {
                50: '#E3F2F9',
                100: '#C5E4F3',
                200: '#A2D4EC',
                300: '#7AC1E4',
                400: '#47A9DA',
                500: '#0088CC',
                600: '#007AB8',
                700: '#006BA1',
                800: '#005885',
                900: '#003F5E',
            },
            // Redefining only one shade, rest of the color will remain same.
            amber: {
                400: '#d97706',
            },
        },
        config: {
            // Changing initialColorMode to 'dark'
            initialColorMode: 'dark',
        },
    });
    return (<NativeBaseProvider theme={theme}>
            <NavigationContainer>
                <Stack.Navigator>
                    <Stack.Screen name="Home" component={HomeScreen} options={{}}/>
                </Stack.Navigator>
            </NavigationContainer>
        </NativeBaseProvider>
    );
}

