'use strict';

import * as THREE from 'three';
import * as TWEEN from 'tween.js';

import {dragControls, mapControls, draggableObjects} from "./controls"
import { enableDragControls, enableMapControls, enableOrbitControls} from "./controls"
import {addLights} from "./lights";
import {
    addObject,
    initObjects,
    selectDraggableObject,
    selectedObject,
    selectObject
} from "./objects";
import {createModel} from "./walls";
import {enableMap, hideCloseWalls, showRoomCenters, tweenCamera} from "./view";
import {createButtons, downloadButton, showButton, viewButton} from "./buttons";
import {MDCDrawer} from "@material/drawer/component";

export let scene, camera, renderer, canvas, raycaster;
export let ground;
export let list, drawer;


async function init(){

    canvas = document.getElementById( 'canvas');
    document.body.appendChild(canvas);

    list = document.getElementById('list');

    createDrawer();
    createButtons();

    createRenderer();
    createScene();
    createCamera();
    createRayCaster();

    enableOrbitControls();
    enableMapControls();
    enableDragControls();

    addLights();
    addGround();

    list.addEventListener('click', addObject);
    canvas.addEventListener('mousedown', selectDraggableObject);
    canvas.addEventListener('click', selectDraggableObject);
    canvas.addEventListener('dblclick', selectObject);

    await createModel();
    await initObjects();

    autoResize();
    animate();

    loadingAnimation();
}


function loadingAnimation(){

    setTimeout( () => {

        let loadingIcon = document.getElementById('loading-icon');
        loadingIcon.style["animation"] = 'disappear 1s both';

        let loadingScreen = document.getElementById('loading-screen');
        loadingScreen.style.opacity = '0';

        tweenCamera(new THREE.Vector3(-7, 9, -16), 3000);

        setTimeout( () => {

            showButton(viewButton);

            setTimeout( () => {

                showButton(downloadButton);

                setTimeout( () => {

                    drawer.open = true;

                }, 100);

            }, 100);

        }, 3000);

     }, 1000);
}


function createDrawer() {
    drawer = new MDCDrawer.attachTo(document.getElementsByClassName("mdc-drawer")[0]);
    drawer.open = false;
}


function createRenderer(){
    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize( canvas.clientWidth, canvas.clientHeight );
    renderer.gammaOutput = true;
    canvas.appendChild(renderer.domElement);

}


function createScene(){
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x3d4043);
    scene.fog = new THREE.Fog(0x3d4043, 15, 60);
}


function createCamera(){
    const fov = 25;
    const aspect = canvas.clientWidth / canvas.clientHeight;
    const near = 0.1;
    const far = 100;
    camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(-4, 100, 12);
    camera.lookAt(new THREE.Vector3(0,0,0));
    //camera.position.set(-7, 9, -16);
}


function createRayCaster() {
    raycaster = new THREE.Raycaster();
}


function addGround() {

    ground = new THREE.Mesh(
        new THREE.PlaneBufferGeometry(100, 100),
        new THREE.MeshLambertMaterial( {color: 0x030405, depthWrite: false})
    );

    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.05;
    ground.receiveShadow = true;

    scene.add(ground);

    let gridHelper = new THREE.GridHelper( 100, 50, 0x000000, 0x000000);
    scene.add( gridHelper );
}


function autoResize(){
    window.onresize = () => {
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize( canvas.clientWidth, canvas.clientHeight );
        animate();
    };
}


export function animate() {

    requestAnimationFrame( animate );

    TWEEN.update();

    //mapControls.update();
    dragControls.update(draggableObjects);

    hideCloseWalls();
    showRoomCenters();

    renderer.autoClear = true;
    renderer.render( scene, camera );

    if(selectedObject !== null){

        renderer.autoClear = false;
        renderer.render(selectedObject, camera);
    }
}

init();



