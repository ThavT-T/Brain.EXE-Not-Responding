// Class Definition
class AstronomicalObject {
    constructor(name, semiMajorAxis, eccentricity, inclination, longitudeAscendingNode, longitudePerihelion, color) {
        this.name = name;
        this.a = semiMajorAxis;  // Semi-major axis (a)
        this.e = eccentricity;      // Eccentricity (e)
        this.i = inclination;        // Inclination (i)
        this.longitudeAscendingNode = longitudeAscendingNode;  // Longitude of ascending node
        this.longitudePerihelion = longitudePerihelion;      // Argument of perihelion
        this.color = color;                    // Color
    }
}

// Creating planets as an array of AstronomicalObject instances
export const planets = [
    new AstronomicalObject("Mercury", 0.387098,  0.20563,   7.00497902, 48.33076593, 29.124, 0xffbf00),
    new AstronomicalObject("Venus",    0.723332,   0.006772,   3.39467605,  76.67984255,   54.884,    0x0000ff),
    new AstronomicalObject("Earth",    1.0,        0.0167086,  7.155,       -11.26064,     114.2078,  0x00ff40),
    new AstronomicalObject("Mars",     1.523679,   0.0934,     1.84969142,  49.55953891,   286.502,   0xff0000),
    new AstronomicalObject("Jupiter",  5.2044,     0.0489,     1.30439695,  100.47390909,  273.867,   0x8000ff),
    new AstronomicalObject("Saturn",   9.5826,     0.0565,     2.48599187,  113.66242448,  339.392,   0xff00ff),
    new AstronomicalObject("Uranus",   19.2184,    0.046381,   0.77263783,  74.01692503,   96.99886,  0x00ffff),
    new AstronomicalObject("Neptune",  30.110387,  0.009456,   1.77004347,  131.78422574,  276.336,   0x80ff00)
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
