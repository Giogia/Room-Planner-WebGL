import gl from '../webGL.js'
import * as webGL from '../webGL.js'

const ATTR_POSITION_LOC = 0;
const ATTR_NORM_LOC = 1;
const ATTR_UV_LOC = 2;

class VAO{
	constructor(){

		this.buffers = new Map();
		this.id = gl.createVertexArray();
		this.isIndexed = false;
		this.count = 0;

		gl.bindVertexArray(this.id);
	}

	static create(name, vertSize, vertices, normals = null, uv = null, indices = null){

		let vao = new VAO();

		vao.floatArrayBuffer("vert", vertices, ATTR_POSITION_LOC,vertSize,0,0,true);
		vao.count = vao.buffers.get("vert").count;

		if(normals)	vao.floatArrayBuffer("norm", normals, ATTR_NORM_LOC,3,0,0,true);
		if(uv)	vao.floatArrayBuffer("uv", uv, ATTR_UV_LOC,2,0,0,true);
		if(indices) vao.indexBuffer("index", indices,true);

		gl.bindVertexArray(null);
		gl.bindBuffer(gl.ARRAY_BUFFER,null);
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,null);
		webGL.env.vaos.set(name, vao);

		return vao;
	}

	floatArrayBuffer(name, vertices, attrLoc, size, stride = 0, offset = 0, isStatic, isInstance = false){

		let buffer = gl.createBuffer();
		let array = (vertices instanceof Float32Array)? vertices : new Float32Array(vertices);

		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
		gl.bufferData(gl.ARRAY_BUFFER, array, (isStatic !== false)? gl.STATIC_DRAW : gl.DYNAMIC_DRAW );
		gl.enableVertexAttribArray(attrLoc);
		gl.vertexAttribPointer(attrLoc, size, gl.FLOAT,false, stride, offset);

		if(isInstance === true) gl.vertexAttribDivisor(attrLoc, 1);

		this.buffers.set(name, {
			buffer: buffer,
			size:size,
			stride:stride,
			offset:offset,
			count:vertices.length / size
		});
	}

	indexBuffer(name, indices, isStatic){

		let buffer = gl.createBuffer();
		let array = (indices instanceof Uint16Array)? indices : new Uint16Array(indices);

		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, array, (isStatic !== false)? gl.STATIC_DRAW : gl.DYNAMIC_DRAW );

		this.buffers.set(name, {
			buffer:gl.createBuffer(), count:indices.length
		});

		this.isIndexed = true;
		this.count = indices.length;
	}

}

export default VAO.create
