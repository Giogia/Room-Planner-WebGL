import * as webGL from "./webGL.js"
import RenderLoop from "./RenderLoop.js";
import Camera from "./entities/Camera.js";
import {enableOrbitControls} from "./controls2.js";
import createShader from "./Shader.js";
import buildUBO from "./entities/UniformBuffer.js"
import test from "./shaders/test.js"
import GridFloor from "./primitives/GridFloor.js";
import Wall from "./primitives/Wall.js"
import Column from "./primitives/Column.js"
import render from "./Renderer.js";
import {importGlb} from "./loader.js";

let camera,
    app,
    uboGlobal,
    scene = [],
    renderLoop;

function run(){

    webGL.init();
    webGL.setSize();
    webGL.setColor("#ffffff");				//Set clear color
    webGL.clearFrame();

    uboGlobal = buildUBO( "UBOGlobal", 0, [{name:"matProjection",type:"mat4"}]);

    let shader = createShader(test);
    shader.bind();

    app = document.getElementById( 'app');
    document.body.appendChild(app);

    createCamera();

    enableOrbitControls();

    renderLoop = new RenderLoop(onRender, 60).start();

    let gridFloor = new GridFloor();
    scene.push(gridFloor.model);

    let wall = new Wall(5,1,0.2);
    wall.model.position.set(2.5,0.5,0);
    scene.push(wall.model);


    let column = new Column();
    column.model.position.set(0,0,0);
    scene.push(column.model);

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


function autoResize(){

    window.onresize = () => {

        camera.aspect = app.clientWidth / app.clientHeight;
        camera.updatePerspectiveMatrix();
        camera.updateProjectionMatrix();

        webGL.setSize();
    };
}

run();

export { app, camera, uboGlobal };