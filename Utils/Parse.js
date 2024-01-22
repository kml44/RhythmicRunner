const {DOMParser} = require("xmldom");

export function parse(fileContent) {
    const parser = new DOMParser();

    const xmlDoc = parser.parseFromString(fileContent, "application/xml");

    const trackPoints = xmlDoc.documentElement.getElementsByTagName("trkpt");
    let temp_points = []
    for (let i = 0; i < trackPoints.length; i++) {
        const trkpt = trackPoints[i];
        const lat = trkpt.getAttribute("lat");
        const lon = trkpt.getAttribute("lon");
        const ele = trkpt.getElementsByTagName("ele")[0];
        const elev = ele ? ele.textContent : "N/A";
        let point = {lat: lat, lon: lon, ele: elev};

        temp_points.push(convertStringsToNumbers(point))
    }


    return temp_points
}

function convertStringsToNumbers(obj) {
    for (let key in obj) {
        if (!isNaN(parseFloat(obj[key])) && isFinite(obj[key])) {
            obj[key] = parseFloat(obj[key]);
        }
    }
    return obj;
}