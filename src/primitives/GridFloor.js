import gl from "../webGL.js";
import Renderable from "../entities/Renderable.js";
import VAO from "../entities/VertexArray.js"

class GridFloor{

	constructor(gridSize = 1, lines = 100, position = 0) {

		this.vao = new VAO("GridFloor", gridVertices(gridSize, lines));
		this.model = new Renderable("GridFloor", this.vao, "GridFloorMaterial");

		this.model.setColor("#1b1b1b");
		this.model.drawMode = gl.LINES;

		return this.model;
	}
}

function gridVertices(gridSize, lines){

		let vertices = [];
		let size = lines * gridSize;  //Total Size of grid

		let height = -0.0005;

		for(let i=1; i <= lines; i++){

			let position = i * gridSize;

			vertices.push(	position,height,size,  position,height,-size,
							-position,height,size, -position,height,-size,
							-size,height,position, size,height,position,
							-size,height,-position, size,height,-position
			);
		}
		vertices.push(-size,height,0, size,height,0, 0,height,size, 0,height,-size);

		return vertices;
	}

export default GridFloor;