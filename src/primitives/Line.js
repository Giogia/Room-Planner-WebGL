import VAO from "../entities/VertexArray.js";
import Renderable from "../entities/renderable.js";

class Line {
    constructor(start, end, size = 1) {

        this.start = start;
        this.end = end;
        this.size = size;

        this.vao = new VAO("Line", [start.x, start.y, start.z, end.x, end.y, end.z]);

        return new Renderable("Line", this.vao, "WallMaterial", "wallShader");
    }
}

export default Line;