import utils from "./maths/Utils.js";

let gl, canvas;

let app = document.getElementById( 'app');

let env = { shaders    : new Map(),
            materials  : new Map(),
            vaos       : new Map(),
            ubos       : new Map(),
            textures   : new Map(),
};

function init(){

    canvas = document.createElement('canvas');
    app.appendChild(canvas);

    gl = canvas.getContext( 'webgl2', { alpha: false } );

    gl.cullFace(gl.BACK);								//Back is also default
    gl.frontFace(gl.CCW);								//Dont really need to set it, its ccw by default.
    gl.enable(gl.DEPTH_TEST);							//Shouldn't use this, use something else to add depth detection
    gl.enable(gl.CULL_FACE);							//Cull back face, so only show triangles that are created clockwise
    gl.depthFunc(gl.LEQUAL);							//Near things obscure far things
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);	//Setup default alpha blending

}


function clearFrame(){

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    return this;
}


function setColor(hex){

	let rgb = utils.hexToRgbArray(hex);
	gl.clearColor(rgb[0],rgb[1],rgb[2],1.0);
	return this;
}


function setSize(){
    canvas.width = app.clientWidth;
    canvas.height = app.clientHeight;

    canvas.style.width = app.clientWidth + 'px';
    canvas.style.height = app.clientHeight + 'px';

    gl.viewport(0.0, 0.0, app.clientWidth, app.clientHeight);
}


function createArrayBuffer (array, staticDraw = true){

    let buffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, array, (staticDraw)? gl.STATIC_DRAW : gl.DYNAMIC_DRAW );
    gl.bindBuffer(gl.ARRAY_BUFFER,null);

    return buffer;
}


function createShader(type, source) {

    let shader = gl.createShader(type);

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    // if successfully compiled
    if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    return shader;
    }

    // log error
    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
}


function createProgram(vertexShader, fragmentShader) {

    let program = gl.createProgram();

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);

    gl.linkProgram(program);

    // if successfully compiled
    if (gl.getProgramParameter(program, gl.LINK_STATUS)) {

        gl.detachShader(program,vertexShader);
        gl.detachShader(program,fragmentShader);

        gl.deleteShader(vertexShader);
        gl.deleteShader(fragmentShader);
        return program;
  }

    // log error
    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
}


function shaderProgram(vertexShaderSource, fragmentShaderSource){

    let vertexShader = createShader(gl.VERTEX_SHADER, vertexShaderSource);
    let fragmentShader = createShader(gl.FRAGMENT_SHADER, fragmentShaderSource);

    return createProgram(vertexShader, fragmentShader);
}


export { gl as default, canvas, env, init, clearFrame, setColor, setSize, createArrayBuffer, shaderProgram };



