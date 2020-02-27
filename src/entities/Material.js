import * as webGL from "../webGL.js"

class Material{

	constructor(){

		this.shader = null;
		this.uniforms = [];
	}

	static create(name, shaderName){

		let material = new Material();
		material.shader = webGL.env.shaders.get(shaderName);

		webGL.env.materials.set(name, material);
		return material;
	}

	setUniforms(uName, uValue){

		let ary = (arguments.length === 1)? arguments[0] : arguments;

		for(let i=0; i < ary.length; i+=2) this.uniforms[ary[i]] = ary[i+1];  return this;
	}

	applyUniforms(){
		for(let n in this.uniforms) this.shader.setUniforms(n,this.uniforms[n]);
		return this;
	}
}