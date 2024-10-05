import * as THREE from "three"
import { OrbitControls } from 'three/examples/jsm/Addons.js';


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 100, window.innerWidth / window.innerHeight, 0.1, 1000 ); // how I'm watching things

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight);

document.body.appendChild( renderer.domElement ); //add to the HTML doc

// Creation of the Sun
const geometrySun = new THREE.SphereGeometry(0.2, 32, 32);
const materialSun = new THREE.MeshBasicMaterial({ color: 0xffff00 });
const sun = new THREE.Mesh(geometrySun, materialSun);
scene.add(sun);


// // Parameter for each planets of the solar system in 2D
// const planets = [
//     { name: 'Mercury', a: 0.387098, e: 0.20563, color: 'orange' },
//     { name: 'Venus', a: 0.73332, e: 0.006772, color: 'blue' },
//     { name: 'Earth', a: 1.0, e: 0.01678, color: 'green' },
//     { name: 'Mars', a: 1.523679, e: 0.0934, color: 'red' },
//     { name: 'Jupiter', a: 5.2044, e: 0.0489, color: 'magenta' },
//     { name: 'Saturn', a: 9.5826, e: 0.0565, color: 'cyan' },
//     { name: 'Uranus', a: 19.2184, e: 0.046381, color: 'purple' },
//     { name: 'Neptune', a: 30.110387, e: 0.009456, color: 'gold' }
// ]

// Parameters for each planets of the solar system, a: semiMajorAxis, e:eccentricity, i:inclinaison
const planets = [
    { name: "Mercury", a: 0.387098,  e: 0.20563,   i: 7.00497902, longitudeAscendingNode: 48.33076593,  longitudePerihelion: 29.124,   color: 0xffbf00 },
    { name: "Venus",   a: 0.723332,  e: 0.006772,  i: 3.39467605, longitudeAscendingNode: 76.67984255,  longitudePerihelion: 54.884,   color: 0x0000ff },
    { name: "Earth",   a: 1.0,       e: 0.0167086, i: 7.155,      longitudeAscendingNode: -11.26064,    longitudePerihelion: 114.2078, color: 0x00ff40 },
    { name: "Mars",    a: 1.523679,  e: 0.0934,    i: 1.84969142, longitudeAscendingNode: 49.55953891,  longitudePerihelion: 286.502,  color: 0xff0000 },
    { name: "Jupiter", a: 5.2044,    e: 0.0489,    i: 1.30439695, longitudeAscendingNode: 100.47390909, longitudePerihelion: 273.867,  color: 0x8000ff },
    { name: "Saturn",  a: 9.5826,    e: 0.0565,    i: 2.48599187, longitudeAscendingNode: 113.66242448, longitudePerihelion: 339.392,  color: 0xff00ff },
    { name: "Uranus",  a: 19.2184,   e: 0.046381,  i: 0.77263783, longitudeAscendingNode: 74.01692503,  longitudePerihelion: 96.99886, color: 0x00ffff },
    { name: "Neptune", a: 30.110387, e: 0.009456,  i: 1.77004347, longitudeAscendingNode: 131.78422574, longitudePerihelion: 276.336,  color: 0x80ff00},
];

// Creation of orbits or each planets
function getPlanetPosition(planet, t) { 
    const a = planet.a; // semiMajorAxis
    const e = planet.e; // eccentricity
    const i = THREE.MathUtils.degToRad(planet.i); // inclinaison
    // const longitudeAscendingNode = THREE.MathUtils.degToRad(planet.longitudeAscendingNode); 
    const longitudePerihelion = THREE.MathUtils.degToRad(planet.longitudePerihelion); 

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
    const x = r * (Math.cos(longitudePerihelion) * Math.cos(trueAnomaly + longitudePerihelion) - Math.sin(longitudePerihelion) * Math.sin(trueAnomaly + longitudePerihelion) * Math.cos(i));
    const y = r * (Math.sin(longitudePerihelion) * Math.cos(trueAnomaly + longitudePerihelion) + Math.cos(longitudePerihelion) * Math.sin(trueAnomaly + longitudePerihelion) * Math.cos(i));
    const z = r * (Math.sin(trueAnomaly + longitudePerihelion) * Math.sin(i));

    return { x, y, z };
}

function getPlanetOrbit(planet) {
    const a = planet.a
    const e = planet.e
    const semiMinorAxis = a * Math.sqrt(1 - (e ** 2));

    const curve = new THREE.EllipseCurve(0, 0, a, semiMinorAxis, 0, 2 * Math.PI, false, 0);
    const points = curve.getPoints(50);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({color: 0xff0001f});
    const ellipse = new THREE.Line(geometry, material);

    return ellipse
}

// Turning planets animation
function animate(t) {
    requestAnimationFrame(animate);
    t *= 0.001; // time in second
    // Adjust each planet at the scene
    planets.forEach(planet => {
        const position = getPlanetPosition(planet, t); // calculate actual position of the planet
        const geometryPlanet = new THREE.SphereGeometry(0.05, 16, 16);
        const materialPlanet = new THREE.MeshBasicMaterial({ color: planet.color });
        const planetMesh     = new THREE.Mesh(geometryPlanet, materialPlanet);
        planetMesh.position.set(position.x, position.y, position.z);
        const ellipse = getPlanetOrbit(planet)
        scene.add(planetMesh, ellipse);
    });

    renderer.render(scene, camera);
    scene.clear(); // Effacer la scène pour ne pas dessiner plusieurs fois
    scene.add(sun); // keep sun in the center
}

// Positionner la caméra
camera.position.set(0, 0, 5);
animate(0); // Start the animation

// can zoom in and zoom out with your mouse
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true

//  Adjust according to the size of the window
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});
;



// Test1 display a cube
// const scene = new THREE.Scene();
// const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 ); // how I'm watching things

// const renderer = new THREE.WebGLRenderer();
// renderer.setSize( window.innerWidth, window.innerHeight);

// document.body.appendChild( renderer.domElement ); //add to the HTML doc

// const geometry = new THREE.BoxGeometry( 2, 2, 4 );
// const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
// const cube = new THREE.Mesh( geometry, material ); //take the geometry and apply the material to it 
// scene.add( cube ); // will be add to the coordinate (0,0)

// camera.position.z = 5;

// function animate() {
//     cube.rotation.x += 0.01;
//     cube.rotation.y += 0.01;
// 	renderer.render( scene, camera );
// }
// renderer.setAnimationLoop( animate ); // will draw the cube everytime the window is refreshed

// Test2 drawing a line
// const renderer = new THREE.WebGLRenderer();
// renderer.setSize( window.innerWidth, window.innerHeight );
// document.body.appendChild( renderer.domElement );

// const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1000 );
// camera.position.set( 0, 0, 100 );
// camera.lookAt( 0, 0, 0 );

// const scene = new THREE.Scene();
// const material = new THREE.LineBasicMaterial( { color: 0x0000ff } );

// const points = [];
// points.push( new THREE.Vector3( - 10, 0, 0 ) ); // -10 depuis l'origine en x (vers la gauche)
// points.push( new THREE.Vector3( 0, 10, 0 ) );  // 10 depuis l'origine en y (vers le haut)
// points.push( new THREE.Vector3( 10, 0, 0 ) );  // 10 depuis l'origine en x (ver la droite)

// const geometry = new THREE.BufferGeometry().setFromPoints( points );

// const line = new THREE.Line( geometry, material );

// scene.add( line );
// renderer.render( scene, camera );





