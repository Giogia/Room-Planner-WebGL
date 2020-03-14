import Vector from '../maths/Vector'
import VAO from "../entities/VertexArray";
import Renderable from "../entities/Renderable";
import gl from "../webGL"

class BoundingBox{
    constructor(vertices){

        this.vertices = [];

		this.setVertices(vertices);

		this.vao = new VAO("BoundingBox", this.vertices);

		this.model = new Renderable("BoundingBox", this.vao, "BoundingBoxMaterial");
		this.model.drawMode = gl.POINTS;
		this.model.visible = false;

		this.model.min = this.min;
		this.model.max = this.max;

        return this.model
    }

    setVertices(vertices){

        let x = [];
        let y = [];
        let z = [];

        for(let i=0; i< vertices.length; i+=3){
            x.push(vertices[i]);
            y.push(vertices[i+1]);
            z.push(vertices[i+2]);
        }

        let max = new Vector(Math.max(...x), Math.max(...y), Math.max(...z));
        let min = new Vector(Math.min(...x), Math.min(...y), Math.min(...z));

        this.min = min;
        this.max = max;

        this.vertices = [
            min.x, min.y, min.z,
            min.x, min.y, max.z,
            max.x, min.y, max.z,
            max.x, min.y, min.z,
            min.x, max.y, min.z,
            min.x, max.y, max.z,
            max.x, max.y, max.z,
            max.x, max.y, min.z,
        ];
    }
}

export default BoundingBox