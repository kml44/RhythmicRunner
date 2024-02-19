import {WebView} from "react-native-webview";
import React, {useRef, useState} from "react";
import {Button, Flex} from "native-base";
import {client_id, client_secret, redirect_uri} from "../Utils/SpotifyCredentials";
import {encode} from "base-64";

export default ({navigation}) => {
    const webViewRef = useRef(null);
    const [url, setUrl] = useState('https://expo.dev');
    let actualUrl = ''
    const [token, setToken] = useState();

    const getToken = async (code, redirect_uri, client_id, client_secret) => {
        try {
            if (!global.btoa) {
                global.btoa = encode;
            }
            const credsB64 = btoa(`${client_id}:${client_secret}`);
            const response = await fetch('https://accounts.spotify.com/api/token', {
                method: 'POST',
                headers: {
                    Authorization: `Basic ${credsB64}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `grant_type=authorization_code&code=${code}&redirect_uri=${
                    redirect_uri
                }`,
            });
            const responseJson = await response.json();

            const {
                access_token: accessToken,
                refresh_token: refreshToken,
                expires_in: expiresIn,
            } = responseJson;

            const expirationTime = new Date().getTime() + expiresIn * 1000;
            if (accessToken) {
                setToken(accessToken)
                navigation.navigate({
                    name: 'Home',
                    params: { token: accessToken },
                    merge: false,
                });
            }
        } catch (err) {
            console.error(err);
        }
    };

    const parseQueryString = (url) => {
        const queryStart = url.indexOf('?');
        if (queryStart === -1) {
            return {};
        }

        const queryString = url.slice(queryStart + 1);
        const pairs = queryString.split('&');

        const params = {};
        for (const pair of pairs) {
            const [key, value] = pair.split('=');
            params[decodeURIComponent(key)] = decodeURIComponent(value || '');
        }

        return params;
    };

    const getCode = () => {
        let code = null;
        if (actualUrl.length > 0) {
            const queryParams = parseQueryString(actualUrl);
            code = queryParams['code'];
        }
        return code;
    };

    const onNavigationStateChange = navState => {
        actualUrl = navState.url
        if (actualUrl.includes(redirect_uri + "/?code=")) {
            if (getCode().length > 3) {
                getToken(getCode(), redirect_uri, client_id, client_secret).then(r => console.log(r))
            }
        }
    }
    const openWebPage = () => {
        const scope = 'user-read-playback-state user-modify-playback-state';
        const redirect_uri = 'http://localhost:3000'
        const authUrl = `https://accounts.spotify.com/authorize?` + `response_type=code&client_id=${client_id}&scope=${scope}&redirect_uri=${redirect_uri}`;

        setUrl(authUrl)
    };


    function openAnotherUrl() {
        setUrl("www.google.com")
    }
    return (<Flex direction={"column"} justifyContent={"center"} flexGrow={1}>

            <Button onPress={openWebPage}>Spotify</Button>
            <Button onPress={openAnotherUrl}>Google</Button>

            <WebView
                ref={webViewRef}
                source={{uri: url}}
                onLoad={() => console.log('Webview loaded')}
                onNavigationStateChange={onNavigationStateChange.bind(this)}

            />
        </Flex>


    )
}