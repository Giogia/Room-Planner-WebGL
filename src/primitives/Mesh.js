import VAO from "../entities/VertexArray.js";
import Renderable from "../entities/renderable.js";
import Transform from "../entities/Transform.js";

class Mesh{
    constructor(name, meshes) {

        this.models = [];

        for(let mesh of meshes){
            let vao = new VAO(mesh.name, mesh.vertices, mesh.indices, mesh.normals);
            let model = new Renderable(vao, mesh.material.name, "wallShader");
            
            model.material.color = mesh.material.pbrMetallicRoughness.baseColorFactor.slice(0,3);
            this.models.push(model);
        }

        return this.models;
    }

}
export default Mesh;