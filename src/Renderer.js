import gl from "./webGL.js";


let render = function(array){
	if(render.onPreRender != null) render.onPreRender(render);

	processList(array);

	if(render.onPostRender != null) render.onPostRender(render);

	gl.bindVertexArray(null); //After all done rendering, unbind VAO
};

render.onItemRendered	= null;	//Event After an Item has been rendered
render.onPreRender		= null;	//Before Rendering starts
render.onPostRender		= null;	//After Rendering is complete


//------------------------------------------------------
//Private
//------------------------------------------------------
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

		if(mesh.draw !== undefined){
			prepareNext(mesh).draw();
			if(render.onItemRendered != null) render.onItemRendered(mesh);
		}

		if(mesh.children.length > 0) processList(mesh.children);
	}
}

function prepareNext(item){

	//Check if the next material to use is different from the last
	if(material !== item.material){
		material = item.material;

		//Multiple materials can share the same shader, if new shader, turn it on.
		if(material.shader !== shader){
			shader = material.shader;
			shader.bind();
		}

		material.applyUniforms();
	}

	material.shader.setUniform('modelMatrix', item.worldMatrix);

	if(item.useCulling !== CULLING_STATE)		gl[ ( (CULLING_STATE	= (!CULLING_STATE))  )?"enable":"disable"	](gl.CULL_FACE);
	if(item.useDepthTest !== DEPTHTEST_STATE)	gl[ ( (DEPTHTEST_STATE	= (!DEPTHTEST_STATE)) )?"enable":"disable"	](gl.DEPTH_TEST);

	return item;
}

export default render;