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


//process an array of transforms in a recursive fashion. Also forces world matrix update on items if needed
function processList(array){

	for(let i=0; i < array.length; i++){
		if(array[i].visible === false) continue;
		array[i].updateMatrix();

		//if this transform is a renderable, start drawing
		if(array[i].draw !== undefined){
			prepareNext(array[i]).draw();
			if(render.onItemRendered != null) render.onItemRendered(array[i]);
		}

		//If transform has any children, then process that list next.
		if(array[i].children.length > 0) processList(array[i].children);
	}
}


//Prepares the shader for the next item for rendering by dealing with the shader and gl features
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