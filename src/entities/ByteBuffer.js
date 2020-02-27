class ByteBuffer{

    constructor(size){

		this.arrayBuffer = new ArrayBuffer(size);
		this.bufferView	 = new DataView(this.arrayBuffer);
	}


    getFloat( bPos = 0 ){
        return this.bufferView.getFloat32( bPos );
    }

    setFloat( bPos = 0, n, isLittleEndian = true){

        if(n instanceof Float32Array){

            let bMax = n.length * 4 + bPos;
            if(bMax > this.arrayBuffer.byteLength){
                console.log("FloatArray to large for byte buffer at pos ", bPos);
                return this;
            }

            //Copy the Data one Float at a Time
            let f;
            for(f of n){
                this.bufferView.setFloat32( bPos, f, isLittleEndian ); //Need Little Endian to work in WebGL, Big is default which doesnt work.
                bPos += 4;
            }
        }else this.bufferView.setFloat32( bPos, n, isLittleEndian );

        return this;
    }


    getInt32( bPos = 0 ){
        return this.bufferView.getInt32( bPos );
    }


    setInt32( bPos = 0, n, isLittleEndian = true){

        if(n instanceof Int32Array){

            let bMax = n.length * 4 + bPos;
            if(bMax > this.arrayBuffer.byteLength){
                console.log("Int32Array to large for byte buffer at pos ", bPos);
                return this;
            }

            //Copy the Data one Int at a Time
            let f;
            for(f of n){
                this.bufferView.setInt32( bPos, f, isLittleEndian ); //Need Little Endian to work in WebGL, Big is default which doesnt work.
                bPos += 4;
            }
        }else this.bufferView.setInt32( bPos, n, isLittleEndian );

        return this;
    }
}

export default ByteBuffer;
