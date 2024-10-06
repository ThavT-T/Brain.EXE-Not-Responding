import { getNearEarthObjects, planets, getNEOcomets, getNEOasteroids, getPHAasteroids } from './readNasaValues.js';
import { initSolarSystem } from './animate.js';

// console.log(getNEOcomets());
var allObjects = planets;
// console.log(allObjects);
// getNearEarthObjects().then(nearEarthObjects => {
//     if (Array.isArray(nearEarthObjects)) {
//         const allObjects = planets + nearEarthObjects
//         console.log(nearEarthObjects)
//         // initSolarSystem(nearEarthObjects);
//     } else {
//         console.error('Fetched data is not an array:', nearEarthObjects);
//     }
// });

getPHAasteroids().then(nearEarthObjects => {
        if (Array.isArray(nearEarthObjects)) {
            // const allObjects = planets + nearEarthObjects
            // console.log(nearEarthObjects)
            allObjects = planets.concat(nearEarthObjects)
            // console.log(allObjects)
            // initSolarSystem(nearEarthObjects);
        } else {
            console.error('Fetched data is not an array:', nearEarthObjects);
        }
    }).then(() => initSolarSystem(allObjects));
    
// console.log(allObjects)
// initSolarSystem(allObjects)
