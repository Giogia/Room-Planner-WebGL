import * as TWEEN from 'tween.js'

import {draggableObjects, enable} from "./controls";
import {app, camera, drawer, list} from "./app";
import {addObject, selectDraggableObject, selectObject} from "./objects";
import {drawModel, floorModel, skirtingModel, wallsModel} from "./walls";
import Vector from "./maths/Vector";
import utils from "./maths/Utils";

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
    showModelIcon, viewMode
} from "./buttons";


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

    hide(draggableObjects);
    hide(floorModel);
    hide(wallsModel);
    hide(skirtingModel);
    show(drawModel);

    tweenCamera(new Vector(-0.01, 15, 0.0));
}


function modelView(){

    tweenCamera(new Vector(-0.01, 15, 0.0), 250, true);

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

        hide(drawModel);
        show(floorModel);
        show(skirtingModel);
        show(wallsModel);
        show(draggableObjects);

        setTimeout( () => {
            tweenCamera(new Vector(-7, 9, -16));
        }, 100);

    }, 250);

}


export function tweenCamera(targetPosition, duration=2000, resetMap=false){

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
                camera.lookAt(position.x + 0.01, 0.0, position.z);
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
        for(let mesh of wallsModel){
            let distance = utils.distance(camera.position, mesh.position);
            mesh.visible = distance >= 5;
            for(let item of mesh.items.values()) {
                item.material.opacity = Math.min(1.0, 5 * Math.log(distance - 5) - 5);
            }
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
