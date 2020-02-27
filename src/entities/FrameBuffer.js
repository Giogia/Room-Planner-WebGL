class FBO{

	static build(name, colorCnt, useDepth, wSize, hSize){
		var rtn = {};
		if(wSize === undefined || wSize == null) wSize = ctx.fWidth;
		if(hSize === undefined || wSize == null) hSize = ctx.fHeight;

		//Create and Set Depth
		FBO.create(rtn);
		if(useDepth == true) FBO.depthBuffer(rtn,wSize,hSize);

		//Build color buffers
		var cBufAry = [];
		for(var i=0; i < colorCnt; i++){
			cBufAry.push( ctx.COLOR_ATTACHMENT0 + i );
			FBO.texColorBuffer(rtn,i,wSize,hSize);
		}
		if(cBufAry.length > 1) ctx.drawBuffers(cBufAry);

		//All Done.
		FBO.finalize(rtn,name);
		return rtn;
	}

	static create(out){
		out.colorBuf = [];
		out.id = ctx.createFramebuffer();
		ctx.bindFramebuffer(ctx.FRAMEBUFFER, out.id);
		return this;
	}

	static texColorBuffer(out,cAttachNum,w,h){
		//Up to 16 texture attachments 0 to 15
		out.colorBuf[cAttachNum] = ctx.createTexture();
		ctx.bindTexture(ctx.TEXTURE_2D, out.colorBuf[cAttachNum]);
		ctx.texImage2D(ctx.TEXTURE_2D,0, ctx.RGBA, w, h, 0, ctx.RGBA, ctx.UNSIGNED_BYTE, null);
		ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MIN_FILTER, ctx.LINEAR);
		ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MAG_FILTER, ctx.LINEAR);
		ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_S, ctx.CLAMP_TO_EDGE);	//Stretch image to X position
		ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_T, ctx.CLAMP_TO_EDGE);	//Stretch image to Y position

		ctx.framebufferTexture2D(ctx.FRAMEBUFFER, ctx.COLOR_ATTACHMENT0 + cAttachNum, ctx.TEXTURE_2D, out.colorBuf[cAttachNum], 0);
		return this;
	}

	static depthBuffer(out,w,h){
		out.depth = ctx.createRenderbuffer();
		ctx.bindRenderbuffer(ctx.RENDERBUFFER, out.depth);
		ctx.renderbufferStorage(ctx.RENDERBUFFER, ctx.DEPTH_COMPONENT16, w, h);
		ctx.framebufferRenderbuffer(ctx.FRAMEBUFFER, ctx.DEPTH_ATTACHMENT, ctx.RENDERBUFFER, out.depth);
		return this;
	}

	static finalize(out,name){
		switch(ctx.checkFramebufferStatus(ctx.FRAMEBUFFER)){
			case ctx.FRAMEBUFFER_COMPLETE: break;
			case ctx.FRAMEBUFFER_INCOMPLETE_ATTACHMENT: console.log("FRAMEBUFFER_INCOMPLETE_ATTACHMENT"); break;
			case ctx.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT: console.log("FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT"); break;
			case ctx.FRAMEBUFFER_INCOMPLETE_DIMENSIONS: console.log("FRAMEBUFFER_INCOMPLETE_DIMENSIONS"); break;
			case ctx.FRAMEBUFFER_UNSUPPORTED: console.log("FRAMEBUFFER_UNSUPPORTED"); break;
			case ctx.FRAMEBUFFER_INCOMPLETE_MULTISAMPLE: console.log("FRAMEBUFFER_INCOMPLETE_MULTISAMPLE"); break;
			case ctx.RENDERBUFFER_SAMPLES: console.log("RENDERBUFFER_SAMPLES"); break;
		}

		ctx.bindTexture(ctx.TEXTURE_2D, null);
		ctx.bindRenderbuffer(ctx.RENDERBUFFER, null);
		ctx.bindFramebuffer(ctx.FRAMEBUFFER, null);
		mod.res.fbo[name] = out;

		return out;
	}

	static colorDepthFBO(name){
		var rtn = {};
		return FBO.create(rtn)
			.texColorBuffer(rtn,0)
			.depthBuffer(rtn)
			.finalize(rtn,name);
	}

	static readPixel(fbo,x,y,cAttachNum){
		var p = new Uint8Array(4);
		ctx.bindFramebuffer(ctx.READ_FRAMEBUFFER, fbo.id);
		ctx.readBuffer(ctx.COLOR_ATTACHMENT0 + cAttachNum);
		ctx.readPixels(x, y, 1, 1, ctx.RGBA, ctx.UNSIGNED_BYTE, p);
		ctx.bindFramebuffer(ctx.READ_FRAMEBUFFER, null);
		return p;
	}

	static activate(fbo){ ctx.bindFramebuffer(ctx.FRAMEBUFFER,fbo.id); return this; }
	static deactivate(){ ctx.bindFramebuffer(ctx.FRAMEBUFFER,null); return this; }
	static clear(fbo){
		ctx.bindFramebuffer(ctx.FRAMEBUFFER,fbo.id);
		ctx.clear(ctx.COLOR_BUFFER_BIT | ctx.DEPTH_BUFFER_BIT);
		ctx.bindFramebuffer(ctx.FRAMEBUFFER,null);
	}

	static delete(fbo){
		//TODO, Delete using the Cache name, then remove it from cache.
		ctx.deleteRenderbuffer(fbo.depth);
		ctx.deleteTexture(fbo.texColor);
		ctx.deleteFramebuffer(fbo.id);
	}
}

export default FBO