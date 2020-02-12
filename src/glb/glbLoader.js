class GlbLoader{
	constructor(){
		this.json = null;
		this.skeletons = [];	//
		this.meshes = [];	// VAOs
		this.nodes = [];	// Renderable, references back to mesh
	}

	get version(){ return this.json.asset.version; }

	loadFromDom(elmID,processNow){
		//TODO: Validation of element, text and json parsing.
		var txt = document.getElementById(elmID).text;
		this.json = JSON.parse(txt);

		if(processNow == true) this.processScene();

		return this;
	}

	load(jsObj,processNow){
		this.json = jsObj;

		//.....................................
		//Go through Skins and make all nodes as joints for later processing.
		//Joint data never exports well, there is usually garbage. Documentation
		//Suggests that developer pre process nodes to make them as joints and
		//it does help weed out bad data
		if(this.json.skins){
			var j,									//loop index
				s 			= this.json.skins,		//alias for skins
				complete 	= [];					//list of skeleton root nodes, prevent prcessing duplicate data that can exist in file
			for(var i=0; i < s.length; i++){
				if( complete.indexOf(s[i].skeleton) != -1) continue; //If already processed, go to next skin

				//Loop through all specified joints and mark the nodes as joints.
				for(j in s[i].joints) this.json.nodes[ s[i].joints[j] ].isJoint = true;

				complete.push(s[i].skeleton); //push root node index to complete list.
			}
		}

		//.....................................
		if(processNow == true) this.processScene();
		return this;
	}


	processScene(sceneNum){
		//TODO process skin first to mark nodes as joints since spec does not
		//https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#skins

		if(sceneNum == undefined) sceneNum = 0; //If not specify, get first scene
		if(this.json.scenes[sceneNum].nodes.length == 0) return;

		var sceneNodes = this.json.scenes[sceneNum].nodes,
			nStack = [],
			node,
			idx,
			i;

		//Setup Initial Stack
		for(i=0; i < sceneNodes.length; i++) nStack.push( sceneNodes[i] );

		//Process Stack of nodes, check for children to add to stack
		while(nStack.length > 0){
			idx = nStack.pop();
			node = this.json.nodes[idx];

			//Add More Nodes to the stack
			if(node.children != undefined)
				for(i=0; i < node.children.length; i++) nStack.push(node.children[i]);

			this.processNode( idx );
		}
	}


	//
	processNode(idx){
		var n = this.json.nodes[idx];
		//n.children = [nodeIndex,nodeIndex,etc]
		//n.skin = Defines skeleton
		//n.weights

		//TODO - Need to handle Node Heirarchy
		//if there is n.camera, its a camera.
		//if there is no camera or mesh, then its an empty that may get a mesh node as a child.

		//Handle Mesh
		if(n.mesh != undefined){
			var m = {
				name: 		(n.name)? n.name : "untitled",
				rotate:		n.rotation || null,
				scale:		n.scale || null,
				position:	n.translation || null,
				matrix:		n.matrix || null,
				meshes:		this.processMesh(n.mesh)
			};

			if(n.skin != undefined) m.skeleton = this.processSkin(n.skin);

			this.nodes.push(m);
		}
	}


	//TODO Make sure not to process the same mesh twice incase different nodes reference same mesh data.
	processMesh(idx){
		var m = this.json.meshes[idx];
		var meshName = m.name || "unnamed"
		//m.weights = for morph targets
		//m.name

		//p.attributes.TANGENT = vec4
		//p.attributes.TEXCOORD_1 = vec2
		//p.attributes.COLOR_0 = vec3 or vec4
		//p.material
		//p.targets = Morph Targets

		//.....................................
		var p,			//Alias for primative element
			a,			//Alias for primative's attributes
			itm,
			mesh = [];

		for(var i=0; i < m.primitives.length; i++){
			p = m.primitives[i];
			a = p.attributes;

			itm = {
				name: 		meshName + "_p" + i,
				mode:		(p.mode != undefined)? p.mode : GlbLoader.MODE_TRIANGLES,
				indices:	null,	//p.indices
				vertices:	null,	//p.attributes.POSITION = vec3
				normals:	null,	//p.attributes.NORMAL = vec3
				texcoord:	null,	//p.attributes.TEXCOORD_0 = vec2
				joints: 	null,	//p.attributes.JOINTS_0 = vec4
				weights: 	null	//p.attributes.WEIGHTS_0 = vec4
			};

			//Get Raw Data
			itm.vertices = this.processAccessor(a.POSITION);
			if(p.indices != undefined) 		itm.indices	= this.processAccessor(p.indices);
			if(a.NORMAL != undefined)		itm.normals	= this.processAccessor(a.NORMAL);
			if(a.WEIGHTS_0 != undefined)	itm.weights	= this.processAccessor(a.WEIGHTS_0);
			if(a.JOINTS_0 != undefined)		itm.joints	= this.processAccessor(a.JOINTS_0);

			//Save Data
			this.meshes.push(itm);				//Each Primitive is its own draw call, so its really just a mesh
			mesh.push(this.meshes.length-1);	//Save index to new mesh so nodes can reference the mesh
		}

		return mesh;
	}


	//Decodes the binary buffer data into a Type Array that is webgl friendly.
	processAccessor(idx){
		var	a = this.json.accessors[idx],								//Accessor Alias Ref
			bView = this.json.bufferViews[ a.bufferView ],				//bufferView Ref

			buf		= this.prepareBuffer(bView.buffer),					//Buffer Data decodes into a ArrayBuffer/DataView
			bOffset	= (a.byteOffset || 0) + (bView.byteOffset || 0),	//Starting point for reading.
			bLen 	= 0,//a.count,//bView.byteLength,									//Byte Length for this Accessor

			TAry = null,												//Type Array Ref
			DFunc = null;												//DateView Function name

		//Figure out which Type Array we need to save the data in
		switch(a.componentType){
			case GlbLoader.TYPE_FLOAT:				TAry = Float32Array;	DFunc = "getFloat32"; break;
			case GlbLoader.TYPE_SHORT:				TAry = Int16Array;		DFunc = "getInt16"; break;
			case GlbLoader.TYPE_UNSIGNED_SHORT:	TAry = Uint16Array;		DFunc = "getUint16"; break;
			case GlbLoader.TYPE_UNSIGNED_INT:		TAry = Uint32Array;		DFunc = "getUint32"; break;
			case GlbLoader.TYPE_UNSIGNED_BYTE: 	TAry = Uint8Array; 		DFunc = "getUint8"; break;

			default: console.log("ERROR processAccessor","componentType unknown",a.componentType); return null; break;
		}

		//When more then one accessor shares a buffer, The BufferView length is the whole section
		//but that won't work, so you need to calc the partition size of that whole chunk of data
		//The math in the spec about stride doesn't seem to work, it goes over bounds, what Im using works.
		//https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#data-alignment
		if(bView.byteStride != undefined)	bLen = bView.byteStride * a.count;
		else 								bLen = a.count * GlbLoader["COMP_"+a.type] * TAry.BYTES_PER_ELEMENT; //elmCnt * compCnt * compByteSize)

		//Pull the data out of the dataView based on the Type.
		var bPer	= TAry.BYTES_PER_ELEMENT,	//How many Bytes needed to make a single element
			aLen	= bLen / bPer,				//Final Array Length
			ary		= new TAry(aLen),			//Final Array
			p		= 0;						//Starting position in DataView

		for(var i=0; i < aLen; i++){
			p = bOffset + i * bPer;
			ary[i] = buf.dView[DFunc](p,true);
		}

		//console.log(a.type,GLTFLoader["COMP_"+a.type],"offset",bOffset, "bLen",bLen, "aLen", aLen, ary);
		return { data:ary, max:a.max, min:a.min, count:a.count, compLen:GlbLoader["COMP_"+a.type] };
	}

	//Get the buffer data ready to be parsed threw by the Accessor
	prepareBuffer(idx){
		var buf = this.json.buffers[idx];

		if(buf.dView != undefined) return buf;

		if(buf.uri.substr(0,5) != "data:"){
			//TODO Get Bin File
			return buf;
		}

		//Create and Fill DataView with buffer data
		var pos		= buf.uri.indexOf("base64,") + 7,
			blob	= window.atob(buf.uri.substr(pos)),
			dv		= new DataView( new ArrayBuffer(blob.length) );
		for(var i=0; i < blob.length; i++) dv.setUint8(i,blob.charCodeAt(i));
		buf.dView = dv;

		//console.log("buffer len",buf.byteLength,dv.byteLength);
		//var fAry = new Float32Array(blob.length/4);
		//for(var j=0; j < fAry.length; j++) fAry[j] = dv.getFloat32(j*4,true);
		//console.log(fAry);
		return buf;
	}

	processSkin(idx){
		//Check if the skin has already processed skeleton info
		var i,s = this.json.skins[idx]; //skin reference


		for(i=0; i < this.skeletons.length; i++){
			if(this.skeletons[i].nodeIdx == s.skeleton) return i; //Find a root bone that matches the skin's.
		}
		console.log("ProcessSkin",idx, s.skeleton, this.skeletons.length);

		//skeleton not processed, do it now.
		var stack = [],	//Queue
			final = [],	//Flat array of joints for skeleton
			n,		//Node reference
			itm,	//popped queue tiem
			pIdx;	//parent index

		if(s.joints.indexOf(s.skeleton) != -1){
			stack.push([s.skeleton,null]); //Add Root bone Node Index, final index ofParent
		}else{
			var cAry = this.json.nodes[s.skeleton].children;
			for(var c=0; c < cAry.length; c++){
				stack.push([cAry[c],null]);
			}
		}


		while(stack.length > 0){
			itm	= stack.pop();				//Pop off the list
			n 	= this.json.nodes[itm[0]];	//Get node info for joint

			if(n.isJoint != true) continue; //Check preprocessing to make sure its actually a used node.

			//Save copy of data : Ques? Are bones's joint number always in a linear fashion where parents have
			//a lower index then the children;
			final.push({
				jointNum 	: s.joints.indexOf(itm[0]),
				name 		: n.name || null,
				position	: n.translation || null,
				scale		: n.scale || null,
				rotation	: n.rotation || null,
				matrix		: n.matrix || null,
				parent		: itm[1],
				nodeIdx 	: itm[0]
			});


			//Save the the final index for this joint for children reference
			pIdx = final.length - 1;

			//Add children to stack
			if(n.children != undefined){
				for(i=0; i < n.children.length; i++) stack.push([n.children[i],pIdx]);
			}
		}

		final.nodeIdx = s.skeleton; //Save root node index to make sure we dont process the same skeleton twice.
		this.skeletons.push(final);
		return this.skeletons.length - 1;
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
GLTFLoader.COMP_MAT4			= 16;