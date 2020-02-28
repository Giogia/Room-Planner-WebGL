import * as webGL from "../webGL.js"
import utils from "../maths/Utils.js";

class Material{

	constructor(){

		this.shader = null;
		this.uniforms = new Map();
	}

	static create(name, shaderName){

		let material = new Material();
		material.shader = webGL.env.shaders.get(shaderName);

		webGL.env.materials.set(name, material);
		return material;
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

		for(let uniform of this.uniforms)
			this.shader.setUniform(uniform);

		return this;
	}
}

export default Material.create;