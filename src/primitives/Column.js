import VAO from "../entities/VertexArray.js";
import Renderable from "../entities/Renderable.js";

class Column{
	constructor(height=1, radius=0.1, slices = 32){

	    this.height = height;
		this.radius = radius;
		this.slices = slices;

		this.vertices = [];
		this.normals = [];
		this.uv = [];
		this.indices = [];

		this.setVertices();
		this.setNormals();
		this.setUV();
		this.setIndices();

		this.vao = new VAO("Column", this.vertices, this.indices, this.normals, this.uv);

		return new Renderable("Column", this.vao, "WallMaterial");
	}

	setVertices(){

	    let vertices = [0.0, -this.height/2, 0.0, 0.0, this.height/2, 0.0];

		for(let i = 0; i < this.slices; i++) {

			vertices.push(Math.cos(2 * Math.PI / this.slices * i) * this.radius);
            vertices.push(-this.height/2);
			vertices.push(Math.sin(2 * Math.PI / this.slices * i) * this.radius);

            vertices.push(Math.cos(2 * Math.PI / this.slices * i) * this.radius);
            vertices.push(this.height/2);
			vertices.push(Math.sin(2 * Math.PI / this.slices * i) * this.radius);

        }

		this.vertices = vertices
	}

	setIndices(){

		let indices = [];

		for(let i = 0; i < this.slices; i++) {

			indices.push(0);
			indices.push(2 * i + 2);
			indices.push((i < this.slices - 1) ? 2 * i + 4 : 2);

			indices.push(1);
			indices.push((i < this.slices - 1) ? 2 * i + 5 : 3);
			indices.push(2 * i + 3);

			indices.push(2 * i + 2);
			indices.push(2 * i + 3);
			indices.push((i < this.slices - 1) ? 2 * i + 4 : 2);

			indices.push((i < this.slices - 1) ? 2 * i + 4 : 2);
			indices.push(2 * i + 3);
			indices.push((i < this.slices - 1) ? 2 * i + 5 : 3);
		}

		this.indices = indices;
	}

	setUV(){

		let uv = [];
		for(let i=0; i < 1; i++){
			uv.push(0,0, 0,1, 1,1, 1,0);
		}

		this.uv = uv;
	}

	setNormals(){

        let normals = [0.0, 0.0, 0.0, 0, 0.0, 0.0, 1.0, 0];

        for(let i = 0; i < this.slices; i++) {

			normals.push(Math.cos(2 * Math.PI / this.slices * i) * this.radius);
            normals.push(0.0);
			normals.push(Math.sin(2 * Math.PI / this.slices * i) * this.radius);

            normals.push(Math.cos(2 * Math.PI / this.slices * i) * this.radius);
            normals.push(this.height);
			normals.push(Math.sin(2 * Math.PI / this.slices * i) * this.radius);
        }

        this.normals = normals;
	}
}



export default Column;