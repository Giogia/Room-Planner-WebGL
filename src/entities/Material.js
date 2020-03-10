import * as webGL from "../webGL.js"
import utils from "../maths/Utils.js";

class Material{

	constructor(name, shaderName, color = [0.75,0.75,0.75]){

		this.name = name;
		this.color = color;
    	this.opacity = 1.0;

		this.shader = webGL.env.shaders.get(shaderName);

		webGL.env.materials.set(name, this);

		return this
	}

	setColor(color){
		this.color = (color.length === 3)? color : utils.hexToRgb(color);
	}

	applyUniforms(){

		let rgba = [this.color[0],this.color[1],this.color[2], this.opacity];

		this.shader.setUniform('color', rgba);
	}
}

export default Material;