import gl from "../webGL.js";
import Renderable from "../entities/Renderable.js";
import VAO from "../entities/VertexArray.js"

class GridFloor{

	constructor(gridSize = 1, lines = 70, position = 0) {

		this.vao = new VAO("GridFloor", gridVertices(gridSize, lines));
		this.model = new Renderable(this.vao, "GridFloorMaterial", "wallShader");

		this.model.setColor("aaaaaa");
		this.model.drawMode = gl.LINES;

		return this.model;
	}
}

function gridVertices(gridSize, lines){

		let vertices = [];
		let size = lines * gridSize;  //Total Size of grid

		for(let i=1; i <= lines; i++){

			let position = i * gridSize;

			vertices.push(	position,0,size,  position,0,-size,
							-position,0,size, -position,0,-size,
							-size,0,position, size,0,position,
							-size,0,-position, size,0,-position
			);
		}
		vertices.push(-size,0,0, size,0,0, 0,0,size, 0,0,-size);

		return vertices;
	}

export default GridFloor;