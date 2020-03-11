import * as webGL from "../webGL.js"
import gl from '../webGL.js';

class Shader{

    constructor(name, vertShader,fragShader, uniforms, ubos){

    	this.name = name;
		this.program = webGL.shaderProgram(vertShader,fragShader);
		this.uniforms = new Map();
		this.textureSlot = 0;

		if( uniforms && uniforms.length > 0 ) this.prepareUniforms( uniforms );
		if( ubos && ubos.length > 0 ) this.prepareUniformBlocks( ubos );

		webGL.env.shaders.set(this.name, this);

		return this
	}

	bind(){
    	gl.useProgram( this.program );
    	return this;
    }


	prepareUniforms( uniforms ){

		for( let uniform of uniforms ){

			let loc = gl.getUniformLocation( this.program, uniform.name );

			if(loc != null)
				this.uniforms.set( uniform.name, { loc, type:uniform.type } );

			else
				console.error( "prepareUniforms : Uniform not found %s", uniform.name );
		}
	}


	prepareUniformBlocks( ubos ){

		for( let uboName of ubos ){

			let index = gl.getUniformBlockIndex( this.program, uboName );
			if( index > 1000 ){ console.log("Ubo not found in shader %s : %s ", this.name, uboName ); return this; }

			let ubo = webGL.env.ubos.get( uboName );
			if( !ubo ){ console.log( "Can not find UBO: %s for %s", uboName, this.name ); return this; }

			gl.uniformBlockBinding( this.program, index, ubo.bindPoint );
		}
	}

	setUniform( name, value ){

    	let uniform	= this.uniforms.get( name );

		if( !uniform ){ console.error( "set uniform not found %s in %s", name, this.name ); return this; }

		switch(uniform.type){
			case "float":	gl.uniform1f(	uniform.loc, value); break;
			case "afloat":	gl.uniform1fv(	uniform.loc, value); break;
			case "vec2":	gl.uniform2fv(	uniform.loc, value); break;

			case "rgb":		gl.uniform3fv(	uniform.loc, value); break;
			case "vec3":	gl.uniform3fv(	uniform.loc, value); break;

			case "rgba":	gl.uniform4fv(	uniform.loc, value); break;
			case "vec4":	gl.uniform4fv(	uniform.loc, value); break;

			case "int":		gl.uniform1i(	uniform.loc, value); break;

			case "mat4":	gl.uniformMatrix4fv(	uniform.loc, false, value); break;
			case "mat3":	gl.uniformMatrix3fv(	uniform.loc, false, value); break;
			case "mat2x4": 	gl.uniformMatrix2x4fv(	uniform.loc, false, value); break;

			case "sampler2D":
				gl.activeTexture(	gl.TEXTURE0 + this.textureSlot);
				gl.bindTexture(		gl.TEXTURE_2D, value);
				gl.uniform1i(		uniform.loc, this.textureSlot);
				this.textureSlot++;
				break;

			case "sampler2DArray":
				gl.activeTexture(	gl.TEXTURE0 + this.textureSlot);
				gl.bindTexture(		gl.TEXTURE_2D_ARRAY, value);
				gl.uniform1i(		uniform.loc, this.textureSlot);
				this.textureSlot++;
				break;

			default: console.error("unknown uniform type %s for %s in %s", uniform.type, name, this.name ); break;
		}
		return this;
	}

	resetTextureSlot(){
    	this.textureSlot = 0;
    	return this;
    }

}

export default Shader