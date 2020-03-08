import * as webGL from "./webGL.js"
import RenderLoop from "./entities/RenderLoop.js";
import Camera from "./entities/Camera.js";
import {enableOrbitControls} from "./controls2.js";
import createShader from "./entities/Shader.js";
import UBO from "./entities/UniformBuffer.js"
import wallShader from "./shaders/wallShader.js"
import GridFloor from "./primitives/GridFloor.js";
import Wall from "./primitives/Wall.js"
import Column from "./primitives/Column.js"
import render from "./entities/Renderer.js";
import {importGlb} from "./loader.js";
import {furniture} from "./furnitureList.js";
import Scene from "./entities/Scene.js"
import Light from "./entities/Light.js";
import utils from "./maths/Utils.js";
import Ground from "./primitives/Ground.js";

let camera,
    app,
    ubo,
    scene,
    light,
    renderLoop;

async function run(){

    webGL.init();
    webGL.setSize();
    webGL.setColor("#ffffff");				//Set clear color
    webGL.clearFrame();

    createUbo();

    scene = new Scene();

    let shader = createShader(wallShader);
    shader.bind();

    app = document.getElementById( 'app');
    document.body.appendChild(app);

    createCamera();

    enableOrbitControls();

    light = new Light();
    light.setPosition(5,20,5);

    light.setColor('ffffff');

    renderLoop = new RenderLoop(onRender, 60).start();

    let gridFloor = new GridFloor();
    scene.add(gridFloor);

    let ground = new Ground();
    scene.add(ground);


    let wall = new Wall(5,1,0.2);
    wall.position.set(2.5,0.5,0);
    scene.add(wall);

    let column = new Column();
    column.position.set(0,0,0);
    scene.add(column);

   // Every model in row
    for(let i=0; i< furniture.length; i++){

        let model = await importGlb(furniture[i]);
        model.position.set(-0.2*i,0,0);
        scene.add(model);
    }

    autoResize();
}


function onRender(){
    camera.update();
    webGL.clearFrame();
    render(scene);
}

function createCamera(){

    const fov = 45;
    const aspect = app.clientWidth / app.clientHeight;
    const near = 0.1;
    const far = 100;
    camera = new Camera(fov, aspect, near, far);

    camera.position.set(0, 0.5, 4);
    camera.lookAt(0,0,0);
}

function createUbo(){
    ubo = new UBO();
    ubo.setItem('specular_color', utils.hexToRgb('ffffff'));
    ubo.setItem('specular_shine', 100 );
}


function autoResize(){

    window.onresize = () => {

        camera.aspect = app.clientWidth / app.clientHeight;
        camera.updatePerspectiveMatrix();
        camera.updateProjectionMatrix();

        webGL.setSize();
    };
}

run();

export { app, camera, ubo };