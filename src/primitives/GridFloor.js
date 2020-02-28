import gl from "../webGL.js";
import Renderable from "../entities/Renderable.js";
import createVAO from "../entities/VertexArray.js"

class GridFloor{

	constructor(gridSize = 0.2, lines = 70, position = 0) {

		this.vao = createVAO("GridFloor", 4, gridVertices(gridSize, lines));
		this.model = new Renderable(this.vao, "MatGridFloor");

		this.model.drawMode = gl.LINES;
	}
}

function gridVertices(gridSize, lines){

		let vertices = [];
		let size = lines * gridSize;  //Total Size of grid

		for(let i=1; i <= lines; i++){

			let position = i * gridSize;

			vertices.push(	position,0,size,0, position,0,-size,0,
								-position,0,size,0, -position,0,-size,0,
								-size,0,position,0, size,0,position,0,
								-size,0,-position,0, size,0,-position,0
			);
		}
		vertices.push(-size,0,0,1, size,0,0,1, 0,0,size,2, 0,0,-size,2);

		return vertices;
	}

export default GridFloor;