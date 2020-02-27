import * as webGL from "./webGL.js"
import gl from './webGL.js';


class Shader{

    constructor(name, vertShader,fragShader){

    	this.name = name;
		this.program = webGL.shaderProgram(vertShader,fragShader);
		this.uniforms = new Map();
	}


	// Clean up resources when the shader is no longer needed.
	dispose(){

		// Unbind the program if its currently active
		if(gl.getParameter(gl.CURRENT_PROGRAM) === this.program) gl.useProgram(null);
		gl.deleteProgram(this.program);
	}


	bind(){
    	gl.useProgram( this.program );
    	return this;
    }

    unbind(){
    	gl.useProgram( null );
    	return this;
    }


	static create(source){

		let shader = new Shader(source.name, source.vertexShader, source.fragmentShader);

		if( source.uniforms && source.uniforms.length > 0 ){
			shader.prepareUniforms( source.uniforms );
		}

		if( source.ubos && source.ubos.length > 0 ){
			shader.prepareUniformBlocks( source.ubos );
		}

		webGL.env.shaders.set(source.name, shader);

		return shader;
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

}

export default Shader.create