import Transform from "./Transform.js";
import gl from "../webGL.js";
import * as webGL from "../webGL.js";

class Renderable extends Transform{

	constructor(vao, material){
		super();
		this.vao			= vao;
		this.useCulling		= true;
		this.useDepthTest	= true;
		this.drawMode		= gl.TRIANGLES;
		this.material		= (material !== null && material !== undefined)? webGL.env.materials.get(material) : null;
	}

	setMaterial(matName){
		this.material = webGL.env.materials.get(matName);
	}

	draw(){

		if(this.vao.count === 0) return;

		gl.bindVertexArray(this.vao.id);

		if(this.vao.isIndexed)
			gl.drawElements(this.drawMode, this.vao.count, gl.UNSIGNED_SHORT, 0);
			/* wireframe
			gl.drawElements(gl.LINE_LOOP, this.vao.count, gl.UNSIGNED_SHORT, 0);
			 */
		else
			gl.drawArrays(this.drawMode, 0, this.vao.count);
	}
}

export default Renderable;