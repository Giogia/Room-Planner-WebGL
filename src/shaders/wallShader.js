let name = "wallShader";

let ubos = [ "UBOGlobal" ];

let uniforms = [{'name':'color', 'type':'vec3'},
                {'name':'modelMatrix', 'type':'mat4'}];

let vertexShader =
    `#version 300 es
    
    layout(location=0) in vec3 position;
    
    uniform UBOGlobal{
        mat4 matProjection;
    };
    
    uniform mat4 modelMatrix;
    uniform vec3 color;
    
    out vec3 oColor;
    
    void main(void){
        oColor = color;
        gl_Position = matProjection * modelMatrix * vec4(position.xyz,1.0);
    }`;


let fragmentShader =
    `#version 300 es
    
	precision mediump float;
	in lowp vec3 oColor;
	out vec4 outColor;

	void main(void){
		outColor = vec4(oColor,1.0);
	}`;

let wallShader = {
    name            : name,
    ubos            : ubos,
    uniforms        : uniforms,
    vertexShader    : vertexShader,
    fragmentShader  : fragmentShader,
};

export default wallShader