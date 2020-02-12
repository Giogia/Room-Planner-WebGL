class VAO{
	static create(out){
		out.buffers = [];
		out.id = ctx.createVertexArray();
		out.isIndexed = false;
		out.count = 0;

		ctx.bindVertexArray(out.id);
		return VAO;
	}

	static finalize(out,name){
		if(out.count == 0 && out.buffers["vert"] !== undefined) out.count = out.buffers["vert"].count;

		ctx.bindVertexArray(null);
		ctx.bindBuffer(ctx.ARRAY_BUFFER,null);
		ctx.bindBuffer(ctx.ELEMENT_ARRAY_BUFFER,null);
		mod.res.vao[name] = out;
	}

	static emptyFloatArrayBuffer(out,name,aryCount,attrLoc,size,stride,offset,isStatic){
		var rtn = {
			buf:ctx.createBuffer(),
			size:size,
			stride:stride,
			offset:offset,
			count:0
		};

		ctx.bindBuffer(ctx.ARRAY_BUFFER, rtn.buf);
		ctx.bufferData(ctx.ARRAY_BUFFER,aryCount,(isStatic != false)? ctx.STATIC_DRAW : ctx.DYNAMIC_DRAW);		//Allocate Space needed
		ctx.enableVertexAttribArray(attrLoc);
		ctx.vertexAttribPointer(attrLoc,size,ctx.FLOAT,false,stride || 0,offset || 0);

		out.buffers[name] = rtn;
		return VAO;
	}

	static partitionBuffer(attrLoc,size,stride,offset,isInstance){
		ctx.enableVertexAttribArray(attrLoc);
		ctx.vertexAttribPointer(attrLoc,size,ctx.FLOAT,false,stride,offset);

		if(isInstance == true) ctx.vertexAttribDivisor(attrLoc, 1);

		return VAO;
	}

	static floatArrayBuffer(out,name,aryFloat,attrLoc,size,stride,offset,isStatic,keepData,isInstance){
		var rtn = {
			buf:ctx.createBuffer(),
			size:size,
			stride:stride,
			offset:offset,
			count:aryFloat.length / size
		};
		if(keepData == true) rtn.data = aryFloat;
		var ary = (aryFloat instanceof Float32Array)? aryFloat : new Float32Array(aryFloat);

		ctx.bindBuffer(ctx.ARRAY_BUFFER, rtn.buf);
		ctx.bufferData(ctx.ARRAY_BUFFER, ary, (isStatic != false)? ctx.STATIC_DRAW : ctx.DYNAMIC_DRAW );
		ctx.enableVertexAttribArray(attrLoc);
		ctx.vertexAttribPointer(attrLoc,size,ctx.FLOAT,false,stride || 0,offset || 0);

		if(isInstance == true) ctx.vertexAttribDivisor(attrLoc, 1);

		out.buffers[name] = rtn;
		return VAO;
	}

	static mat4ArrayBuffer(out,name,aryFloat,attrLoc,isStatic,keepData,isInstance){
		var rtn = {
			buf:ctx.createBuffer(),
			size:4,
			stride:64,
			offset:0,
			count:aryFloat.length / 16
		};
		if(keepData == true) rtn.data = aryFloat;
		var ary = (aryFloat instanceof Float32Array)? aryFloat : new Float32Array(aryFloat);

		ctx.bindBuffer(ctx.ARRAY_BUFFER, rtn.buf);
		ctx.bufferData(ctx.ARRAY_BUFFER, ary, (isStatic != false)? ctx.STATIC_DRAW : ctx.DYNAMIC_DRAW );

		//Matrix is treated like an array of vec4, So there is actually 4 attributes to setup that
		//actually makes up a single mat4.
		ctx.enableVertexAttribArray(attrLoc);
		ctx.vertexAttribPointer(attrLoc,4,ctx.FLOAT,false,64,0);

		ctx.enableVertexAttribArray(attrLoc+1);
		ctx.vertexAttribPointer(attrLoc+1,4,ctx.FLOAT,false,64,16);

		ctx.enableVertexAttribArray(attrLoc+2);
		ctx.vertexAttribPointer(attrLoc+2,4,ctx.FLOAT,false,64,32);

		ctx.enableVertexAttribArray(attrLoc+3);
		ctx.vertexAttribPointer(attrLoc+3,4,ctx.FLOAT,false,64,48);

		if(isInstance == true){
			ctx.vertexAttribDivisor(attrLoc, 1);
			ctx.vertexAttribDivisor(attrLoc+1, 1);
			ctx.vertexAttribDivisor(attrLoc+2, 1);
			ctx.vertexAttribDivisor(attrLoc+3, 1);
		}

		out.buffers[name] = rtn;
		return VAO;
	}


	static emptyIndexBuffer(out,name,aryCount,isStatic){
		var rtn = { buf:ctx.createBuffer(), count:0 };

		ctx.bindBuffer(ctx.ELEMENT_ARRAY_BUFFER, rtn.buf );
		ctx.bufferData(ctx.ELEMENT_ARRAY_BUFFER, aryCount, (isStatic != false)? ctx.STATIC_DRAW : ctx.DYNAMIC_DRAW );

		out.buffers[name] = rtn;
		out.isIndexed = true;

		return VAO;
	}

	static indexBuffer(out,name,aryUInt,isStatic,keepData){
		var rtn = { buf:ctx.createBuffer(), count:aryUInt.length };
		if(keepData == true) rtn.data = aryUInt;

		var ary = (aryUInt instanceof Uint16Array)? aryUInt : new Uint16Array(aryUInt);

		ctx.bindBuffer(ctx.ELEMENT_ARRAY_BUFFER, rtn.buf );
		ctx.bufferData(ctx.ELEMENT_ARRAY_BUFFER, ary, (isStatic != false)? ctx.STATIC_DRAW : ctx.DYNAMIC_DRAW );

		out.buffers[name] = rtn;
		out.isIndexed = true;
		out.count = aryUInt.length;

		return VAO;
	}

	static standardMesh(name,vertSize,aryVert,aryNorm,aryUV,aryInd,keepData){
		var rtn = {};
		VAO.create(rtn).floatArrayBuffer(rtn,"vert",aryVert,ATTR_POSITION_LOC,vertSize,0,0,true,keepData);
		rtn.count = rtn.buffers["vert"].count;

		if(aryNorm)	VAO.floatArrayBuffer(rtn,"norm",aryNorm,ATTR_NORM_LOC,3,0,0,true,keepData);
		if(aryUV)	VAO.floatArrayBuffer(rtn,"uv",aryUV,ATTR_UV_LOC,2,0,0,true,keepData);
		if(aryInd)	VAO.indexBuffer(rtn,"index",aryInd,true,keepData);

		if(rtn.count == 0) rtn.count = aryVert.length / vertSize;

		VAO.finalize(rtn);
		return rtn;
	}

	static updateAryBufSubData(bufID,offset,data){
		ctx.bindBuffer(ctx.ARRAY_BUFFER, bufID);
		ctx.bufferSubData(ctx.ARRAY_BUFFER, offset, data, 0, null);
		ctx.bindBuffer(ctx.ARRAY_BUFFER, null);
	}
}
