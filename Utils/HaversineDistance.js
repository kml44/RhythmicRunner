import haversine from 'haversine-distance';

export function distance(routeData) {
    for (let i = 1; i < routeData.length; i++) {
        const start = { latitude: routeData[i - 1].lat, longitude: routeData[i - 1].lon };
        const end = { latitude: routeData[i].lat, longitude: routeData[i].lon };

        const segmentDistance = haversine(start, end);
        routeData[i].distance = segmentDistance;
    }
    routeData[0].distance = 0;
}