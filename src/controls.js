'use strict';

import {camera, app, raycaster} from "./app.js";
import utils from "./maths/Utils.js";

import {currentMode, deleteMode, editMode, viewMode} from "./buttons";
import {currentObjects, selectDraggableObject, selectObject} from "./objects";
import {saveJson} from "./loader";

let controlZone = document.getElementById( 'controls');

let draggableObjects = [];

let delta;
let object = null;

let moveControls = false;
let lastMouseX = -100, lastMouseY = -100;

let enable = {
    orbit: true,
    map: false,
    drag: false
};


function doMouseDown(event) {

	lastMouseX = event.pageX;
	lastMouseY = event.pageY;

	object = raycaster.intersect(event, draggableObjects);

	if(object != null) {

        let position = utils.getWorldPosition(event);

        delta = {
            x: position.x - object.position.x,
            y: position.y - object.position.y,
            z: position.z - object.position.z
        };

        app.removeEventListener('dblclick', selectObject);
        app.removeEventListener('click', selectDraggableObject);

        enable.drag = true;
    }

    if(object == null){
        moveControls = true;
    }
}


async function doMouseUp(event) {

	lastMouseX = -100;
	lastMouseY = -100;

	moveControls = false;

	if(enable.map){

	    setTimeout( () => {

            if(currentMode === "edit"){
                editMode();
            }
            if(currentMode === "delete"){
                deleteMode();
            }
        }, 100);
    }

	if(enable.drag){

	    enable.drag = false;

	    setTimeout(() => {
            app.addEventListener('dblclick', selectObject);
            app.addEventListener('click', selectDraggableObject);
        }, 10);

        let dragged = _.find(currentObjects.objects, {mesh: object.uuid});

        dragged.x = object.position.x;
        dragged.z = object.position.z;

        object = null;

        //await saveJson('currentObjects', currentObjects);
	}
}


function orbitMove(event) {

	event.preventDefault();

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

		    if(0.2 < y && y < 0.95*radius){

		        camera.position.set(x,y,z);
		        camera.lookAt(0,0,0);
            }
		}
	}
}


function orbitZoom(event) {

	event.preventDefault();

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


function mapMove(event){
    if(enable.map && moveControls) {

        viewMode();

		let dx = lastMouseX - event.pageX;
		let dy = event.pageY - lastMouseY;

		lastMouseX = event.pageX;
		lastMouseY = event.pageY;

		if((dx !== 0) || (dy !== 0)) {
            camera.position.set(camera.position.x + 0.05 * dy, camera.position.y, camera.position.z + 0.05 * dx);
            camera.lookAt(camera.target.x + 0.05 * dy, 0.0, camera.target.z + 0.05 * dx);
        }
    }
}

function mapZoom(event){
    if(enable.map){

	    let y = camera.position.y - event.wheelDelta/50.0;

	    if((y > 5.0) && (y < 100.0)) {
	        camera.position.y = y;
            camera.up.set(0,1,0);
	        camera.updateProjectionMatrix();
	    }
    }
}

export function enableMapControls(){

    controlZone.addEventListener("mousedown", doMouseDown, false);
	controlZone.addEventListener("mouseup", doMouseUp, false);
	controlZone.addEventListener("mousemove", mapMove, false);
	controlZone.addEventListener("mousewheel", mapZoom, false);
}


function drag(event){

    if(enable.drag){

        let position = utils.getWorldPosition(event);
        object.position.set(position.x - delta.x, position.y - delta.y, position.z - delta.z);
    }
}

export function enableDragControls(){

    controlZone.addEventListener("mousedown", doMouseDown, false);
    controlZone.addEventListener("mousemove", drag, false);

}




export { enable, draggableObjects };