import * as TWEEN from "tween.js";

import {draggableObjects, enable} from "./controls";
import {app, camera, drawer, list, scene} from "./app";
import {addObject, selectDraggableObject, selectObject} from "./objects";
import {drawModel, floorModel, roomCenters, skirtingModel, wallsModel} from "./walls";

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
import Vector from "./maths/Vector";
import utils from "./maths/Utils";

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
    app.removeEventListener('mousedown', selectDraggableObject);
    app.removeEventListener('mouseup', selectDraggableObject);
    app.removeEventListener('dblclick', selectObject);

    scene.remove( directional );

    hide(draggableObjects);
    hide(floorModel.children);
    hide(roomCenters.children);
    hide(wallsModel.children);
    hide(skirtingModel.children);
    show(drawModel.children);

    tweenCamera(new Vector(-0.01, 30, 0));
}


function modelView(){

    tweenCamera(new Vector(-0.01, 30, 0), 250, true);

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
        app.addEventListener('mousedown', selectDraggableObject);
        app.addEventListener('mouseup', selectDraggableObject);
        app.addEventListener('dblclick', selectObject);

        scene.add( directional );

        hide(drawModel.children);
        show(floorModel.children);
        show(skirtingModel.children);
        show(wallsModel.children);
        show(draggableObjects);
        show(roomCenters.children);

        setTimeout( () => {
            tweenCamera(new Vector(-7, 9, -16));
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
            let distance = utils.distance(camera.position, mesh.position);
            mesh.visible = distance >= 5;
            mesh.material.opacity = 5 * Math.log(distance - 10) - 5;
        }
    }
}

export function showRoomCenters(){
    if(!floorPlanView){
        for( let mesh of roomCenters.children){
            let distance = utils.distance(camera.position, mesh.position);
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
