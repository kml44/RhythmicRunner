import * as DocumentPicker from "expo-document-picker"
import React, {useEffect, useRef, useState} from "react";
import * as ExpoFileSystem from 'expo-file-system'
import {Badge, Button, Flex, ScrollView} from "native-base";
import {parse} from "../Utils/Parse";
import {calculateElevationDiff} from "../Utils/CalculateElevationDiff";
import calculateRouteGradient from "../Utils/CalculateRouteGradient";
import GradientChart from "../Components/GradientChart";
import {client_id, client_secret, redirect_uri} from "../Utils/SpotifyCredentials";
import {WebView} from 'react-native-webview';
import {encode} from 'base-64';
import {findSong, playSong} from "../Utils/SpotifyAPI";
import * as Location from 'expo-location';
import {Accuracy} from "expo-location";
import haversine from "haversine-distance";
import * as HaversineDistance from "../Utils/HaversineDistance";

const {DOMParser} = require("xmldom");

export default ({navigation, route }) => {
    const [chartData, setChartData] = useState();
    const [location, setLocation] = useState([]);
    const [distance, setDistance] = useState(0);
    const [token, setToken] = useState(null);
    const [startedRunning, setStartedRunning] = useState(null);
    let gradients = []
    const tempo = []
    let trackTime = 0;
    let trackDuration = 0;

    const handleDocumentSelection = async () => {
        let result = await DocumentPicker.getDocumentAsync({});
        const uri = result.assets[0].uri
        const fileContent = await ExpoFileSystem.readAsStringAsync(uri);
        let temp_points = parse(fileContent)

        calculateElevationDiff(temp_points)
        HaversineDistance.distance(temp_points)
        const gradient = calculateRouteGradient(temp_points)
        gradients = gradient[1]
        let chartData = gradient[1].map((value, index) => {
            return {value: value, label: gradient[0][index]}
        })
        setChartData(chartData)
        calculateTempo()
    }



    async function getCurrentLocation ()  {

        let {status} = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            console.log('Permission to access location was denied');
            return;
        } else {
            console.log("Success")
        }

        let current_location = await Location.getCurrentPositionAsync({accuracy: Accuracy.Highest});
        console.log(current_location)
        return {latitude: current_location.coords.latitude, longitude: current_location.coords.longitude}
    }

    useEffect(() => {
        console.log("REGISTERED")
        const interval = setInterval(async () => {
            const current_location = await getCurrentLocation();
            setLocation(oldArray => [...oldArray, current_location]);
        }, 5000)
        return () => clearInterval(interval)
    },[]);

    useEffect(() => {
        let temp_distance = 0

        for (let i = 1; i < location.length; i++) {
            const start = { latitude: location[i - 1].latitude, longitude: location[i - 1].longitude };
            const end = { latitude: location[i].latitude, longitude: location[i].longitude };
            temp_distance += haversine(start, end);
        }
        setDistance(temp_distance)
    })

    useEffect(() => {
        if (route.params?.token) {
            setToken(route.params?.token)
            console.log("TOKEN SET")
        }
    }, [route.params?.token]);

    async function handleMusicPlay() {
        /*findSong(140, 150, token).then(song_uri => {
            if (song_uri != null) playSong(song_uri, 5000, token)
        })*/
        await findAndPlaySong(tempo[0])
        setLocation([])
        setStartedRunning(true)
    }

    function calculateTempo() {
        for (let i = 0; i < gradients.length; i++) {
            tempo[i] = 3 * gradients[i] + 150
        }
    }
    const findAndPlaySong = async (targetTempo) => {
        let error = 13;

        let song = null;
        while (!song) {
            const lowerTempo = targetTempo - error;

            const upperTempo = targetTempo + error;

            song = await findSong(lowerTempo, upperTempo, token);
            if (song) {
                playSong(song.uri, 0, token);
                console.log(song.uri);
                trackDuration = song.duration;
            } else {
                error += 1;
            }
        }

    };
    useEffect(() => {
        let interval = null;
        let tempo_index = 0

        if (startedRunning) {
            let nextDistance = 0;


            interval = setInterval(async () => {
                trackTime += 1000;

                tempo_index = distance/1000
                console.log("Checking if next kilometer is reached or if song ended");
                if (distance >= nextDistance || trackTime >= trackDuration) {
                    trackTime = 0;
                    await findAndPlaySong(tempo[Math.floor(distance/1000)]);
                    if (distance >= nextDistance) {
                        nextDistance += 1000; //distance after which next track is played
                    }
                }
            }, 1000);
        }

        return () => clearInterval(interval);
    }, [startedRunning]);

    return (<Flex direction={"column"} justifyContent={"center"} flexGrow={1}>
            <ScrollView h={100}>
                <Button onPress={handleDocumentSelection}>Select gpx file</Button>
                <Button mt={1} onPress={handleMusicPlay}>Find music and start run</Button>

                <ScrollView
                    horizontal={true}
                >
                    {chartData ? <GradientChart chartData={chartData}/> : <></>}
                </ScrollView>

            </ScrollView>
            <Badge colorScheme="warning" alignSelf="start">
                Distance: {distance}
            </Badge>

            <Button mt={1} onPress={() => {
                navigation.navigate('WebView');
            }}>Redirect To WebView</Button>

        </Flex>

    );

}

