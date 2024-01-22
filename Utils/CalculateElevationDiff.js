export function calculateElevationDiff(routeList) {

    for (let i = 1; i < routeList.length; i++) {
        const currentElevation = routeList[i].ele;
        const prevElevation = routeList[i - 1].ele;
        const elevationDiff = currentElevation - prevElevation;

        routeList[i].elevation_diff = elevationDiff
    }
    routeList[0].elevation_diff = 0


}