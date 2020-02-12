// Vertex Shader
let vertexShaderSource = `#version 300 es

in vec3 a_position;

uniform float uPointSize;

void main() {
	
	gl_PointSize = uPointSize;
	gl_Position = vec4(a_position, 1.0);
}`;

// Fragment shader
let fragmentShaderSource = `#version 300 es
precision mediump float;

out vec4 finalColor;

void main() {
	finalColor = vec4(0.0, 0.0, 0.0, 1.0);
}`;

let vertexShaderSource2 = `#version 300 es

attribute vec4 in_pos;

uniform mat4 pMatrix;

out vec3 fs_pos;
out vec3 fs_norm;
out vec2 fs_uv;

void main() {
	fs_pos = in_pos;
	
	gl_Position = pMatrix * in_pos;
}`;

// Fragment shader
let fragmentShaderSource2 = `#version 300 es
precision highp float;

in vec4 fs_pos;

uniform sampler2D u_texture;

out vec4 color;

void main() {
	color = texture(u_texture, fs_uv);
}`;

export { vertexShaderSource, fragmentShaderSource }