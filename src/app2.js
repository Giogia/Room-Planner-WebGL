import * as webGL from "./webGL.js"
import { gl } from "./webGL.js"
import { vertexShaderSource, fragmentShaderSource } from "./shaders.js";


let aPositionLoc,
    uAngle,
    uPointSizeLoc,
    verticesCount,
    renderLoop;

function run(){

    webGL.init();
    webGL.setSize();
    webGL.clearFrame();

    let program = webGL.shaderProgram(vertexShaderSource, fragmentShaderSource);

    gl.useProgram(program);

    aPositionLoc = gl.getAttribLocation(program, "a_position");
    uAngle = gl.getUniformLocation(program,"uAngle");
    uPointSizeLoc = gl.getUniformLocation(program, "uPointSize");

    gl.useProgram(null);

    let vertices = new Float32Array([0,0,0, 0.5,0.5,0]);
    let verticesBuffer = webGL.createArrayBuffer(vertices);

    verticesCount = vertices.length / 3;

    gl.useProgram(program);
    gl.uniform1f(uPointSizeLoc, 50.0);

    gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffer);
    gl.enableVertexAttribArray(aPositionLoc);
    gl.vertexAttribPointer(aPositionLoc, 3, gl.FLOAT, false, 0,0);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    //gl.drawArrays(gl.POINTS, 0, 2);
    renderLoop = new RenderLoop(onRender).start();
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

run();