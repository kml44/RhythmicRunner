import axios from "axios";

export function playSong(songID, position_ms, token) {
    fetch('https://api.spotify.com/v1/me/player/play', {
        method: 'PUT', headers: {
            Authorization: 'Bearer ' + token,
        }, body: JSON.stringify({
            "uris": [songID], "position_ms": position_ms
        })
    }).then().catch(error => console.error('Error:', error));

}

export async function findSong(min_tempo, max_tempo, token) {
    try {
        const response = await fetch(`https://api.spotify.com/v1/recommendations?limit=1&market=PL&seed_genres=pop&min_tempo=${min_tempo}&max_tempo=${max_tempo}`, {
            method: 'GET', headers: {
                'Authorization': 'Bearer ' + token
            }
        })
        const data = await response.json();

        //console.log(JSON.stringify(data["tracks"][0]["uri"], null, 2));
        return {uri: data["tracks"][0]["uri"], duration: data["tracks"][0]["duration_ms"]}
    } catch (error) {
        return null
    }
}