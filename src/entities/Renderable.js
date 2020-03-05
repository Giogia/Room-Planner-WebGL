import Transform from "./Transform.js";
import gl from "../webGL.js";
import * as webGL from "../webGL.js";
import Material from "./Material.js";

class Renderable extends Transform{

	constructor(vao, material, shader, drawMode = gl.TRIANGLES){
		super();
		this.vao			= vao;
		this.useCulling		= true;
		this.useDepthTest	= true;
		this.drawMode		= drawMode;
		this.material		= (webGL.env.materials.get(material))? webGL.env.materials.get(material) : new Material(material, shader);
	}

	draw(wireframe = false){

		if(this.vao.count === 0) return;

		gl.bindVertexArray(this.vao.id);

		if(this.vao.isIndexed)
			gl.drawElements((wireframe? gl.LINE_LOOP : this.drawMode), this.vao.count, gl.UNSIGNED_SHORT, 0);

		else
			gl.drawArrays((wireframe? gl.LINE_LOOP : this.drawMode), 0, this.vao.count);
	}
}

export default Renderable;