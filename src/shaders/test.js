let name = "Room Planner";

let ubos = [ "UBOGlobal" ];

let uniforms = [
    { "name":"uColor", "type":"rgb" }
];

let materials = [
	{ "name":"MatVecWColor", "uniforms":[{ "name":"uColor", "type":"hex", "data":["444444","444444","444444","444444","444444","444444"]}] },
	{ "name":"MatGridFloor", "uniforms":[{ "name":"uColor", "type":"hex", "data":["e6e6e6","ff9999","66ff66"]}] }
];


let vertexShader =
    `#version 300 es
    
    layout(location=0) in vec4 a_position;
    
    uniform UBOGlobal{
        mat4 matProjection;
    };
    
    uniform mat4 modelMatrix;
    uniform vec3 uColor[10];
    
    out vec3 oColor;
    
    void main(void){
        oColor = uColor[ int(a_position.w) ];
        gl_Position = matProjection * modelMatrix * vec4(a_position.xyz,1.0);
    }`;


let fragmentShader =
    `#version 300 es
    
	precision mediump float;
	in lowp vec3 oColor;
	out vec4 outColor;

	void main(void){
		outColor = vec4(oColor,1.0);
	}`;

let test = {
    name            : name,
    ubos            : ubos,
    uniforms        : uniforms,
    materials       : materials,
    vertexShader    : vertexShader,
    fragmentShader  : fragmentShader,
};

export default test