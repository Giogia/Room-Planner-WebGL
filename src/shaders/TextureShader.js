let name = "textureShader";

let ubos = [ "UBO" ];

let uniforms = [
    {'name':'world_matrix', 'type':'mat4'},
    {'name':'fs_color', 'type':'vec4'},
    {'name':'fs_texture', 'type':'sampler2D'},
    {'name':'fs_texture_repeat', 'type':'vec2'}];


let vertexShader =
    `#version 300 es
    
    layout(location=0) in vec3 position;
    layout(location=1) in vec3 normal;
    layout(location=2) in vec2 uv;
    
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
    
    out vec3 fs_position;
    out vec3 fs_normal;
    out vec2 fs_uv;
    
    void main(void){
    
        fs_position = (world_matrix * vec4(position, 1.0)).xyz;
	    fs_normal = normal;
	    fs_uv = uv;
	
        gl_Position = projection_matrix * world_matrix * vec4(position.xyz,1.0);
    }`;


let fragmentShader =
    `#version 300 es
    
	precision highp float;
	
	in vec3 fs_position;
    in vec3 fs_normal;
    in vec2 fs_uv;
    
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
	
	uniform vec4 fs_color;
	uniform sampler2D fs_texture;
	uniform vec2 fs_texture_repeat;
	
	out vec4 color;

	void main(void){
	
	    vec3 final_texture = texture(fs_texture, fs_uv * fs_texture_repeat).xyz;
	
	    vec3 light_direction = normalize(light_position);
	    vec3 normal = normalize(fs_normal);
	    vec3 diffuse = fs_color.xyz * light_color * clamp(dot(light_direction, normal), 0.0, 1.0);
	    
	    vec3 r = 2.0 * (normal * dot(light_direction, normal)) - light_direction;
	    vec3 eye_direction = normalize(camera_position - fs_position);
	    vec3 specular = specular_color * light_color * pow(clamp(dot(eye_direction, r), 0.0, 1.0), specular_shine);
	    
	    vec3 ambient = ambient_light_color * fs_color.xyz;
	    
		color = vec4(clamp(diffuse + specular + ambient, 0.0, 1.0), fs_color.a);
		color = clamp( 0.4 * color + vec4( 0.6 * final_texture, 1.0), 0.0, 1.0);
		
		#define LOG2 1.442695
		float fog_distance = length(fs_position);
		float fog_amount = 1.0 - exp2( - fog_density * fog_density * fog_distance * fog_distance * LOG2);
		
		color = mix(color, vec4(fog_color,1.0), clamp(fog_amount, 0.0, 1.0));  
		
	}`;


let textureShader = {
    name            : name,
    ubos            : ubos,
    uniforms        : uniforms,
    vertexShader    : vertexShader,
    fragmentShader  : fragmentShader,
};

export default textureShader