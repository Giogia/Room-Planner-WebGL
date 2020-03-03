import createVAO from "../entities/VertexArray.js";
import Renderable from "../entities/renderable.js";

class Column{
	constructor(height=1, radius=1, slices = 5){

	    this.height = height;
		this.radius = radius;
		this.slices = slices;

		this.vertices = [];
		this.normals = [];
		this.uv = [];
		this.indices = [];

		this.setVertices();
		this.setNormals();
		//this.setUV();
		this.setIndices();

		console.log(this.vertices, this.normals, this.indices);

		this.vao = createVAO("Column", 4, this.vertices, this.normals, this.uv, this.indices);
		this.model = new Renderable(this.vao, "MatVecWColor")

	}

	setVertices(){

	    let vertices = [0.0, 0.0, 0.0, 0.0, 0.0, 1.0];

		for(let i = 0; i <= this.slices; i++) {
            vertices.push(Math.cos(2 * Math.PI / this.slices * i));
            vertices.push(Math.sin(2 * Math.PI / this.slices * i));
            vertices.push(0.0);
            vertices.push(Math.cos(2 * Math.PI / this.slices * i));
            vertices.push(Math.sin(2 * Math.PI / this.slices * i));
            vertices.push(1.0);
        }

		this.vertices = vertices
	}

	setIndices(){

		let indices = [];

		for(let i = 0; i <= this.slices; i++) {
            indices.push(0);
            indices.push((i < this.slices) ? 2 * i + 4 : 4);
            indices.push((i < this.slices) ? 2 * i + 2 : 2);
            indices.push(1);
            indices.push((i < this.slices) ? 2 * i + 3 : 3);
            indices.push((i < this.slices) ? 2 * i + 5 : 5);
            indices.push((i < this.slices) ? 2 * i + 2 : 2);
            indices.push((i < this.slices) ? 2 * i + 4 : 4);
            indices.push((i < this.slices) ? 2 * i + 3 : 3);
            indices.push((i < this.slices) ? 2 * i + 4 : 4);
            indices.push((i < this.slices) ? 2 * i + 5 : 5);
            indices.push((i < this.slices) ? 2 * i + 3 : 3);
        }

		this.indices = indices;
	}

	setUV(){

		let uv = [];
		for(let i=0; i < 6; i++){
			uv.push(0,0, 0,1, 1,1, 1,0);
		}

		this.uv = uv;
	}

	setNormals(){

        let normals = [0.0, 0.0, -1.0, 0.0, 0.0, 1.0];

        for(let i = 0; i <= this.slices; i++) {
            normals.push(Math.cos(2*Math.PI / this.slices * i));
            normals.push(Math.sin(2*Math.PI / this.slices * i));
            normals.push(-1.0);
		    normals.push(Math.cos(2*Math.PI / this.slices * i));
		    normals.push(Math.sin(2*Math.PI / this.slices * i));
		    normals.push(1.0);
        }

        this.normals = normals;
	}
}



export default Column;