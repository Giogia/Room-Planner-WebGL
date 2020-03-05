import * as webGL from "../webGL.js"
import utils from "../maths/Utils.js";

class Material{

	constructor(name, shaderName, color = "000000"){

		this.name = name;
		this.color = color;
    	this.opacity = null;

		this.shader = webGL.env.shaders.get(shaderName);

		webGL.env.materials.set(name, this);

		return this
	}

	applyUniforms(){

		if(this.color.length === 3) this.shader.setUniform('color', this.color);

		else this.shader.setUniform('color', utils.hexToRgb(this.color));

	}
}

export default Material;