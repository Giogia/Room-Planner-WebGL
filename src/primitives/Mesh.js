import VAO from "../entities/VertexArray.js";
import Renderable from "../entities/Renderable.js";
import render from "../entities/Renderer";

class Mesh{
    constructor(nodes, meshes) {

        this.shader =  "basicColor";
        this.renderables = new Map();

        for(let node of nodes){

			let parts = [];
			for(let index of node.meshes) parts.push(meshes[index]);

			this.renderables.set(node.name, this.createRenderable(node, parts));
		}

        let parent = this.renderables.get(nodes[0].name);

        this.linkRenderables(parent);

        return parent;
    }

    linkRenderables(parent){

       for(let child of this.renderables.values()){
           if(child !== parent){
               child.setParent(parent);
           }
       }
    }

    createRenderable(node, parts) {

        let renderable = new Renderable(node.name, null, null);

        renderable.position.set(node.position[0], node.position[1], node.position[2]);
        renderable.scale.set(node.scale[0], node.scale[1], node.scale[2]);
        renderable.rotation.set(node.rotation[0], node.rotation[1], node.rotation[2], node.rotation[3]);

        for (let part of parts) {
            let vao = new VAO(part.name, part.vertices, part.indices, part.normals);

            renderable.addItem(vao, part.material);
            renderable.items.get(part.name).material.setColor(part.material.pbrMetallicRoughness.baseColorFactor.slice(0, 3));
        }

        return renderable;
    }
}

export default Mesh;