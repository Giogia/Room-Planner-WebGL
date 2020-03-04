import VAO from "../entities/VertexArray.js";
import Renderable from "../entities/renderable.js";

class Mesh{
    constructor(name, meshes) {

        this.vaos = [];
        this.models = [];

        for(let mesh of meshes){
            let vao = new VAO(mesh.name, mesh.vertices, mesh.normals, null, mesh.indices);
            this.vaos.push(vao);
            this.models.push(new Renderable(vao, mesh.material));
        }
    }

}
export default Mesh;