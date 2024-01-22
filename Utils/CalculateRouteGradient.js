export default function (routeData) {
    let distance = [];
    let avgElev = [];

    let cumElevation = 0;
    let cumDistance = 0;
    let kilometerNo = 0;
    let overall_distance = 0;
    for (let i = 0; i < routeData.length; i++) {
        let dataPoint = routeData[i];
        cumDistance += dataPoint.distance;
        cumElevation += dataPoint.elevation_diff;
        overall_distance += dataPoint.distance;
        if (Math.floor(cumDistance / 1000) > 0) {
            kilometerNo++;
            distance.push(kilometerNo);
            avgElev.push(cumElevation);
            cumElevation = 0;
            cumDistance = 0;
        }
    }
    console.log(overall_distance)
    kilometerNo++;
    distance.push(kilometerNo);
    avgElev.push(cumElevation);

    return ([distance, avgElev])
}