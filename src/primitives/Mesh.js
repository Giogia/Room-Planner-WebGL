import VAO from "../entities/VertexArray.js";
import Renderable from "../entities/renderable.js";

class Mesh{
    constructor(name, models) {

        let shader =  "wallShader";

        let mesh = new Renderable(null, null, shader);

        for(let model of models){
            let vao = new VAO(model.name, model.vertices, model.indices, model.normals);

            mesh.addItem(vao, model.material, shader);

            mesh.items.get(model.name).material.setColor(model.material.pbrMetallicRoughness.baseColorFactor.slice(0,3));
        }

        return mesh;
    }

}
export default Mesh;