import VAO from "../entities/VertexArray.js";
import Renderable from "../entities/Renderable.js";

class Line {
    constructor(start, end, size = 0.04) {

        this.vertices = [];
        this.normals = [0,1,0, 0,1,0, 0,1,0, 0,1,0];
        this.indices = [0,2,1, 1,2,3, 0,1,2, 1,3,2];

        this.setVertices(start, end, size);

        let vao = new VAO("Line", this.vertices, this.indices, this.normals );

        let model = new Renderable("Line", vao, "WallMaterial");
        model.start = start;
        model.end = end;

        model.setColor('#ffffff');

        return model;
    }

    setVertices(start, end, size){

        let length = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.z - start.z, 2));
        let angle = Math.acos((start.x - end.x) / length);

        this.vertices = [
            start.x - size * Math.sin(angle), start.y, start.z + size * Math.cos(angle),
            start.x + size * Math.sin(angle), start.y, start.z - size * Math.cos(angle),
            end.x - size * Math.sin(angle), end.y, end.z + size * Math.cos(angle),
            end.x + size * Math.sin(angle), end.y, end.z - size * Math.cos(angle)
        ];

    }
}

export default Line;