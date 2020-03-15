import Transform from "./Transform.js";
import gl from "../webGL.js";
import Material from "./Material.js";
import * as webGL from '../webGL.js';

class Renderable extends Transform{

	constructor(name =  "unidentified", vao= null, material = null, shader = 'basicColorShader', drawMode = gl.TRIANGLES){

		super();
		this.name			= name;
		this.uuid 			= this.uuid();
		this.useCulling		= true;
		this.useDepthTest	= true;
		this.useBlending	= true;
		this.useAlphaCov	= true;
		this.drawMode		= drawMode;
		this.items			= new Map();
		this.shader 		= shader;
		this.boundingBox    = null;

		if(vao) this.addItem(vao, material);
	}

	uuid() {
	  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		let r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
		return v.toString(16);
	  });
	}


	addItem(vao, material){

		material = new Material(material, this.shader);

		this.items.set(vao.name, {'vao':vao, 'material': material});
	}

	setColor(color){
		for(let item of this.items.values()){
			item.material.setColor(color);
		}
	}

	setOpacity(opacity){
		for(let item of this.items.values()){
			item.material.opacity = opacity;
		}
	}

	setTexture(name, repeat =[1,1]){
		for(let item of this.items.values()){
			item.material.setTexture(name, repeat);
			item.material.shader = webGL.env.shaders.get('textureShader');
		}
	}

	draw(vao, wireframe = false) {

		if (vao.count === 0) return;

		gl.bindVertexArray(vao.id);

		if (vao.isIndexed)
			gl.drawElements((wireframe ? gl.LINE_LOOP : this.drawMode), vao.count, gl.UNSIGNED_SHORT, 0);

		else
			gl.drawArrays((wireframe ? gl.LINE_LOOP : this.drawMode), 0, vao.count);

	}
}

export default Renderable;