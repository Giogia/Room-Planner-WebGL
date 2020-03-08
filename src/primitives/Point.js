import VAO from "../entities/VertexArray.js";
import Renderable from "../entities/renderable.js";

class Point {
    constructor(size = 1) {

        this.size = size;
        this.vao = new VAO("Point", [0, 0, 0]);

        return new Renderable("Point", this.vao, "WallMaterial", "wallShader");
    }

}

export default Point;