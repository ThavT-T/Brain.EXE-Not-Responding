import { getNearEarthObjects, planets } from './readNasaValues.js';
import { initSolarSystem } from './animate.js';

getNearEarthObjects().then(nearEarthObjects => {
    if (Array.isArray(nearEarthObjects)) {
        initSolarSystem(nearEarthObjects);
    } else {
        console.error('Fetched data is not an array:', nearEarthObjects);
    }
});
// initSolarSystem(planets)
