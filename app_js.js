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

const searchParams = new URLSearchParams(window.location.search);

const potHazAst = searchParams.get('potHazAst') === 'true';
const nearAst = searchParams.get('nearAst') === 'true';

var isPotReady = false;
if(potHazAst && nearAst){
    getPHAasteroids().then(nearEarthObjects => {
        if (Array.isArray(nearEarthObjects)) {
            allObjects = allObjects.concat(nearEarthObjects)
        } else {
            console.error('Fetched data is not an array:', nearEarthObjects);
        }
    }).then(() =>getNEOasteroids().then(nearEarthObjects => {
        if (Array.isArray(nearEarthObjects)) {
            allObjects = allObjects.concat(nearEarthObjects)
        } else {
            console.error('Fetched data is not an array:', nearEarthObjects);
        }
    }).then(() => initSolarSystem(allObjects))
    );
}
else if(potHazAst){
    getPHAasteroids().then(nearEarthObjects => {
        if (Array.isArray(nearEarthObjects)) {
            allObjects = allObjects.concat(nearEarthObjects)
        } else {
            console.error('Fetched data is not an array:', nearEarthObjects);
        }
    }).then(() => initSolarSystem(allObjects));

}
else if(nearAst){
    getNEOasteroids().then(nearEarthObjects => {
        if (Array.isArray(nearEarthObjects)) {
            allObjects = allObjects.concat(nearEarthObjects)
        } else {
            console.error('Fetched data is not an array:', nearEarthObjects);
        }
    }).then(() => initSolarSystem(allObjects));

} else {
    initSolarSystem(allObjects);
}
// if(potHazAst){
// }
// var isNearReady = false;
// if(nearAst){
//     getPHAasteroids().then(nearEarthObjects => {
//         if (Array.isArray(nearEarthObjects)) {
//             allObjects = allObjects.concat(nearEarthObjects)
//         } else {
//             console.error('Fetched data is not an array:', nearEarthObjects);
//         }
//     }).then(() => isNearReady = true);
// }
// console.log("BOB")
// while (potHazAst != isPotReady || nearAst != isNearReady){
//     console.log("NOT READY")
// }
// if(potHazAst == isPotReady && nearAst == isNearReady){
    // initSolarSystem(allObjects);
    // console.log("SolarInit")
// }
// console.log(allObjects)
// initSolarSystem(allObjects)
