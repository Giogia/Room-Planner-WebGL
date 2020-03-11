import VAO from "../entities/VertexArray.js";
import Renderable from "../entities/Renderable.js";

class Ground{
    constructor(height = 200, width = 200, color = "#1f2327"){

        this.vertices = [-width/2,-0.001,-height/2,
                        -width/2,-0.001,height/2,
                        width/2,-0.001,-height/2,
                        width/2,-0.001,height/2];

        this.normals = [0,1,0, 0,1,0, 0,1,0, 0,1,0];

        this.indices = [0,1,2, 1,3,2];

        this.vao = new VAO("Ground", this.vertices, this.indices, this.normals);

		this.model = new Renderable("Ground", this.vao, "GroundMaterial");
		this.model.setColor(color);

		return this.model;
    }
}

export default Ground;