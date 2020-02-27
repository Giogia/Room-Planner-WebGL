'use strict';

import {app, camera} from "./app2.js";
import {utils} from "./maths/Utils.js";

let controlZone = document.getElementById( 'app');

let delta;
let object = null;

let moveControls = false;
let lastMouseX = -100, lastMouseY = -100;

let enable = {
    orbit: true,
    map: false,
    drag: false
};

export { enable };


function doMouseDown(event) {

	lastMouseX = event.pageX;
	lastMouseY = event.pageY;

    moveControls = true;
}


async function doMouseUp(event) {

	lastMouseX = -100;
	lastMouseY = -100;

	moveControls = false;
}


function orbitMove(event) {
	if(enable.orbit && moveControls) {

		let dx = lastMouseX - event.pageX;
		let dy = event.pageY - lastMouseY;

		lastMouseX = event.pageX;
		lastMouseY = event.pageY;

		if((dx !== 0) || (dy !== 0)) {

		    let radius = Math.sqrt(Math.pow(camera.position.x, 2) + Math.pow(camera.position.y, 2) +  Math.pow(camera.position.z, 2));
            let elevation = utils.radToDeg(Math.asin(camera.position.y/radius));
            let angle = utils.radToDeg(Math.atan(camera.position.x/camera.position.z));

            angle = camera.position.z >= 0 ? angle : angle + 180;

		    elevation = elevation + 0.75 * dy;
		    angle = angle + 0.75 * dx;

            let x = radius * Math.sin(utils.degToRad(angle)) * Math.cos(utils.degToRad(elevation));
            let y = radius * Math.sin(utils.degToRad(elevation));
            let z = radius * Math.cos(utils.degToRad(angle)) * Math.cos(utils.degToRad(elevation));

		    if(0 < y && y < 0.95*radius){

		        camera.position.set(x,y,z);
		        camera.lookAt(0,0,0);
            }
		}
	}
}


function orbitZoom(event) {

    if(enable.orbit){
        let radius = Math.sqrt(Math.pow(camera.position.x, 2) + Math.pow(camera.position.y, 2) +  Math.pow(camera.position.z, 2));
	    let newRadius = radius - event.wheelDelta/50.0;

	    if((newRadius > 5.0) && (newRadius < 100.0)) {

	        let x = camera.position.x * newRadius / radius;
	        let y = camera.position.y * newRadius / radius;
	        let z = camera.position.z * newRadius / radius;

	        camera.position.set(x, y, z)
	    }
    }
}

export function enableOrbitControls(){

    controlZone.addEventListener("mousedown", doMouseDown, false);
	controlZone.addEventListener("mouseup", doMouseUp, false);
	controlZone.addEventListener("mousemove", orbitMove, false);
	controlZone.addEventListener("mousewheel", orbitZoom, false);
}

