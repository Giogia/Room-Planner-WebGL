import Vector from "../maths/Vector";
import VAO from "../entities/VertexArray";
import Renderable from "../entities/Renderable";
import BoundingBox from "./BoundingBox";

class Shape{
    constructor(height = 0.03){
        this.height = height;
        this.points = [];
        this.center = null;
    }

    getCenter(){

        this.center = new Vector(0,0,0);
        let length = this.points.length;

        for(let point of this.points) this.center.set(this.center.x + point.x, this.center.y,this.center.z + point.z);

        return this.center.set(this.center.x/length, this.center.y, this.center.z/length);
    }

    getMesh(){

        let vertices = [this.center.x, this.center.y, this.center.z];
        let normals = [0,1,0];

        for(let point of this.points){
            vertices.push(point.x, point.y, point.z);
            normals.push(0,1,0);
        }

        let indices = [];

        for(let i=1; i <= this.points.length; i++){

            let next = (i === this.points.length)? 1 : i+1;

            indices.push(0, i, next);
            indices.push(0, next, i);
        }

        let vao = new VAO('room', vertices, indices, normals);

        let model = new Renderable('room', vao, 'FloorMaterial');
        model.boundingBox = new BoundingBox(vertices);
		model.boundingBox.setParent(model);
		return model;

    }
}

export default Shape;