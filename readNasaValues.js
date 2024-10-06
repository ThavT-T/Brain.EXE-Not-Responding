import * as THREE from "three"

// Class Definition
class AstronomicalObject {
    constructor(name, semiMajorAxis, eccentricity, inclination, longitudeAscendingNode, longitudePerihelion, color, radius, info, texture, doOrbit) {
        this.name = name;
        this.a = semiMajorAxis;  // Semi-major axis (a)
        this.e = eccentricity;   // Eccentricity (e)
        this.i = inclination;    // Inclination (i)
        this.longitudeAscendingNode = longitudeAscendingNode;  // Longitude of ascending node
        this.longitudePerihelion = longitudePerihelion;        // Argument of perihelion
        this.color = color;      // Color
        this.radius = radius
        this.doOrbit = doOrbit

        const geometryPlanet = new THREE.SphereGeometry(this.radius / 6378 * 0.1, 16, 16);
        // const materialPlanet = new THREE.MeshBasicMaterial({ color: this.color });
        const texturePlanet = new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load(texture) } );
        this.mesh = new THREE.Mesh(geometryPlanet, texturePlanet);
        this.mesh.material.side = THREE.DoubleSide;
        this.info = info;
    }

    getObjectPosition(t) { 
        const a = this.a; // semiMajorAxis
        const e = this.e; // eccentricity
        // mean anomaly (M = n * t, avec n = √(GM/a³))
        const n = Math.sqrt(1 / Math.pow(a, 3)); // ici G et M sont normalisés pour un système solaire
        const meanAnomaly = n * t; // mean anomaly
    
        // Solve true anomaly 
        let E = meanAnomaly; // Eccentric anomaly
        for (let j = 0; j < 10; j++) { // itérer pour converger vers E
            E = meanAnomaly + e * Math.sin(E);
        }
        const trueAnomaly = 2 * Math.atan2(Math.sqrt(1 + e) * Math.sin(E / 2), Math.sqrt(1 - e) * Math.cos(E / 2)); // true anomaly

        return this.propagate(trueAnomaly);
    }

    propagate(trueAnomaly) {
        const a = this.a; // semiMajorAxis
        const e = this.e; // eccentricity
        const i = THREE.MathUtils.degToRad(this.i); // inclinaison
        const longitudeAscendingNode = THREE.MathUtils.degToRad(this.longitudeAscendingNode); 
        const longitudePerihelion = THREE.MathUtils.degToRad(this.longitudePerihelion); 
        const argumentPerihapsis = longitudePerihelion - longitudeAscendingNode;
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

export const planets = [
    new AstronomicalObject("Mercury",  0.387098,   0.20563,    7.00497902,  48.33076593,   29.124,    0xffbf00, 2439.7, "Closest planet of the sun. Diameter at its equator = 4 878 km. Average distance from the sun = 58M of km (0,39 UA). Complete rotation on its axis = 58 days 16 hours. Orbit around the Sun = 88 days. Moons: 0", "textures/Mercury.jpg"),
    new AstronomicalObject("Venus",    0.723332,   0.006772,   3.39467605,  76.67984255,   54.884,    0x0000ff, 6051.8, "Brightest object in the Earth sky after the Sun and the moon. Diameter at its equator = 12 104 km. Average distance from the sun = 108M of km (0,72 UA). Complete rotation on its axis = 243 days. Orbit around the Sun = 224,7 days. Moons: 0", "textures/Venus.png"),
    new AstronomicalObject("Earth",    1.0,        0.0167086,  7.155,       -11.26064,     114.2078,  0x00ff40, 6378,   "As far as we know Earth is the only hospitable planet for life in our solar system. Diameter at its equator = 12 756 km. Average distance from the sun = 149,6M of km (1 UA). Complete rotation on its axis = 23 hours 56 minutes. Orbit around the Sun = 365 days 1/4. Moons: 1", "textures/Earth.jpg"),
    new AstronomicalObject("Mars",     1.523679,   0.0934,     1.84969142,  49.55953891,   286.502,   0xff0000, 3389.5, "Also known as the Red planet, Mars has a lot of colors at its surface due to oxidization. Diameter at its equator = 6 794 km. Average distance from the sun = 228M of km (1,5 UA). Complete rotation on its axis = 24 hours 37 minutes. Orbit around the Sun = 687 days. Moons: 2", "textures/Mars.png"),
    new AstronomicalObject("Jupiter",  5.2044,     0.0489,     1.30439695,  100.47390909,  273.867,   0x8000ff, 69911,  "It’s the largest planet in our solar system, Jupiter is a gas giant. Diameter at its equator = 143 000 km. Average distance from the sun = 778M of km (5,2 UA). Complete rotation on its axis = 9 hours 55 minutes. Orbit around the Sun = 11,9 years. Moons: 79", "textures/Jupiter.jpg"),
    new AstronomicalObject("Saturn",   9.5826,     0.0565,     2.48599187,  113.66242448,  339.392,   0xff00ff, 58232,  "Saturn has the most complex and spectacular rings of our solar system. Diameter at its equator = 140 000 km. Average distance from the sun = 1 427M of km (9,5 UA). Complete rotation on its axis = 10 hours 33 minutes. Orbit around the Sun = 29,5 years. Moons: 62", "textures/Saturn.jpg"),
    new AstronomicalObject("Uranus",   19.2184,    0.046381,   0.77263783,  74.01692503,   96.99886,  0x00ffff, 25362,  "Uranus is a ice giant. Diameter at its equator = 51 100 km. Average distance from the sun = 2 870M of km (19,2 UA). Complete rotation on its axis = 17 hours 14 minutes. Orbit around the Sun = 84 years. Moons: 27", "textures/Uranus.jpg"),
    new AstronomicalObject("Neptune",  30.110387,  0.009456,   1.77004347,  131.78422574,  276.336,   0x80ff00, 24397,  "The most distant planet of the Sun, it’s also an ice giant, it’s the only planet not visible to the naked eye in the earth sky. Diameter at its equator = 49 500  km. Average distance from the sun = 4 497M of km (30,1 UA). Complete rotation on its axis = 16 hours 7 minutes. Orbit around the Sun = 165 years days. Moons: 14", "textures/Neptune.jpg")

];


const jsonUrl = 'https://data.nasa.gov/resource/b67r-rgxc.json';

// Function to fetch and return near-Earth objects
export const getNearEarthObjects = () => {
    return fetch(jsonUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json(); 
        })
        .then(jsonData => {
            const objects = jsonData.map(obj => {
                const semiMajorAxis = (parseFloat(obj.q_au_1) + parseFloat(obj.q_au_2)) / 2; // Average
                return new AstronomicalObject(
                    obj.object_name || obj.object,
                    semiMajorAxis,
                    parseFloat(obj.e),
                    parseFloat(obj.i_deg),
                    parseFloat(obj.node_deg),
                    parseFloat(obj.w_deg),
                    0xffffff * Math.random()
                );
            });
            return objects;
        })
        .catch(error => {
            console.error('Error fetching the JSON file:', error);
            return null; 
        });
};

//var csv is the CSV file with headers
function csvJSON(csv){

    var lines=csv.split("\n");
  
    var result = [];
  
    // NOTE: If your columns contain commas in their values, you'll need
    // to deal with those before doing the next step 
    // (you might convert them to &&& or something, then covert them back later)
    // jsfiddle showing the issue https://jsfiddle.net/
    var headers=lines[0].split(",");
  
    for(var i=1;i<lines.length;i++){
  
        var obj = {};
        var currentline=lines[i].split(",");
  
        for(var j=0;j<headers.length;j++){
            obj[headers[j]] = currentline[j];
        }
  
        result.push(obj);
  
    }
  
    //return result; //JavaScript object
    return JSON.stringify(result); //JSON
  }