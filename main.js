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
import { materialShininess } from "three/webgpu";

console.log(nearEarthObject)
console.log(planets)

planets.forEach(planet => {
    const planetMesh     = planet.getObjectMesh();
    scene.add(planetMesh);
});

// nearEarthObjects.forEach(object => {
//     const mesh     = object.getObjectMesh();
//     scene.add(mesh);
// });

// Turning planets animation
function animate(t) {
    requestAnimationFrame(animate);
    t *= 0.001; // time in second
    // Adjust each planet at the scene
    planets.forEach(planet => {
        const position = planet.getObjectPosition(t); // calculate actual position of the planet
        const planetMesh = planet.getObjectMesh();
        planetMesh.position.set(position.x, position.y, position.z);
    });

    // nearEarthObjects.forEach(planet => {
    //     const position = planet.getObjectPosition(t); // calculate actual position of the planet
    //     const planetMesh = planet.getObjectMesh();
    //     planetMesh.position.set(position.x, position.y, position.z);
    // });

    renderer.render(scene, camera);
    // scene.clear(); // Effacer la scène pour ne pas dessiner plusieurs fois
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
