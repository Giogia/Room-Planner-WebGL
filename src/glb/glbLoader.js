import Mesh from '../primitives/Mesh.js'

class GlbLoader{
	constructor(){
		this.json = null;
		this.buffers = null;
		this.skeletons = [];
		this.meshes = [];
		this.nodes = [];
	}

	load(glb){

		this.json = glb.json;
		this.buffers = glb.buffers;
		this.processScene();

		let models = [];

		for(let node of this.nodes){

			let meshes = [];
			for(let mesh of node.meshes) meshes.push(this.meshes[mesh]);

			models.push( new Mesh(name, meshes) );
		}

		return models;

	}


	processScene(index = 0){

		if(this.json.scenes[index].nodes.length === 0) return;

		let stack = [];

		let scene = this.json.scenes[index];

		//Setup Initial Stack
		for(let node of scene.nodes) stack.push(node);

		//Process Stack of nodes, check for children to add to stack
		while(stack.length > 0){

			let index = stack.pop();
			let node = this.json.nodes[index];

			//Add More Nodes to the stack
			if(node.children !== undefined)
				for(let children of node.children) stack.push(children);

			this.processNode( node );
		}
	}

	processNode(node){

		//Handle Mesh
		if(node.mesh !== undefined){

			let mesh = {
				name: 		(node.name)? node.name : "untitled",
				rotation:	node.rotation || null,
				scale:		node.scale || null,
				position:	node.translation || null,
				matrix:		node.matrix || null,
				meshes:		this.processMesh(node.mesh)
			};

			this.nodes.push(mesh);
		}
	}

	processMesh(index){

		let mesh = this.json.meshes[index];

		let name = mesh.name || "unnamed";

		let final = [];

		for(let primitive of mesh.primitives){

			let attributes = primitive.attributes;

			let item = {
				name: 		name + "_p" + mesh.primitives.indexOf(primitive),
				mode:		(primitive.mode !== undefined)? primitive.mode : GlbLoader.MODE_TRIANGLES,
				indices:	null,	//primitive.indices
				vertices:	null,	//primitive.attributes.POSITION = vec3
				normals:	null,	//primitive.attributes.NORMAL = vec3
				material:  this.json.materials[primitive.material]
			};

			//Get Raw Data
			item.vertices = this.processAccessor(attributes.POSITION);
			if(primitive.indices !== undefined) 	item.indices	= this.processAccessor(primitive.indices);
			if(attributes.NORMAL !== undefined)		item.normals	= this.processAccessor(attributes.NORMAL);
			if(attributes.WEIGHTS_0 !== undefined)	item.weights	= this.processAccessor(attributes.WEIGHTS_0);
			if(attributes.JOINTS_0 !== undefined)	item.joints	= this.processAccessor(attributes.JOINTS_0);

			//Save Data
			this.meshes.push(item);				//Each Primitive is its own draw call, so its really just attributes final
			final.push(this.meshes.length-1);	//Save index to new final so nodes can reference the final
		}

		return final;
	}


	//Decodes the binary buffer data into a Type Array that is webgl friendly.
	processAccessor(index){

		let	accessor = this.json.accessors[index];

		let bufferView = this.json.bufferViews[ accessor.bufferView ];

		let	buffer = this.prepareBuffer(bufferView.buffer),
			offset = (accessor.byteOffset || 0) + (bufferView.byteOffset || 0);

		let type = null,
			dateViewFunction = null;

		switch(accessor.componentType){
			case GlbLoader.TYPE_FLOAT:				type = Float32Array;	dateViewFunction = "getFloat32"; break;
			case GlbLoader.TYPE_SHORT:				type = Int16Array;		dateViewFunction = "getInt16"; break;
			case GlbLoader.TYPE_UNSIGNED_SHORT:		type = Uint16Array;		dateViewFunction = "getUint16"; break;
			case GlbLoader.TYPE_UNSIGNED_INT:		type = Uint32Array;		dateViewFunction = "getUint32"; break;
			case GlbLoader.TYPE_UNSIGNED_BYTE: 		type = Uint8Array; 		dateViewFunction = "getUint8"; break;

			default: console.log("ERROR processAccessor","componentType unknown",accessor.componentType); return null; break;
		}

		let length = accessor.count * GlbLoader["COMP_"+accessor.type] * type.BYTES_PER_ELEMENT;

		//Pull the data out of the dataView based on the Type.
		let bytesPerElement = type.BYTES_PER_ELEMENT,	//How many Bytes needed to make accessor single element
			arrayLength	= length / bytesPerElement,	//Final Array Length
			array = new type(arrayLength),				//Final Array
			position = 0;								//Starting position in DataView

		for(let i=0; i < arrayLength; i++){
			position = offset + i * bytesPerElement;
			array[i] = buffer.dView[dateViewFunction](position,true);
		}

		return {data:array,
				max:accessor.max,
				min:accessor.min,
				count:accessor.count,
				compLen:GlbLoader["COMP_"+accessor.type]
		};
	}


	prepareBuffer(index){

		let buffer = this.json.buffers[index];
		let bufferData = this.buffers[index];

		buffer.dView = new DataView( bufferData);

		return buffer;
	}
}

//CONSTANTS
GlbLoader.MODE_POINTS 			= 0;	//Mode Constants for GLTF and WebGL are identical
GlbLoader.MODE_LINES			= 1;	//https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Constants
GlbLoader.MODE_LINE_LOOP		= 2;
GlbLoader.MODE_LINE_STRIP		= 3;
GlbLoader.MODE_TRIANGLES		= 4;
GlbLoader.MODE_TRIANGLE_STRIP	= 5;
GlbLoader.MODE_TRIANGLE_FAN	= 6;

GlbLoader.TYPE_BYTE			= 5120;
GlbLoader.TYPE_UNSIGNED_BYTE	= 5121;
GlbLoader.TYPE_SHORT			= 5122;
GlbLoader.TYPE_UNSIGNED_SHORT	= 5123;
GlbLoader.TYPE_UNSIGNED_INT	= 5125;
GlbLoader.TYPE_FLOAT			= 5126;

GlbLoader.COMP_SCALAR			= 1;
GlbLoader.COMP_VEC2			= 2;
GlbLoader.COMP_VEC3			= 3;
GlbLoader.COMP_VEC4			= 4;
GlbLoader.COMP_MAT2			= 4;
GlbLoader.COMP_MAT3			= 9;
GlbLoader.COMP_MAT4			= 16;

export default GlbLoader