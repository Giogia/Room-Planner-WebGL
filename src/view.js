import * as TWEEN from "tween.js";

import { draggableObjects, enable } from "./controls";
import {camera, canvas, drawer, list, scene} from "./app";
import {addObject, selectDraggableObject, selectObject} from "./objects";
import {drawModel, floorModel, roomCenters, skirtingModel, updateModel, wallsModel} from "./walls";

import {
    activateButtons,
    activateDrawButtons,
    activateModelButtons,
    deactivateButtons,
    deactivateDrawButtons,
    deactivateModelButtons,
    hideDrawButtons,
    hideModelButtons,
    showDrawButtons,
    showDrawIcon,
    showModelButtons,
    showModelIcon
} from "./buttons";

import {directional} from "./lights";

let floorPlanView = false;


export function toggleView(event) {

    event.preventDefault();
    floorPlanView = !floorPlanView;

    (floorPlanView) ? drawView() : modelView();
}


function drawView(){

    drawer.open = false;
    deactivateModelButtons();
    hideModelButtons();
    setTimeout( () => {
        activateDrawButtons();
        showDrawButtons();
        showDrawIcon();
    }, 500);

    list.removeEventListener('click', addObject);
    canvas.removeEventListener('mousedown', selectDraggableObject);
    canvas.removeEventListener('mouseup', selectDraggableObject);
    canvas.removeEventListener('dblclick', selectObject);

    scene.remove( directional );

    hide(draggableObjects);
    hide(floorModel.children);
    hide(roomCenters.children);
    hide(wallsModel.children);
    hide(skirtingModel.children);
    show(drawModel.children);

    tweenCamera({x: -0.01, y: 30, z: 0});
}


function modelView(){

    tweenCamera({x: -0.01, y: 30, z: 0}, 250, true);

    setTimeout( ()=>{

        drawer.open = true;

        deactivateDrawButtons();
        hideDrawButtons();

        setTimeout( () => {
            activateModelButtons();
            showModelButtons();
            showModelIcon();
        }, 500);

        deactivateDrawButtons();

        list.addEventListener('click', addObject);
        canvas.addEventListener('mousedown', selectDraggableObject);
        canvas.addEventListener('mouseup', selectDraggableObject);
        canvas.addEventListener('dblclick', selectObject);

        scene.add( directional );

        hide(drawModel.children);
        show(floorModel.children);
        show(skirtingModel.children);
        show(wallsModel.children);
        show(draggableObjects);
        show(roomCenters.children);

        setTimeout( () => {
            tweenCamera({x: -7, y: 9, z: -16});
        }, 100);

    }, 250);

}


export function tweenCamera(targetPosition, duration=2500, resetMap=false){

    deactivateButtons();

    enable.orbit = false;
    enable.map = false;

    let position = camera.position;

    new TWEEN.Tween(position)

        .to( targetPosition, duration )

        .easing( TWEEN.Easing.Quartic.InOut )

        .onUpdate( () => {
            camera.position.set(position.x, position.y, position.z);
            if(!resetMap){
                camera.lookAt(0,0,0);
            }
            if(resetMap){
                camera.up.set(0,1,0);
            }

        })

        .onComplete( function () {

            camera.position.set(targetPosition.x, targetPosition.y, targetPosition.z);
            camera.lookAt(0,0,0);

            if (floorPlanView) {
                enable.map = true;
            }
            if (!floorPlanView) {
                enable.orbit = true;
            }
        })

        .start();

    activateButtons();
}


export function hideCloseWalls(){
    if(!floorPlanView){
        for( let mesh of wallsModel.children){
            let distance = camera.position.distanceTo(mesh.position);
            mesh.visible = distance >= 5;
            mesh.material.opacity = 5 * Math.log(distance - 10) - 5;
        }
    }
}

export function showRoomCenters(){
    if(!floorPlanView){
        for( let mesh of roomCenters.children){
            let distance = camera.position.distanceTo(mesh.position);
            mesh.visible = distance <= 10;
        }
    }
}


export function hide(objects) {

    for (let mesh of objects) {
        mesh.visible = false;
    }
}

export function show(objects) {

    for (let mesh of objects) {
        mesh.visible = true;
    }
}
