import * as THREE from "three"

// Class Definition
class AstronomicalObject {
    constructor(name, semiMajorAxis, eccentricity, inclination, longitudeAscendingNode, longitudePerihelion, color, radius) {
        this.name = name;
        this.a = semiMajorAxis;  // Semi-major axis (a)
        this.e = eccentricity;      // Eccentricity (e)
        this.i = inclination;        // Inclination (i)
        this.longitudeAscendingNode = longitudeAscendingNode;  // Longitude of ascending node
        this.longitudePerihelion = longitudePerihelion;      // Argument of perihelion
        this.color = color;                    // Color
        this.radius = radius

        const geometryPlanet = new THREE.SphereGeometry(0.1, 16, 16);
        const materialPlanet = new THREE.MeshBasicMaterial({ color: this.color });
        this.mesh = new THREE.Mesh(geometryPlanet, materialPlanet);
    }

    getObjectPosition(t) { 
        const a = this.a; // semiMajorAxis
        const e = this.e; // eccentricity
        const i = THREE.MathUtils.degToRad(this.i); // inclinaison
        const longitudeAscendingNode = THREE.MathUtils.degToRad(this.longitudeAscendingNode); 
        const longitudePerihelion = THREE.MathUtils.degToRad(this.longitudePerihelion); 
        const argumentPerihapsis = longitudePerihelion - longitudeAscendingNode;
        // mean anomaly (M = n * t, avec n = √(GM/a³))
        const n = Math.sqrt(1 / Math.pow(a, 3)); // ici G et M sont normalisés pour un système solaire
        const meanAnomaly = n * t; // mean anomaly
    
        // Solve true anomaly 
        let E = meanAnomaly; // Eccentric anomaly
        for (let j = 0; j < 10; j++) { // itérer pour converger vers E
            E = meanAnomaly + e * Math.sin(E);
        }
        const trueAnomaly = 2 * Math.atan2(Math.sqrt(1 + e) * Math.sin(E / 2), Math.sqrt(1 - e) * Math.cos(E / 2)); // true anomaly
    
        // Calculate radial distance
        const r = (a * (1 - e * e)) / (1 + e * Math.cos(trueAnomaly));
    
        // calculate coordinate x, y, z
        const x = r * (Math.cos(argumentPerihapsis + trueAnomaly) * Math.cos(longitudeAscendingNode) - Math.cos(i) * Math.sin(argumentPerihapsis + trueAnomaly) * Math.sin(longitudeAscendingNode));
        const y = r * (Math.cos(argumentPerihapsis + trueAnomaly) * Math.sin(longitudeAscendingNode) + Math.cos(i) * Math.sin(argumentPerihapsis + trueAnomaly) * Math.cos(longitudeAscendingNode));
        const z = r * (Math.sin(trueAnomaly + argumentPerihapsis) * Math.sin(i));
    
        return { x, y, z };
    }

    getObjectMesh() {
        return this.mesh;
    }
}

// Creating planets as an array of AstronomicalObject instances
export const planets = [
    new AstronomicalObject("Mercury", 0.387098,  0.20563,   7.00497902, 48.33076593, 29.124, 0xffbf00, 2439.7),
    new AstronomicalObject("Venus",    0.723332,   0.006772,   3.39467605,  76.67984255,   54.884,    0x0000ff, 6051.8),
    new AstronomicalObject("Earth",    1.0,        0.0167086,  7.155,       -11.26064,     114.2078,  0x00ff40, 6378),
    new AstronomicalObject("Mars",     1.523679,   0.0934,     1.84969142,  49.55953891,   286.502,   0xff0000,3389.5),
    new AstronomicalObject("Jupiter",  5.2044,     0.0489,     1.30439695,  100.47390909,  273.867,   0x8000ff, 69911),
    new AstronomicalObject("Saturn",   9.5826,     0.0565,     2.48599187,  113.66242448,  339.392,   0xff00ff, 58232),
    new AstronomicalObject("Uranus",   19.2184,    0.046381,   0.77263783,  74.01692503,   96.99886,  0x00ffff, 25362),
    new AstronomicalObject("Neptune",  30.110387,  0.009456,   1.77004347,  131.78422574,  276.336,   0x80ff00, 24397)
];

const jsonUrl = 'https://data.nasa.gov/resource/b67r-rgxc.json';

// Fetching near-Earth objects and creating AstronomicalObject instances
export const nearEarthObject = (async () => {
    try {
        const response = await fetch(jsonUrl);
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }

        const jsonData = await response.json();
        
        // Creating a list of AstronomicalObject instances from the fetched data
        const objects = jsonData.map(obj => {
            const semiMajorAxis = (parseFloat(obj.q_au_1) + parseFloat(obj.q_au_2)) / 2; // Average of q_au_1 and q_au_2
            return new AstronomicalObject(
                obj.object_name || obj.object,  // Name of the object
                semiMajorAxis,                   // Semi-major axis (a)
                parseFloat(obj.e),               // Eccentricity (e)
                parseFloat(obj.i_deg),           // Inclination (i)
                parseFloat(obj.node_deg),        // Longitude of ascending node
                parseFloat(obj.w_deg),           // Argument of perihelion
                0xffffff * Math.random()         // Random color
            );
        });

        return objects; // Return the array of AstronomicalObject instances
    } catch (error) {
        console.error('Error fetching the JSON file:', error);
        return null; // Return null in case of an error
    }
})();

// function transformToAstronomicalObjectArray(arr) {
//     return arr.map(item => new AstronomicalObject(
//         item.name || "Unknown",
//         item.semiMajorAxis || 0,
//         item.eccentricity || 0,
//         item.inclination || 0,
//         item.longitudeAscendingNode || 0,
//         item.longitudePerihelion || 0,
//         item.color || 0xffffff, // Default color white
//         item.radius || 1 // Default radius
//     ));
// }

// transformToAstronomicalObjectArray(nearEarthObject)
    
// });