'use strict';

import * as THREE from 'three';
import MapControls from 'three-controls/src/js/MapControls';
import {camera, canvas, renderer, scene} from "./app";
import ThreeDragger from 'three-dragger';
import {currentMode, deleteMode, editMode, viewMode} from "./buttons";
import {currentObjects, selectDraggableObject, selectObject} from "./objects";
import {saveJson} from "./loader";
import {utils} from "./utils";


export var dragControls, mapControls, transformControls, orbitControls, pointerLockControls;
export var draggableObjects = [];

export let enableOrbit = true;
let moveOrbit = false;
let lastMouseX = -100, lastMouseY = -100;


function doMouseDown(event) {
	lastMouseX = event.pageX;
	lastMouseY = event.pageY;
	moveOrbit = true;
}

function doMouseUp(event) {
	lastMouseX = -100;
	lastMouseY = -100;
	moveOrbit = false;
}

function orbitMove(event) {
	if(enableOrbit && moveOrbit) {

		let dx = lastMouseX - event.pageX;
		let dy = event.pageY - lastMouseY;

		lastMouseX = event.pageX;
		lastMouseY = event.pageY;

		if((dx !== 0) || (dy !== 0)) {

		    let radius = Math.sqrt(Math.pow(camera.position.x, 2) + Math.pow(camera.position.y, 2) +  Math.pow(camera.position.z, 2));
            let elevation = utils.radToDeg(Math.asin(camera.position.y/radius));
            let angle = utils.radToDeg(Math.atan(camera.position.x/camera.position.z));

            angle = camera.position.z >= 0 ? angle : angle + 180;

		    //console.log(camera.position.x, camera.position.z ,angle);

		    elevation = elevation + 0.75 * dy;
		    angle = angle + 0.75 * dx;

            let x = radius * Math.sin(utils.degToRad(angle)) * Math.cos(utils.degToRad(elevation));
            let y = radius * Math.sin(utils.degToRad(elevation));
            let z = radius * Math.cos(utils.degToRad(angle)) * Math.cos(utils.degToRad(elevation));

            console.log(x,y,z, angle);

		    if(0 < y && y < 0.95*radius){

		        camera.position.set(x,y,z);
		        camera.updateProjectionMatrix();
            }
		}
	}
}

function orbitZoom(event) {

    if(enableOrbit){
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

    canvas.addEventListener("mousedown", doMouseDown, false);
	canvas.addEventListener("mouseup", doMouseUp, false);
	canvas.addEventListener("mousemove", orbitMove, false);
	canvas.addEventListener("mousewheel", orbitZoom, false);
}

//TODO use this for gl renderer
export function updateOrbitControls(){

    let viewMatrix = utils.MakeView(cx, cy, cz, -elevation, angle);
    let perspProjectionMatrix = utils.MakePerspective(camera.fov, camera.aspect, camera.near, camera.far);

    let worldViewPerspMatrix = utils.transposeMatrix(utils.multiplyMatrices(perspProjectionMatrix, viewMatrix));
    camera.position.set(cx, cy, cz);
    camera.updateProjectionMatrix();

}


export function enableMapControls(){

    mapControls = new MapControls(camera, renderer.domElement, {
        target: new THREE.Plane(new THREE.Vector3(0,1,0),0),
    });

    mapControls.enableRotate = false;
    mapControls.screenSpacePanning = false;
    mapControls.enableDamping = false;

    mapControls.enableZoom = true;
    mapControls.minDistance = 5;
    mapControls.maxDistance = 100;

    mapControls.enabled = false;
    mapControls.update();

    mapControls.addEventListener('change', () => {
        setTimeout( () => {
            viewMode();
        }, 100);
    });

    mapControls.addEventListener('end', () => {
        setTimeout( () => {

            if(currentMode === "edit"){
                editMode();
            }
            if(currentMode === "delete"){
                deleteMode();
            }
        }, 100);
    });
}


export function enableDragControls(){

    let dragZone = document.getElementById( 'controls');

    let delta = new THREE.Vector3();

    dragControls = new ThreeDragger(draggableObjects, camera, dragZone);

    dragControls.on( 'dragstart', function (event) {

        enableOrbit = false;
        console.log(enableOrbit);
        canvas.removeEventListener('dblclick', selectObject);
        //canvas.removeEventListener('click', selectDraggableObject);

        let group = getDraggablePosition(event).group;
        let position = getDraggablePosition(event).position;

        delta.set(position.x - group.position.x, position.y - group.position.y, position.z - group.position.z);

    } );

    dragControls.on('drag', function (event) {

        let group = getDraggablePosition(event).group;
        let position = getDraggablePosition(event).position;

        group.position.set(position.x - delta.x, position.y - delta.y, position.z - delta.z);
    });

    dragControls.on( 'dragend', async function (event) {

        enableOrbit = true;
        console.log(enableOrbit);
        setTimeout(() => {
            canvas.addEventListener('dblclick', selectObject);
            canvas.addEventListener('click', selectDraggableObject);
        }, 10);

        let object = getDraggablePosition(event).group;

        let dragged = _.find(currentObjects.objects, { mesh: object.uuid });

        dragged.x = object.position.x;
        dragged.z = object.position.z;

        await saveJson('currentObjects', currentObjects);
    });
}


function getDraggablePosition(event){

    let vector = new THREE.Vector3();
    let position = new THREE.Vector3();

    vector.set(
            ( event.event.clientX / canvas.clientWidth ) * 2 - 1,
            - ( event.event.clientY / canvas.clientHeight ) * 2 + 1,
            -1,
    );

    vector.unproject( camera );
    vector.sub( camera.position ).normalize();

    let distance = - camera.position.y / vector.y;

    position.copy( camera.position ).add( vector.multiplyScalar( distance ) );

    let group = event.target;

    while(group.type !== 'Scene'){
        group = group.parent
    }

    return {group: group, position: position};
}

