// Vertex Shader
let vertexShaderSource = `#version 300 es
#define POSITION_LOCATION 0
#define NORMAL_LOCATION 1
#define UV_LOCATION 2

layout(location = POSITION_LOCATION) in vec3 in_pos;
layout(location = NORMAL_LOCATION) in vec3 in_norm;
layout(location = UV_LOCATION) in vec2 in_uv;

uniform mat4 pMatrix;

out vec3 fs_pos;
out vec3 fs_norm;
out vec2 fs_uv;

void main() {
	fs_pos = in_pos;
	fs_norm = in_norm;
	fs_uv = vec2(in_uv.x,1.0-in_uv.y);
	
	gl_Position = pMatrix * vec4(in_pos, 1);
}`;

// Fragment shader
let fragmentShaderSource = `#version 300 es
precision highp float;

in vec3 fs_pos;
in vec3 fs_norm;
in vec2 fs_uv;

uniform sampler2D u_texture;

out vec4 color;

void main() {
	color = texture(u_texture, fs_uv);
}`;

let gl;

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
      return program;
  }

  // log error
  console.log(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
}


let vertexShader = createShader(gl.VERTEX_SHADER, vertexShaderSource);
let fragmentShader = createShader(gl.FRAGMENT_SHADER, fragmentShaderSource);

export var program = createProgram(vertexShader, fragmentShader);