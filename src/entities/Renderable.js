import Transform from "./Transform.js";
import gl from "../webGL.js";
import * as webGL from "../webGL.js";
import Material from "./Material.js";

class Renderable extends Transform{

	constructor(vao= null, material = null, shader, drawMode = gl.TRIANGLES){

		super();
		this.useCulling		= true;
		this.useDepthTest	= true;
		this.drawMode		= drawMode;
		this.items			= new Map();

		if(vao) this.addItem(vao, material, shader);
	}

	addItem(vao, material, shader){

		material = (webGL.env.materials.get(material))? webGL.env.materials.get(material) : new Material(material, shader);

		this.items.set(vao.name, {'vao':vao, 'material': material});
	}

	setColor(color){
		for(let item of this.items.values()){
			item.material.setColor(color);
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