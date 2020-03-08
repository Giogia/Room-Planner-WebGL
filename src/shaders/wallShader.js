let name = "wallShader";

let ubos = [ "UBO" ];

let uniforms = [{'name':'color', 'type':'vec3'},
                {'name':'world_matrix', 'type':'mat4'}];


let vertexShader =
    `#version 300 es
    
    layout(location=0) in vec3 position;
    layout(location=1) in vec3 normal;
    
    uniform UBO{
        vec3 camera_position;
        mat4 projection_matrix;
        vec3 light_position;
        vec3 light_color;
    };
    
    uniform mat4 world_matrix;
    uniform vec3 color;
    
    out vec3 fs_color;
    out vec3 fs_position;
    out vec3 fs_normal;
    
    void main(void){
    
        fs_color = color;
        fs_position = (world_matrix * vec4(position, 1.0)).xyz;
	    fs_normal = normal;
	
        gl_Position = projection_matrix * world_matrix * vec4(position.xyz,1.0);
    }`;


let fragmentShader =
    `#version 300 es
    
	precision highp float;
	
	in vec3 fs_color;
	in vec3 fs_position;
    in vec3 fs_normal;
    
    uniform UBO{
        vec3 camera_position;
        mat4 projection_matrix;
        vec3 light_position;
        vec3 light_color;
	};
	
	out vec4 color;

	void main(void){
	
	    vec3 light_direction = normalize(light_position);
	    vec3 normal = normalize(fs_normal);
	    vec3 diffuse = fs_color * light_color * clamp(dot(light_direction, normal), 0.0, 1.0);
	    
	    vec3 r = 2.0 * (normal * dot(light_direction, normal)) - light_direction;
	    vec3 eye_direction = normalize(camera_position - fs_position);
	    
		color = vec4(diffuse,1.0);
	}`;

let fragmentShader2 =
    `#version 300 es
    
	precision highp float;
	
	in vec3 fs_color;
	in vec3 fs_position;
    in vec3 fs_normal;
    
    in vec3 specular_color
    in float specular_shine
	
	out vec4 color;

	void main(void){
	
		vec3 light_direction = normalize(light_position);
        vec3 normal = normalize(fs_normal);
        vec4 diffuse = fs_color * light_color * clamp(dot(light_direction, normal), 0.0, 1.0);
        
        vec3 r = 2.0 * (normal * dot(light_direction, normal)) - light_direction;
        vec3 eye_direction = normalize(camera_position - fs_position);
        vec4 specular = specular_color * light_color * pow(clamp(dot(eye_direction, r), 0.0, 1.0), specular_shine);
        
        vec4 ambient = ambient_light_color * ambColor;
        
        color = clamp(diffuse + specular + ambient + emit, 0.0, 1.0);
	}`;

let wallShader = {
    name            : name,
    ubos            : ubos,
    uniforms        : uniforms,
    vertexShader    : vertexShader,
    fragmentShader  : fragmentShader,
};

export default wallShader