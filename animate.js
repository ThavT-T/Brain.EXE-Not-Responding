import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export function initSolarSystem(astronomicalObjects) {
    // Create the scene, camera, renderer, and raycaster
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 0.1, 1000); // Camera to view the scene
    const renderer = new THREE.WebGLRenderer(); // Renderer to draw the scene
    const raycaster = new THREE.Raycaster(); // Raycaster for object interaction
    const pointer = new THREE.Vector2(); // Pointer for mouse position

    // Set renderer size and append the canvas to the document
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement); // Add renderer output to the HTML document

    // Creation of the Sun
    const geometrySun = new THREE.SphereGeometry(0.2, 32, 32); // Geometry for the Sun
    const materialSun = new THREE.MeshBasicMaterial({ color: 0xffff00 }); // Material for the Sun
    const sun = new THREE.Mesh(geometrySun, materialSun); // Create the Sun mesh
    scene.add(sun); // Add the Sun to the scene

    // Add astronomicalObjects (planets, etc.) to the scene
    astronomicalObjects.forEach(astronomicalObject => {
        const astronomicalObjectMesh = astronomicalObject.getObjectMesh(); // Get the mesh for each astronomical object
        scene.add(astronomicalObjectMesh); // Add the mesh to the scene
    });

    // Animation loop for moving the astronomicalObjects
    function animate(t) {
        requestAnimationFrame(animate); // Create the animation loop
        t *= 0.001; // Convert time to seconds

        // Adjust each astronomicalObject's position in the scene based on time
        astronomicalObjects.forEach(astronomicalObject => {
            const position = astronomicalObject.getObjectPosition(t); // Calculate the position of the object
            const astronomicalObjectMesh = astronomicalObject.getObjectMesh(); // Get the mesh for the object
            astronomicalObjectMesh.position.set(position.x, position.y, position.z); // Set the object's position
        });

        render(); // Render the scene
        scene.add(sun); // Keep the Sun in the center
    }

    function render() {
        renderer.render(scene, camera); // Render the scene from the perspective of the camera
        raycaster.setFromCamera(pointer, camera); // Update the raycaster with the mouse pointer position

        // Raycasting for interaction
        //https://github.com/mrdoob/three.js/blob/master/examples/webgl_interactive_cubes.html
        const intersects = raycaster.intersectObjects(scene.children, false); // Check for intersections with objects in the scene
        // if (intersects.length > 0) {
        //     intersects[0].object.position.x = 24323; // Example interaction (commented out)
        // }
    }

    // Add point markers for astronomicalObjects
    var placePointId = setInterval(function() {
        astronomicalObjects.forEach(astronomicalObject => {
            const astronomicalObjectMesh = astronomicalObject.getObjectMesh(); // Get the mesh for the object
            const dot = new THREE.SphereGeometry(astronomicalObject.radius / 6378 * 0.05, 16, 16); // Geometry for the marker
            const material = new THREE.MeshBasicMaterial({ color: astronomicalObject.color }); // Material for the marker
            const mesh = new THREE.Mesh(dot, material); // Create the marker mesh
            mesh.position.set(astronomicalObjectMesh.position.x, astronomicalObjectMesh.position.y, astronomicalObjectMesh.position.z); // Set marker position to match the object
            scene.add(mesh); // Add the marker to the scene
        });
    }, 1000); // Update markers every second

    // Position the camera
    camera.position.set(0, 0, 5); // Set the camera's position
    animate(0); // Start the animation loop

    // Initialize controls for zooming in and out with the mouse
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; // Enable damping (smooth movement)

    // Adjust renderer size on window resize
    window.addEventListener('resize', () => {
        renderer.setSize(window.innerWidth, window.innerHeight); // Update renderer size
        camera.aspect = window.innerWidth / window.innerHeight; // Update camera aspect ratio
        camera.updateProjectionMatrix(); // Update the camera's projection matrix
    });

    // Update pointer for mouse movement
    document.addEventListener('mousemove', (event) => {
        pointer.x = (event.clientX / window.innerWidth) * 2 - 1; // Calculate normalized mouse x position
        pointer.y = -(event.clientY / window.innerHeight) * 2 + 1; // Calculate normalized mouse y position
    });
}

