import gl from "../webGL.js";


let render = function(scene){
	if(render.onPreRender != null) render.onPreRender(render);

	processList(scene.objects.values());

	if(render.onPostRender != null) render.onPostRender(render);

	gl.bindVertexArray(null); //After all done rendering, unbind VAO
};

render.onItemRendered	= null;	//Event After an Item has been rendered
render.onPreRender		= null;	//Before Rendering starts
render.onPostRender		= null;	//After Rendering is complete



let CULLING_STATE			= true;		//Global state if the feature is enabled
let BLENDING_STATE			= false;	//Same---
let DEPTHTEST_STATE			= true;
let SAMPLE_ALPHA_COV_STATE	= false;
let material				= null;
let shader					= null;


function processList(array){

	for(let mesh of array){

		if(mesh.visible === false) continue;

		mesh.updateMatrix();

		processMesh(mesh);

		if(render.onItemRendered != null) render.onItemRendered(mesh);

		if(mesh.children.length > 0) processList(mesh.children);
	}
}

function processMesh(renderable){

	for(let item of renderable.items.values()){

		material = item.material;

		if(material.shader !== shader){
			shader = material.shader;
			shader.bind();
		}

		if(renderable.useBlending !== BLENDING_STATE) gl[ ( (BLENDING_STATE = (!BLENDING_STATE)) )?"enable":"disable" ](gl.BLEND);
		if(renderable.useAlphaCov !== SAMPLE_ALPHA_COV_STATE) gl[ ( (SAMPLE_ALPHA_COV_STATE = (!SAMPLE_ALPHA_COV_STATE)) )?"enable":"disable" ](gl.SAMPLE_ALPHA_TO_COVERAGE);

		material.shader.setUniform('fs_color', [material.color[0],material.color[1],material.color[2], material.opacity]);
		material.shader.setUniform('world_matrix', renderable.worldMatrix);

		if(shader.name === 'textureShader'){
			material.shader.setUniform('fs_texture', material.texture);
			material.shader.setUniform( 'fs_texture_repeat', material.textureRepeat);
			shader.resetTextureSlot();
		}

		if(renderable.useCulling !== CULLING_STATE)		gl[ ( (CULLING_STATE	= (!CULLING_STATE))  )?"enable":"disable"	](gl.CULL_FACE);
		if(renderable.useDepthTest !== DEPTHTEST_STATE)	gl[ ( (DEPTHTEST_STATE	= (!DEPTHTEST_STATE)) )?"enable":"disable"	](gl.DEPTH_TEST);

		renderable.draw(item.vao)
	}
}

export default render;