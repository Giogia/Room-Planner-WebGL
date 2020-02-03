import {importModel, loadJson, saveJson} from "./loader";
import * as THREE from "three";
import {camera, canvas, raycaster, scene} from "./app";
import {draggableObjects, transformControls} from "./controls";
import {hideButton, removeButton, showButton} from "./buttons";
import {selectedMaterial, setTexture} from "./materials";
import {floorPlan} from "./walls";
import {floorMaterials, wallMaterials} from "./materialsList";

export let currentObjects;
export let selectedObject = null;
let dragging = false;
let lastFloorTexture = 'wood2';
let lastWallTexture = 'plaster';


export async function initObjects(){

    currentObjects = await loadJson('currentObjects');
    _.forEach(currentObjects.objects, async function(object){
        let model = await importModel(object.name, object.x, object.y, object.z, object.angle);

        let added = _.find(currentObjects.objects, {
            name: object.name,
            x: object.x,
            y: object.y,
            z: object.z,
            angle: object.angle });

        added.mesh = model.uuid;
    });
}


export async function addObject(event){

    let name = event.target.id;
    let model = await importModel(name);

    let object = { name: model.name, mesh: model.uuid, x: model.position.x, y: model.position.y, z: model.position.z, angle: model.rotation.y };
    currentObjects.objects.push(object);
    await saveJson('currentObjects', currentObjects);
}


export async function selectObject(event){

    let intersects = intersect(event, scene.children);

    let i = 0;
    while (intersects[i].object.name === "" || (intersects[i].object.name === "wall" && intersects[i].distance < 10)) {
        if(i===intersects.length-1){
            return;
        }
        i++;
    }

    if (intersects[i].object.name === "floor") {
        lastFloorTexture = await updateTexture(intersects[i].object, floorPlan.rooms, floorMaterials, lastFloorTexture);
    } else if (intersects[i].object.name === "wall") {
        lastWallTexture = await updateTexture(intersects[i].object, floorPlan.walls, wallMaterials, lastWallTexture);
    }
}


function intersect(event, objects){

    let mouse = new THREE.Vector2();

    mouse.x = ( event.clientX / canvas.clientWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / canvas.clientHeight ) * 2 + 1;
    mouse.z = 0.5;

    raycaster.setFromCamera( mouse, camera );

    return raycaster.intersectObjects( objects, true);
}


async function updateTexture(object, objects, materials, lastTexture){

    let mesh = _.find(objects, {mesh: object.uuid});

    let texture = mesh.texture;

    if(texture === lastTexture){
       texture = materials[(materials.indexOf(lastTexture) + 1) % materials.length];
    }
    else if(texture !== lastTexture){
        texture = lastTexture;
    }

    let repeat = object.geometry.parameters.width? [object.geometry.parameters.width, 1] : [2,2];

    setTexture(texture, object.material, repeat);
    mesh.texture = texture;

    await saveJson('floorPlan', floorPlan);

    return texture;
}


export function selectDraggableObject(event){

    let intersects = intersect(event, draggableObjects);

    let object = null;

    if(intersects.length > 0) {

        object = intersects[0].object;

        while (object.type !== 'Scene') {
            object = object.parent;
        }

        dragging = true;
        setTimeout(() => { dragging = false; }, 10);

        if(selectedObject !== object && selectedObject !== null && event.type === 'mousedown'){

            removeButton.removeEventListener('click', removeDraggableObject);
            document.removeEventListener('keydown', transformDraggableObject);
            object.overrideMaterial = null;
            selectedObject = null;
        }

        if(selectedObject === null && event.type === 'mousedown'){

            selectedObject = object;
            object.overrideMaterial = selectedMaterial;
            showButton(removeButton);
            removeButton.addEventListener('click', removeDraggableObject);
            document.addEventListener('keydown', transformDraggableObject);
        }

        if(selectedObject === object && event.type === 'click' && !dragging){

            hideButton(removeButton);
            removeButton.removeEventListener('click', removeDraggableObject);
            document.removeEventListener('keydown', transformDraggableObject);
            object.overrideMaterial = null;
            selectedObject = null;
        }
    }
}


export async function removeDraggableObject(){

    scene.remove(selectedObject);

    _.remove(draggableObjects, draggable => { return draggable.uuid === selectedObject.uuid });
    _.remove(currentObjects.objects, current => { return current.mesh === selectedObject.uuid });
     await saveJson('currentObjects', currentObjects);

     hideButton(removeButton);
     removeButton.removeEventListener('click', removeDraggableObject);
     selectedObject = null;
}


export async function transformDraggableObject(event){

    let moved = _.find(currentObjects.objects, { mesh: selectedObject.uuid });

    if(event.key === 'ArrowUp'){
        event.preventDefault();
        selectedObject.position.y += 0.05;
        moved.y = selectedObject.position.y;
    }

    if(event.key === 'ArrowDown'){
        event.preventDefault();
        selectedObject.position.y -= 0.05;
        moved.y = selectedObject.position.y;
    }

    if(event.key === 'ArrowLeft'){
        event.preventDefault();
        selectedObject.rotation.y += Math.PI/8 ;
        moved.angle = THREE.Math.radToDeg(selectedObject.rotation.y);
    }

    if(event.key === 'ArrowRight'){
        event.preventDefault();
        selectedObject.rotation.y -= Math.PI/8 ;
        moved.angle = THREE.Math.radToDeg(selectedObject.rotation.y);
    }

    await saveJson('currentObjects', currentObjects);
}





