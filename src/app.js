'use strict';

import * as THREE from 'three';
import * as TWEEN from 'tween.js';

import {enableDragControls, enableMapControls, enableOrbitControls} from "./controls"
import {addLights} from "./lights";
import {addObject, initObjects, selectDraggableObject, selectedObject, selectObject} from "./objects";
import {createModel} from "./walls";
import {hideCloseWalls, showRoomCenters, tweenCamera} from "./view";
import {createButtons, downloadButton, showButton, viewButton} from "./buttons";
import {MDCDrawer} from "@material/drawer/component";
import {importGlb} from "./loader";
import Vector from "./maths/Vector";
import Camera from "./entities/Camera";

export let scene, camera, renderer, app, raycaster;
export let ground;
export let list, drawer;
export let canvas, gl;

async function init(){

    app = document.getElementById( 'app');
    document.body.appendChild(app);

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
    app.addEventListener('mousedown', selectDraggableObject);
    app.addEventListener('click', selectDraggableObject);
    app.addEventListener('dblclick', selectObject);

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

        tweenCamera(new Vector(-7, 9, -16), 3000);

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

    canvas = document.createElement('canvas');
    gl = canvas.getContext( 'webgl2', { alpha: false } );

    renderer = new THREE.WebGLRenderer( { canvas: canvas, context: gl } );
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize( app.clientWidth, app.clientHeight );
    renderer.gammaOutput = true;
    app.appendChild(renderer.domElement);

}


function createScene(){
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x3d4043);
    scene.fog = new THREE.Fog(0x3d4043, 15, 60);
}


function createCamera(){
    const fov = 25;
    const aspect = app.clientWidth / app.clientHeight;
    const near = 0.1;
    const far = 100;
    camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

    camera.position.set(-4, 100, 12);
    camera.lookAt(0,0,0);
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

        camera.aspect = app.clientWidth / app.clientHeight;
        camera.updateProjectionMatrix();

        canvas.width = app.clientWidth;
        canvas.height = app.clientHeight;

        canvas.style.width = app.clientWidth + 'px';
        canvas.style.height = app.clientHeight + 'px';

        gl.clearColor(0.0, 0.0, 0.0, 1.0);
		gl.viewport(0.0, 0.0, app.clientWidth, app.clientHeight);

		animate();
    };
}


export function animate() {

    window.requestAnimationFrame( animate );

    TWEEN.update();

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



