let name = "roomPlanner";

let ubos = [ "UBO" ];

let uniforms = [{'name':'color', 'type':'vec4'},
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
        vec3 ambient_light_color;
        vec3 specular_color;
        float specular_shine;
        vec3 fog_color;
        float fog_density;
    };
    
    uniform mat4 world_matrix;
    uniform vec4 color;
    
    out vec4 fs_color;
    out vec4 fs_ambient_color;
    out vec3 fs_position;
    out vec3 fs_normal;
    
    void main(void){
    
        fs_color = color;
        fs_ambient_color = color;
        fs_position = (world_matrix * vec4(position, 1.0)).xyz;
	    fs_normal = normal;
	
        gl_Position = projection_matrix * world_matrix * vec4(position.xyz,1.0);
    }`;


let fragmentShader =
    `#version 300 es
    
	precision highp float;
	
	in vec4 fs_color;
	in vec4 fs_ambient_color;
	in vec3 fs_position;
    in vec3 fs_normal;
    
    in float fog_depth;
    
    uniform UBO{
        vec3 camera_position;
        mat4 projection_matrix;
        vec3 light_position;
        vec3 light_color;
        vec3 ambient_light_color;
        vec3 specular_color;
        float specular_shine;
        vec3 fog_color;
        float fog_density;
        
	};
	
	out vec4 color;

	void main(void){
	
	    vec3 light_direction = normalize(light_position);
	    vec3 normal = normalize(fs_normal);
	    vec3 diffuse = fs_color.xyz * light_color * clamp(dot(light_direction, normal), 0.0, 1.0);
	    
	    vec3 r = 2.0 * (normal * dot(light_direction, normal)) - light_direction;
	    vec3 eye_direction = normalize(camera_position - fs_position);
	    vec3 specular = specular_color * light_color * pow(clamp(dot(eye_direction, r), 0.0, 1.0), specular_shine);
	    
	    vec3 ambient = ambient_light_color * fs_ambient_color.xyz;
	    
		color = vec4(clamp(diffuse + specular + ambient, 0.0, 1.0), fs_color.a);
		
		#define LOG2 1.442695
		float fog_distance = length(fs_position);
		float fog_amount = 1.0 - exp2( - fog_density * fog_density * fog_distance * fog_distance * LOG2);
		
		color = mix(color, vec4(fog_color,1.0), clamp(fog_amount, 0.0, 1.0));  
	}`;


let roomPlanner = {
    name            : name,
    ubos            : ubos,
    uniforms        : uniforms,
    vertexShader    : vertexShader,
    fragmentShader  : fragmentShader,
};

export default roomPlanner