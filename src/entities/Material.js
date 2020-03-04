import * as webGL from "../webGL.js"
import utils from "../maths/Utils.js";

class Material{

	constructor(name, shaderName){

		this.uniforms = new Map();
		this.shader = webGL.env.shaders.get(shaderName);

		webGL.env.materials.set(name, this);

		return this
	}

	setUniforms(uniforms){

		for(let uniform of uniforms){

			if(uniform.type === "hex")
				this.uniforms.set(uniform.name, utils.hexToRgbArray(uniform.data) );

			if(uniform.type === "rgb")
				this.uniforms.set(uniform.name, uniform.data);
		}
	}

	applyUniforms(){

		for(let uniformName of this.uniforms.keys()){
			this.shader.setUniform(uniformName, this.uniforms.get(uniformName));
		}

		return this;
	}
}

export default Material;