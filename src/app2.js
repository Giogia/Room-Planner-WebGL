import * as webGL from "./webGL.js"
import gl from "./webGL.js"
import RenderLoop from "./RenderLoop.js";
import Camera from "./entities/Camera.js";
import {enableOrbitControls} from "./controls2.js";
import createShader from "./Shader.js";
import buildUBO from "./entities/UniformBuffer.js"
import test from "./shaders/test.js"
import GridFloor from "./primitives/GridFloor.js";

let aPositionLoc,
    uAngle,
    uPointSizeLoc,
    verticesCount,
    camera,
    app,
    gridFloor,
    scene = [],
    renderLoop;

function run(){

    webGL.init();
    webGL.setSize();
    webGL.setColor("#ffffff");				//Set clear color
    webGL.clearFrame();

    let uboGlobal = buildUBO( "UBOGlobal", 0, [
        {name:"matProjection",type:"mat4"},
        {name:"matCameraView",type:"mat4"},
        {name:"posCamera",type:"vec3"}
        ]);

    let shader = createShader(test);
    shader.bind();

    app = document.getElementById( 'app');
    document.body.appendChild(app);

    createCamera();
    camera.position.set(0,1,3);

    enableOrbitControls();

    renderLoop = new RenderLoop(onRender, 60).start();

    let gridFloor = new GridFloor().model;

    autoResize();
}

let gPointSize	= 0,
    gPSizeStep	= 3,
    gAngle		= 0,
    gAngleStep	= (Math.PI / 180.0) * 90;	//90 degrees in Radians

function onRender(dt){

    gPointSize += gPSizeStep * dt;
    let size = (Math.sin(gPointSize) * 10.0) + 30.0;
    gl.uniform1f(uPointSizeLoc,size);						//Store data to the shader's uniform variable uPointSize

    gAngle += gAngleStep * dt;								//Update the angle at the rate of AngleStep Per Second
    gl.uniform1f(uAngle,gAngle);							//Pass new angle value to the shader.

    webGL.clearFrame();
    gl.drawArrays(gl.POINTS, 0, verticesCount);					//Draw the points
}

function createCamera(){

    const fov = 25;
    const aspect = app.clientWidth / app.clientHeight;
    const near = 0.1;
    const far = 100;
    camera = new Camera(fov, aspect, near, far);

    camera.position.set(-4, 100, 12);
    camera.lookAt(0,0,0);
}


function autoResize(){

    window.onresize = () => {

        camera.aspect = app.clientWidth / app.clientHeight;
        camera.updateProjectionMatrix();

        webGL.setSize();
    };
}

run();

export { app, camera };