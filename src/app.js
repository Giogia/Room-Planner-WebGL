import * as webGL from "./webGL.js";

import UBO from "./entities/UniformBuffer.js";
import Shader from "./entities/Shader.js";
import textureShader from "./shaders/TextureShader.js";
import basicColorShader from "./shaders/BasicColorShader";

import {MDCDrawer} from "@material/drawer/component";
//import {createButtons, downloadButton, showButton, viewButton} from "./buttons";

import Scene from "./entities/Scene.js";
import Camera from "./entities/Camera.js";
import Raycaster from "./entities/Raycaster";

import {enableOrbitControls} from "./controls2.js";

import Light from "./entities/Light.js";
import Ground from "./primitives/Ground.js";
import GridFloor from "./primitives/GridFloor.js";

import render from "./entities/Renderer.js";
import RenderLoop from "./entities/RenderLoop.js";

import utils from "./maths/Utils.js";
import Vector from "./maths/Vector.js";
import {createModel} from "./walls.js";
import Wall from "./primitives/Wall";
import Column from "./primitives/Column";
import {furniture} from "./furnitureList"
import {importGlb} from "./loader";
import {hideCloseWalls} from "./view";
import Line from "./primitives/Line";
import Point from "./primitives/Point";
import Texture from "./entities/Texture";
import {createButtons} from "./buttons";

let camera,
    app,
    ubo,
    scene,
    drawer,
    list,
    raycaster,
    renderLoop;

export let objects;

async function run(){

    init();

    createUbo();
    createShader(basicColorShader);
    createShader(textureShader);

    app = document.getElementById( 'app');
    document.body.appendChild(app);

    list = document.getElementById('list');

    //createDrawer();
    createButtons();

    createScene();
    createCamera();
    createRaycaster();

    enableOrbitControls();
    //enableMapControls();
    //enableDragControls();

    addLight();
    addGround();

    /*list.addEventListener('click', addObject);
    app.addEventListener('mousedown', selectDraggableObject);
    app.addEventListener('click', selectDraggableObject);
    app.addEventListener('dblclick', selectObject);

    await createModel();
    await initObjects();
     */

    //await createModel();

    /*
    let point = new Point();
    scene.add(point);

    let line = new Line(new Vector(-5,0,-2.5), new Vector(-5,0,-5));
    scene.add(line);
    */

    /*
    let wall = new Wall(2,2,2);
    wall.position.set(0,2,0);
    wall.setTexture('terracotta', [2,1]);
    wall.setOpacity(0);
    wall.rotation.rotateY(utils.degToRad(45));
    scene.add(wall);
    scene.add(wall.boundingBox);

    let column = new Column();
    column.position.set(0,0,0);
    scene.add(column);
     */


   /* Every model in row */
    objects = [];
    for(let i=0; i< furniture.length; i++){

        let model = await importGlb(furniture[i]);
        model.position.set(-0.9*i,0,0);
        scene.add(model);
        objects.push(model);
    }


    autoResize();
    animate();

    //loadingAnimation();
}


function init(){

    webGL.init();
    webGL.setSize();
    webGL.setColor('#2E3236');				//Set clear color
    webGL.clearFrame();
}


function createUbo(){

    ubo = new UBO();
    ubo.setItem('specular_color', utils.hexToRgb('#626262'));
    ubo.setItem('specular_shine', 100 );
    ubo.setItem('fog_color', utils.hexToRgb('#2E3236'));
    ubo.setItem('fog_density', 0.04 );
}


function createShader(source){

    let shader = new Shader(source.name, source.vertexShader, source.fragmentShader, source.uniforms, source.ubos);
    shader.bind();
}


function createDrawer() {
    drawer = new MDCDrawer.attachTo(document.getElementsByClassName("mdc-drawer")[0]);
    drawer.open = true;
}


function createScene(){
    scene = new Scene();
}


function createCamera(){

    const fov = 45;
    const aspect = app.clientWidth / app.clientHeight;
    const near = 0.1;
    const far = 100;
    camera = new Camera(fov, aspect, near, far);

    camera.position.set(-4, 10, 12);
    camera.lookAt(0,0,0);
}

function createRaycaster(){
    raycaster = new Raycaster();
}

function addLight(){

    let light = new Light();
    light.setPosition(5,20,5);
    light.setColor('#ffffff');
}

function addGround(){

    let gridFloor = new GridFloor();
    scene.add(gridFloor);

    let ground = new Ground();
    scene.add(ground);
}


function autoResize(){

    window.onresize = () => {

        camera.aspect = app.clientWidth / app.clientHeight;
        camera.updatePerspectiveMatrix();
        camera.updateProjectionMatrix();

        webGL.setSize();
    };
}

function animate(){
    renderLoop = new RenderLoop(onRender, 60);
    renderLoop.start();
}


function onRender(){
    camera.update();
    webGL.clearFrame();
    //hideCloseWalls();
    render(scene);
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

run();

export { app, camera, raycaster, ubo, scene, drawer, list };