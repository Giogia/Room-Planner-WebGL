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
}

export default Material;