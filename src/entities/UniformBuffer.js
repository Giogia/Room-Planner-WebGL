import gl from "../webGL.js"
import * as webGL from "../webGL.js";
import ByteBuffer from "./ByteBuffer.js";

class UBO {
	constructor(name, bindPoint, items) {

		this.name = name;
		this.items = new Map();
		this.bindPoint	= bindPoint;
		this.bufferID = gl.createBuffer();
		this.bufferSize = 0;
		this.byteBuffer = null;

		for( let item of items){
			this.addItem( item.name, item.type );
		}

		this.bufferSize	= this.calculate( this.items );
		this.byteBuffer	= new ByteBuffer( this.bufferSize );

		gl.bindBuffer(gl.UNIFORM_BUFFER, this.bufferID);						// Bind it for work
		gl.bufferData(gl.UNIFORM_BUFFER, this.bufferSize, gl.DYNAMIC_DRAW);		// Allocate Space in empty buf
		gl.bindBuffer(gl.UNIFORM_BUFFER, null);							// Unbind
		gl.bindBufferBase(gl.UNIFORM_BUFFER, bindPoint, this.bufferID);			// Save Buffer to Uniform Buffer Bind point

		webGL.env.ubos.set(name, this);

		return this;
	}


	addItem(name, type, length = 0){

		this.items.set( name, {type:type, offset: 0, blockSize: 0, dataSize: 0, length: length } );
	}


	setItem( name, data ){

	let item = this.items.get(name);

		switch(item.type){
			case "float": case "mat3": case "mat4": case "vec2": case "vec3": case "vec4": case "mat2x4":

				let array = ( Array.isArray( data ) && !(data instanceof Float32Array) )? new Float32Array( data ) : data;

				this.byteBuffer.setFloat( item.offset, array );
				break;

			case "int":
				this.byteBuffer.setInt32( item.offset, data );
				break;

			default: console.log("Ubo Type unknown for item ",name); break;
		}

		return this;
	}


	update(){

		gl.bindBuffer(gl.UNIFORM_BUFFER, this.bufferID);
		gl.bufferSubData(gl.UNIFORM_BUFFER, 0, this.byteBuffer.bufferView, 0, this.byteBuffer.arrayBuffer.byteLength);
		gl.bindBuffer(gl.UNIFORM_BUFFER, null);

		return this;
	}

	calculate( items ){

		let blockSpace	= 16,	//Data size in Bytes, UBO using layout std140 needs to build out the struct in blocks of 16 bytes.
			offset		= 0,	//Offset in the buffer allocation
			size,				//Data Size of the current type
			prevItem	= null,
			i;

		for( let item of items.values() ){

			// When dealing with arrays, Each element takes up 16 bytes regardless of type, but if the type
			// is a factor of 16, then that values times array length will work, in case of matrices
			size = this.getSize(item.type);
			if(item.length > 0){
				for(i=0; i < 2; i++){
					if(size[i] < 16)	size[i] = item.length * 16;
					else				size[i] *= item.length;
				}
			}

			// Check if there is enough block space, if not
			// give previous item the remainder block space
			// If the block space is full and the size is equal too or greater, dont give back to previous
			if(blockSpace >= size[0]) blockSpace -= size[1];
			else if(blockSpace > 0 && prevItem && !(blockSpace === 16 && size[1] >= 16) ){
				prevItem.blockSize += blockSpace;
				offset 		+= blockSpace;
				blockSpace	= 16 - size[1];
			}

			// Save data about the item
			item.offset		= offset;
			item.blockSize	= size[1];
			item.dataSize	= size[1];

			// Cleanup
			offset			+= size[1];
			prevItem		= item;

			if(blockSpace <= 0) blockSpace = 16; //Reset
		}

		let padding = offset % 16;
		if( padding !== 0) offset += 16 - padding;

		return offset;
	}

	getSize( type ){

		switch(type){
			case "float": case "int": case "b"  : return [4,4];
			case "mat2x4"						: return [32,32]; //16*2
			case "mat4"							: return [64,64]; //16*4
			case "mat3"							: return [48,48]; //16*3
			case "vec2"							: return [8,8];
			case "vec3"							: return [16,12]; //Special Case
			case "vec4"							: return [16,16];
			default								: return [0,0];
		}
	}
}

export default UBO