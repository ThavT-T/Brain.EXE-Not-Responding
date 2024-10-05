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
//     { name: 'Saturn', a: 9.5826, e: 0.0565, color: 'cyfan' },
//     { name: 'Uranus', a: 19.2184, e: 0.046381, color: 'purple' },
//     { name: 'Neptune', a: 30.110387, e: 0.009456, color: 'gold' }
// ]

// Parameters for each planets of the solar system, a: semiMajorAxis, e:eccentricity, i:inclinaison
import { nearEarthObject } from './readNasaValues.js';
import { planets } from './readNasaValues.js';

console.log(nearEarthObject)
console.log(planets)
// Creation of orbits or each planets
function getPlanetPosition(planet, t) { 
    const a = planet.a; // semiMajorAxis
    const e = planet.e; // eccentricity
    const i = THREE.MathUtils.degToRad(planet.i); // inclinaison
    const longitudeAscendingNode = THREE.MathUtils.degToRad(planet.longitudeAscendingNode); 
    const longitudePerihelion = THREE.MathUtils.degToRad(planet.longitudePerihelion); 
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

function getPlanetOrbit(planet) {
    const a = planet.a
    const e = planet.e
    const i = planet.i
    const semiMinorAxis = a * Math.sqrt(1 - (Math.pow(e, 2  )));

    const curve = new THREE.EllipseCurve(0, 0, a, semiMinorAxis, 0, 2 * Math.PI, false, 0);
    const points = curve.getPoints(50);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({color: 0xff0001f});
    const ellipse = new THREE.Line(geometry, material);

    const offset = Math.sqrt((a ** 2) - (semiMinorAxis ** 2))
    // ellipse.translateZ(-offset)
    ellipse.rotateZ(THREE.MathUtils.degToRad(planet.longitudeAscendingNode));
    ellipse.rotateX(THREE.MathUtils.degToRad(i));
    ellipse.rotateZ(THREE.MathUtils.degToRad(planet.longitudePerihelion - planet.longitudeAscendingNode));

    return ellipse
}

// Turning planets animation
function animate(t) {
    requestAnimationFrame(animate);
    t *= 0.001; // time in second
    // Adjust each planet at the scene
    planets.forEach(planet => {
        const position = getPlanetPosition(planet, t); // calculate actual position of the planet
        const geometryPlanet = new THREE.SphereGeometry(0.1, 16, 16);
        const materialPlanet = new THREE.MeshBasicMaterial({ color: planet.color });
        const planetMesh     = new THREE.Mesh(geometryPlanet, materialPlanet);
        planetMesh.position.set(position.x, position.y, position.z);
        const ellipse = getPlanetOrbit(planet)
        scene.add(planetMesh, ellipse);
        // scene.add(planetMesh)
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

// const axesHelper = new THREE.AxesHelper( .5 );
// scene.add(axesHelper)

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





