import { mul } from "three/webgpu";
import * as THREE from "./node_modules/three/build/three.module.js";
import { OrbitControls } from './node_modules/three/examples/jsm/controls/OrbitControls.js';

const scaleX = 0.97
const scaleY = 0.8

export function initSolarSystem(astronomicalObjects) {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.2, 1e+20); 
    const renderer = new THREE.WebGLRenderer(); 
    const raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, 0, -1, 0, 10000000));
    const pointer = new THREE.Vector2();
    renderer.setSize(window.innerWidth * scaleX, window.innerHeight * scaleY);
    var canvas = renderer.domElement; 
    canvas.style.border = 'white solid 4px'
    canvas.style.borderRadius = '15px'
    document.body.appendChild(canvas)
    

    const geometrySun = new THREE.SphereGeometry(0.2, 32, 32); // Geometry for the Sun
    // const materialSun = new THREE.MeshBasicMaterial({ color: 0xffff00 }); // Material for the Sun
    const materialSun = new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load("textures/Sun.jpg") } ); 
    const sun = new THREE.Mesh(geometrySun, materialSun); 
    scene.add(sun); 

    const geometrySkybox = new THREE.SphereGeometry(1000000, 24, 24);
    const materialSkybox = new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load("textures/Skybox.jpg") } );
    materialSkybox.side = THREE.DoubleSide;
    const skybox = new THREE.Mesh(geometrySkybox, materialSkybox);
    scene.add(skybox)
    
    


    // Add astronomicalObjects (planets, etc.) to the scene
    astronomicalObjects.forEach(astronomicalObject => {
        const astronomicalObjectMesh = astronomicalObject.getObjectMesh(); 
        const astronomicalObjectOrbit = getOrbit(astronomicalObject); 
        scene.add(astronomicalObjectMesh, astronomicalObjectOrbit);
        // scene.add(astronomicalObjectMesh);/ window.innerHeight
    });

    function getOrbit(aObject) {
        if (aObject.doOrbit) {
            var geometry = new THREE.BufferGeometry();
            var material = new THREE.LineBasicMaterial({ color: 0xffffff });
            var linePoints = [];
            for (var i = 0; i <= 6.28; i += 0.01) {
                linePoints.push(aObject.propagate(i));
            }
            geometry.setFromPoints(linePoints);
            var line = new THREE.Line(geometry, material);
            return line
        } else {
            return new THREE.Mesh();
        }

    }

    var runOnce = false;
    var old_t = 0;
    var stop = false;
    document.getElementById("play_button").onclick = function() {stop = false; runOnce = false;};
    document.getElementById("stop_button").onclick = function() {stop = true;};

    // Animation loop for moving the astronomicalObjects
    function animate(t) {
        requestAnimationFrame(animate); 
        t *= 0.001; 

        if (stop) {
            if (!runOnce) {
                old_t = t;
                runOnce = true;
            }
            t = old_t;
        }
        
        // if (Array.isArray(astronomicalObjects)){
        //     // Adjust each astronomicalObject's position in the scene based on time
        //     astronomicalObjects.forEach(astronomicalObject => {
        //        const position = astronomicalObject.getObjectPosition(t); // Calculate the position of the object
        //        const astronomicalObjectMesh = astronomicalObject.getObjectMesh(); // Get the mesh for the object
        //        astronomicalObjectMesh.position.set(position.x, position.y, position.z); // Set the object's position
        //     })}else{console.log("astronomicalObjects not an array")};

        astronomicalObjects.forEach(astronomicalObject => {
            const position = astronomicalObject.getObjectPosition(t); 
            const astronomicalObjectMesh = astronomicalObject.getObjectMesh(); 
            astronomicalObjectMesh.position.set(position.x, position.y, position.z); 
        });
        
        render(); 
        scene.add(sun); 
    }

    function render() {
        renderer.render(scene, camera); 
        raycaster.setFromCamera(pointer, camera); 
    }

    camera.position.set(0, 0, 5); 
    animate(0); 

    const controls = new OrbitControls(camera, renderer.domElement);

    controls.mouseButtons = {
        LEFT: THREE.MOUSE.ROTATE,
        MIDDLE: THREE.MOUSE.DOLLY,
        RIGHT: THREE.MOUSE.PAN
    }
    // controls.enableDamping = true; // Enable damping (smooth movement)

    // Adjust renderer size on window resize
    window.addEventListener('resize', () => {
        renderer.setSize(window.innerWidth * scaleX, window.innerHeight * scaleY); 
        camera.aspect = window.innerWidth / window.innerHeight; 
        camera.updateProjectionMatrix(); 
    });

    // Update pointer for mouse movement
    document.addEventListener('mousemove', (event) => {
        var rect = renderer.domElement.getBoundingClientRect();
        pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1; 
        pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1; 

    });

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
            const intersects = raycaster.intersectObject(astronomicalObjectMesh, false);
            if (intersects.length > 0) {
                if (document.getElementById('planet-info').innerHTML == '') {
                    document.getElementById('planet-info').innerHTML = astronomicalObject.info 
                    document.getElementById('planet-info').style.color = 'white'
                } else {
                    document.getElementById('planet-info').innerHTML = ''
                }
            }
            
        })
        
        const intersectsSun = raycaster.intersectObject(sun, false);
        if (intersectsSun.length > 0) {
            console.log("Entered")
            if (document.getElementById('Sun-info').innerHTML == '') {
                document.getElementById('Sun-info').innerHTML   = "Sun: It’s the star of our solar system! \nIt’s thanks to the Sun’s gravity that all the planets can hold together \nIt can produce solar storms which can disturb the Earth’s magnetic field and produce radio blackouts, power outages, and auroras";   
                document.getElementById('Sun-info').style.color = 'yellow'
            } else {
                document.getElementById('Sun-info').innerHTML = ''
            }
        }
        
    });
}

