import VAO from "../entities/VertexArray.js";
import Renderable from "../entities/Renderable.js";

class Point {
    constructor( size = 0.075, slices = 32) {

        this.vertices = [];
        this.normals = [];
        this.indices = [];

        this.size = size;
        this.slices = slices;

        this.setVertices();
        this.setNormals();
        this.setIndices();

        this.vao = new VAO("Point", this.vertices, this.indices, this.normals);

        return new Renderable("Point", this.vao, "WallMaterial", "roomPlanner");
    }

    setVertices(){

        let vertices = [0,0,0];

        for(let i=0; i < this.slices; i++){
            vertices.push(Math.cos(2 * Math.PI / this.slices * i) * this.size);
            vertices.push(0.0);
			vertices.push(Math.sin(2 * Math.PI / this.slices * i) * this.size);
        }

        this.vertices = vertices;

    }

    setNormals(){

        let normals = [];

        for(let i=0; i <= this.slices; i++) {
            normals.push(0,1,0);
        }

        this.normals = normals;
    }


    setIndices(){

        let indices = [];

        for(let i=0; i < this.slices; i++){
            indices.push(0);
            indices.push((i < this.slices - 1) ? i + 2 : 1);
            indices.push(i + 1);
        }

        this.indices = indices;
    }

}

export default Point;