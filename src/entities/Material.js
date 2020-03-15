import * as webGL from "../webGL.js"
import utils from "../maths/Utils.js";
import Texture from "./Texture";

class Material{

	constructor(name, shaderName, color = [0.75,0.75,0.75]){

		this.name = name;

		this.color = color;
		this.ambientColor = color;
    	this.opacity = 1.0;

    	this.texture = null;
    	this.textureRepeat = [1,1];

		this.shader = webGL.env.shaders.get(shaderName);

		webGL.env.materials.set(name, this);

		return this
	}

	setColor(color){

		color = (color.length === 3)? color : utils.hexToRgb(color);
		this.color = color;
		this.ambientColor = color;
	}

	setAmbientColor(color){

		this.ambientColor = (color.length === 3)? color : utils.hexToRgb(color);
	}

	setTexture(name, repeat = [1,1]){
		this.texture = new Texture(name);
		this.textureRepeat = repeat;
	}

	/*
	export function setTexture(name, material, repeat=[2, 2]){

		let maps = [];

		let diffuseMap = textureLoader.load( "assets/materials/"+name.toString()+"_diffuse.jpg");
		let bumpMap = textureLoader.load( "assets/materials/"+name.toString()+"_bump.jpg");
		let roughnessMap = textureLoader.load( "assets/materials/"+name.toString()+"_roughness.jpg");

		if(diffuseMap !== null){ maps.push(diffuseMap)}
		if(bumpMap !== null){ maps.push(bumpMap)}
		if(roughnessMap !== null){ maps.push(roughnessMap)}

		setMaps(maps, repeat);

		material.map = diffuseMap;
		material.bumpMap = bumpMap;
		material.roughnessMap = roughnessMap;
		material.needsUpdate = true;
	}
	 */
}

export default Material;