import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export function initSolarSystem(astronomicalObjects, isOrbits) {
    // Create the scene, camera, renderer, and raycaster
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.2, 1000); // Camera to view the scene
    const renderer = new THREE.WebGLRenderer(); // Renderer to draw the scene
    const raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, 0, -1, 0, 10000000)); // Raycaster for object interaction
    const pointer = new THREE.Vector2(); // Pointer for mouse position
    // Set renderer size and append the canvas to the document
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement); // Add renderer output to the HTML document

    // Creation of the Sun
    const geometrySun = new THREE.SphereGeometry(0.2, 32, 32); // Geometry for the Sun
    // const materialSun = new THREE.MeshBasicMaterial({ color: 0xffff00 }); // Material for the Sun
    const materialSun = new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load("textures/Sun.jpg") } ); // Material for the Sun
    const sun = new THREE.Mesh(geometrySun, materialSun); // Create the Sun mesh
    scene.add(sun); // Add the Sun to the scene

    // if (Array.isArray(astronomicalObjects)){
    //     // Add astronomicalObjects (planets, etc.) to the scene
    //     astronomicalObjects.forEach(astronomicalObject => {
    //         const astronomicalObjectMesh = astronomicalObject.getObjectMesh(); // Get the mesh for each astronomical object
    //         const astronomicalObjectOrbit = getOrbit(astronomicalObject); // Get the orbit for each astronomical object
    //         scene.add(astronomicalObjectMesh, astronomicalObjectOrbit); // Add the mesh to the scene

    //     })}else {console.log("astronomicalObjects not an array")};

    // Add astronomicalObjects (planets, etc.) to the scene
    astronomicalObjects.forEach(astronomicalObject => {
        const astronomicalObjectMesh = astronomicalObject.getObjectMesh(); // Get the mesh for each astronomical object
        const astronomicalObjectOrbit = getOrbit(astronomicalObject); // Get the orbit for each astronomical object
        scene.add(astronomicalObjectMesh, astronomicalObjectOrbit); // Add the mesh to the scene
    });

    function getOrbit(aObject) {
        var geometry = new THREE.BufferGeometry();
        var material = new THREE.LineBasicMaterial({ color: 0xffffff });
        var linePoints = [];
        for (var i = 0; i <= 6.28; i += 0.01) {
            linePoints.push(aObject.propagate(i));
        }
        geometry.setFromPoints(linePoints);
        var line = new THREE.Line(geometry, material);
        return line
    }
    // Animation loop for moving the astronomicalObjects
    function animate(t) {
        requestAnimationFrame(animate); // Create the animation loop
        t *= 0.001; // Convert time to seconds

        // if (Array.isArray(astronomicalObjects)){
        //     // Adjust each astronomicalObject's position in the scene based on time
        //     astronomicalObjects.forEach(astronomicalObject => {
        //        const position = astronomicalObject.getObjectPosition(t); // Calculate the position of the object
        //        const astronomicalObjectMesh = astronomicalObject.getObjectMesh(); // Get the mesh for the object
        //        astronomicalObjectMesh.position.set(position.x, position.y, position.z); // Set the object's position
        //     })}else{console.log("astronomicalObjects not an array")};

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
    }

    // Position the camera
    camera.position.set(0, 0, 5); // Set the camera's position
    animate(0); // Start the animation loop

    // Initialize controls for zooming in and out with the mouse
    const controls = new OrbitControls(camera, renderer.domElement);
    // controls.enableDamping = true; // Enable damping (smooth movement)

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

    // TODO Maybe use this to zoom to a planet?
    // function lerpToPoint(point, alpha) {
    //     while (camera.position.distanceTo(point) > 1) {
    //         camera.position.lerp(point, alpha);
    //     }
    // }

    document.addEventListener('click', (event) => {
        // const filteredChildren = scene.children.filter(child => child.constructor.name == "Mesh");
        // const intersects = raycaster.intersectObjects(filteredChildren, false);
        // if (intersects.length > 0) { 
        //     document.getElementById('planet-info').innerHTML = intersects[0].object.constructor.name;

        //     // lerpToPoint(intersects[0].object.position, 0.0001);
        //     // console.log(intersects[0].object.constructor.name);
        // }
        // Raycasting for interaction
        //https://github.com/mrdoob/three.js/blob/master/examples/webgl_interactive_cubes.html
        astronomicalObjects.forEach(astronomicalObject => { 
            const astronomicalObjectMesh = astronomicalObject.getObjectMesh();
            // const intersects = raycaster.intersectObject(astronomicalObjectMesh, false);
            const intersects = raycaster.intersectObject(astronomicalObjectMesh, false);
            if (intersects.length > 0) {
                document.getElementById('planet-info').innerHTML = astronomicalObject.info;
            }
        })
    });
}

